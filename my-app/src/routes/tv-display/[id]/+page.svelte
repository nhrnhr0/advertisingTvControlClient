<script>
import { onDestroy, onMount } from "svelte";
// import TvContent from "./TvContent.svelte";
// import TvFooter from "./TvFooter.svelte";
// import TvHeader from "./TvHeader.svelte";
import { page } from "$app/stores";
import { browser } from "$app/environment";
import TvDisplayFullScreen from "$components/TvDisplayFullScreen.svelte";
import BlankFullScreen from "$components/BlankFullScreen.svelte";

let api_data = $page.data;
let is_location_open_now = false;
let uri_key = "";
let page_refresh_needed = false;
let no_broadcasts_to_show = false;
let interval = null;
onMount(() => {
  //   id = window.location;
  uri_key = $page.url.searchParams.get("key");
  update_api_data();
  interval = setInterval(update_api_data, 50000);
});

onDestroy(() => {
  if (interval != null) {
    clearInterval(interval);
  }
});

async function update_api_data() {
  const response = await fetch("/api/tv-display/" + $page.params.id);
  if (response.status != 200) {
    return;
  }
  let temp = await response.json();

  // if (!deepEqual(temp, api_data)) {
  debugger;
  if (api_data.updated == undefined) {
    api_data = temp;
  }
  if (JSON.stringify(temp) != JSON.stringify(api_data)) {
    // api_data = temp;
    console.log("api_data updated", api_data);
    console.log("temp", temp);
    page_refresh_needed = true;
    console.log("page_refresh_needed");
    return;
  } else {
    console.log("no updates to api_data");
  }
  is_location_open_now = temp.is_opening_hours_active;
}
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
  <BlankFullScreen {page_refresh_needed} />
{/if}

<style lang="scss">
:global(body) {
  margin: 0;
  padding: 0;
  background-color: #000;
}
</style>
