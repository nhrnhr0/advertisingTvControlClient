 import { build, files, version } from '$service-worker';
 
 const worker = self;
const CACHE_NAME=`static-cache-${version}`;
 
 const to_cache = build.concat(files);
 
 worker.addEventListener('install', (event) => {
 	console.log('[ServiceWorker] Install');
 
 	event.waitUntil(
 		caches.open(CACHE_NAME).then((cache) => {
 			console.log('[ServiceWorker] Pre-caching offline page');
 			return cache.addAll(to_cache).then(() => {
 				worker.skipWaiting();
 			});
 		}),
 	);
 });
 
 worker.addEventListener('activate', (event) => {
 	console.log('[ServiceWorker] Activate');
 	// Remove previous cached data from disk
 	event.waitUntil(
 		caches.keys().then(async (keys) =>
 			Promise.all(
 				keys.map((key) => {
 					if (key !== CACHE_NAME) {
 						console.log('[ServiceWorker] Removing old cache', key);
 						return caches.delete(key);
 					}
 				}),
 			),
 		),
 	);
 	worker.clients.claim();
 });
 
 self.addEventListener('fetch', (event) => {
  // console.info(`trying to fetch from server: ${event.request.url}`);
   event.respondWith(fetch(event.request)
            .then(async (fetchResponse) => {
                console.info(`GOT from server: ${event.request.url}`);
               if (
                  event.request.url.indexOf('http') !== -1
               ) {
                  const cache = await caches.open(CACHE_NAME);
                  cache.put(event.request.url, fetchResponse.clone());
                  try {
                     // filter what to add to the cache
                     if (
                        fetchResponse.status !== 206
                     ) {
                        
                     }
                  } catch (error) {
                     console.error(error);
                  }
                  return fetchResponse;
               }
               // eslint-disable-next-line consistent-return
               return undefined;
            })
            .catch((async (error) => {
               console.error(`"${error}: ${event.request.url}`);
               const cacheResponse = await caches.match(event.request);
              if (cacheResponse)
              {
                console.info(`GOT from cache: ${event.request.url}`);
                return cacheResponse;
              }
              return undefined
            }))
    );
  });
