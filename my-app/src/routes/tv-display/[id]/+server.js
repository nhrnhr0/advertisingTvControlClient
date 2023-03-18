
/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
    const response = await event.fetch('/api/tv-display/' + event.params.id );
    return response;
} 