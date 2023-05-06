import { json } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
  const request = event.request;
  const _fetch = event.fetch;
  const data = await request.json();
  const url =
    import.meta.env.VITE_DJANGO_SERVER_URL + '/api/broadcasts-played/';
  // console.log('url===>', url);
  const response = await _fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  let json_data = await response.json();
  // console.log('got response from ', json_data);
  return json(json_data);
}