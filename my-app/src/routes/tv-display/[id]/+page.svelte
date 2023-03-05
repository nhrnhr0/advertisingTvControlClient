<script>
import { onMount } from "svelte";
// import TvContent from "./TvContent.svelte";
// import TvFooter from "./TvFooter.svelte";
// import TvHeader from "./TvHeader.svelte";
import { page } from "$app/stores";
import { browser } from "$app/environment";
import TvDisplayFullScreen from "./TvDisplayFullScreen.svelte";
import BlankFullScreen from "./BlankFullScreen.svelte";

let api_data = $page.data;
let is_location_open_now = false;
let uri_key = "";
let page_refresh_needed = false;
let no_broadcasts_to_show = false;
onMount(() => {
  //   id = window.location;
  uri_key = $page.url.searchParams.get("key");
  update_api_data();
});

async function update_api_data() {
  const response = await fetch($page.url);
  let temp = await response.json();
  // if (!deepEqual(temp, api_data)) {
  if (api_data.updated == undefined) {
    api_data = temp;
  }
  console.log("update_api_data", temp);

  if (temp.updated != api_data.updated) {
    // window.location.reload();
    page_refresh_needed = true;
    console.log("page_refresh_needed");
    return;
  }

  // if the brodacasts have changed, reload the page
  if (temp.broadcasts.length != api_data.broadcasts.length) {
    // window.location.reload();
    page_refresh_needed = true;
    console.log("page_refresh_needed");
    return;
  }
  for (let i = 0; i < temp.broadcasts.length; i++) {
    if (temp.broadcasts[i].uuid != api_data.broadcasts[i].uuid) {
      // window.location.reload();
      page_refresh_needed = true;
      console.log("page_refresh_needed");
      return;
    }
  }
  is_location_open_now = temp.is_opening_hours_active;
}

browser && setInterval(update_api_data, 50000);
</script>

<!-- <TvHeader />
<TvContent data={api_data} />
<TvFooter /> -->
{#if is_location_open_now}
  <TvDisplayFullScreen
    data={api_data}
    {uri_key}
    {page_refresh_needed}
    bind:no_broadcasts_to_show
  />
{:else}
  <BlankFullScreen />
{/if}

<style lang="scss">
:global(body) {
  margin: 0;
  padding: 0;
  background-color: #000;
}
</style>
