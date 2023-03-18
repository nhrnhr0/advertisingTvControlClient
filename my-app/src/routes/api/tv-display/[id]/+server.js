
import { json } from '@sveltejs/kit';

export async function GET(event) {
    let url =
    import.meta.env.VITE_DJANGO_SERVER_URL + "/tv/api/" +event.params.id + "/";
    let inactive = event.url.searchParams.get('inactive');
    if (inactive === 'true') {
        url += '?inactive=true';
    }
    console.log('url===>', url);
  const response = await event.fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  let json_data = await response.json();
  console.log('got response from ', url);
    // return json_data; 
    return json(json_data);
}