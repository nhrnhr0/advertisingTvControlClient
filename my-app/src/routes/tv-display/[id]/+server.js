
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
    const url =
    import.meta.env.VITE_DJANGO_SERVER_URL + "/tv/api/" +event.params.id + "/";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  let json_data = await response.json();
  return json(json_data);
}