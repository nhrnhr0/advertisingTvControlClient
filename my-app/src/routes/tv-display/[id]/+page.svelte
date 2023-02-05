<script>
import { onMount } from "svelte";
import TvContent from "./TvContent.svelte";
import TvFooter from "./TvFooter.svelte";
import TvHeader from "./TvHeader.svelte";
import { page } from "$app/stores";
import { browser } from "$app/environment";

// {
//     "id": 1,
//     "name": "tv1",
//     "updated": "2023-01-31T16:38:01.423315Z",
//     "created": "2023-01-31T16:26:01.879116Z",
//     "get_absolute_url": "/tv/1",
//     "broadcasts": [
//     {
//     "broadcast": 1,
//     "broadcast__name": "allready_connected_popup.jpeg",
//     "broadcast__media": "broadcasts/allready_connected_popup_Q71TFVV.jpeg",
//     "duration": 20,
//     "order": 10,
//     "updated": "2023-01-31T16:26:01.880116Z",
//     "created": "2023-01-31T16:26:01.880116Z"
//     },
//     {
//     "broadcast": 2,
//     "broadcast__name": "WhatsApp Image 2023-01-25 at 09.22.45.jpeg",
//     "broadcast__media": "broadcasts/WhatsApp_Image_2023-01-25_at_09.22.45.jpeg",
//     "duration": 20,
//     "order": 10,
//     "updated": "2023-01-31T16:26:01.881118Z",
//     "created": "2023-01-31T16:26:01.881118Z"
//     },
//     {
//     "broadcast": 3,
//     "broadcast__name": "החלבן-לוגו.png",
//     "broadcast__media": "broadcasts/החלבן-לוגו.png",
//     "duration": 20,
//     "order": 10,
//     "updated": "2023-01-31T16:26:01.881118Z",
//     "created": "2023-01-31T16:26:01.881118Z"
//     },
//     {
//     "broadcast": 4,
//     "broadcast__name": "vid1.mp4",
//     "broadcast__media": "broadcasts/vid1.mp4",
//     "duration": 20,
//     "order": 10,
//     "updated": "2023-01-31T16:38:01.424315Z",
//     "created": "2023-01-31T16:38:01.424315Z"
//     },
//     {
//     "broadcast": 5,
//     "broadcast__name": "whatsapp_list (91).xlsx",
//     "broadcast__media": "broadcasts/whatsapp_list_91_MInWM9C.xlsx",
//     "duration": 20,
//     "order": 10,
//     "updated": "2023-01-31T16:38:01.424315Z",
//     "created": "2023-01-31T16:38:01.424315Z"
//     }
//     ]
// }

let api_data = $page.data;
// header with the time and date
// forrter with the barcode for the user to scan and the logo of the tv
// content: the broadcasts in order looped
// every X secounds check the api for changes
// if there are changes, update the content

onMount(() => {
  //   id = window.location;
  update_api_data();
});

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}
function isObject(object) {
  return object != null && typeof object === "object";
}

async function update_api_data() {
  const response = await fetch($page.url);
  let temp = await response.json();
  // if (!deepEqual(temp, api_data)) {
  if (temp.updated != api_data.updated) {
    refresh_api_data();
    api_data = temp;
  }
  console.log(api_data);
}

function refresh_api_data() {
  // dispatch the event to the TvContent component
  const event = new CustomEvent("broadcast_refresh", {
    detail: {
      data: api_data,
    },
  });
  document.dispatchEvent(event);
}

browser && setInterval(update_api_data, 10000);
</script>

<TvHeader />
<TvContent data={api_data} />
<TvFooter />

<style lang="scss">
:global(body) {
  margin: 0;
  padding: 0;
  background-color: #000;
}
</style>
