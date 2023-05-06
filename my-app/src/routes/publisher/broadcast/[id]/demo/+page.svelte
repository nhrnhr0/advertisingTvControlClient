<script>
import { page } from "$app/stores";
import { onDestroy, onMount } from "svelte";
import TvDisplayFullScreen from "$components/TvDisplayFullScreen.svelte";

/**@type {undefined|{}} */
let api_data = undefined;
/**
 * @type {string | number | NodeJS.Timer | undefined}
 */
let api_interval = undefined;
onMount(async () => {
  console.log("onMount");
  api_data = await get_tv_display_data();
  api_interval = setInterval(async () => {
    let temp = await get_tv_display_data();
    if (api_data == undefined) {
      api_data = temp;
    } else if (JSON.stringify(temp) != JSON.stringify(api_data)) {
      api_data = temp;
    }
  }, 3000);
});
onDestroy(() => {
  console.log("onDestroy");
  if (api_interval != undefined) {
    clearInterval(api_interval);
  }
});

async function get_tv_display_data() {
  const response = await fetch(
    "/api/get-publisher-assets-as-tv-demo/" + $page.params.id
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
