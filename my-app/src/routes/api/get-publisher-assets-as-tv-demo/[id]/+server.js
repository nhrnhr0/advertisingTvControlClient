
import { json } from '@sveltejs/kit';

export async function GET(event) {
    let url =
    import.meta.env.VITE_DJANGO_SERVER_URL + "/api/get-publisher-assets-as-tv-demo/" +event.params.id + "/";

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