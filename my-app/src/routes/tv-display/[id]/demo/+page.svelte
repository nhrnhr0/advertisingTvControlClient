<script>
import { page } from "$app/stores";
import { onMount } from "svelte";
import TvDisplayFullScreen from "$components/TvDisplayFullScreen.svelte";

/**@type {undefined|{}} */
let api_data = undefined;
onMount(async () => {
  console.log("onMount");
  api_data = await get_tv_display_data();
});

async function get_tv_display_data() {
  let get_inactive = $page.url.searchParams.get("inactive");
  const response = await fetch(
    "/api/tv-display/" + $page.params.id + "?inactive=" + get_inactive
  );
  let temp = await response.json();
  console.log("get_tv_display_data", temp);
  return temp;
}
</script>

{#if api_data != undefined}
  <TvDisplayFullScreen
    data={api_data}
    uri_key=""
    page_refresh_needed={false}
    is_demo={true}
  />
{/if}
