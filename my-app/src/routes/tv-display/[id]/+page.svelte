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
/** @type {string|null} */
let uri_key = "";
let page_refresh_needed = false;
let no_broadcasts_to_show = false;
/** @type {any} */
let interval = null;
onMount(() => {
  //   id = window.location;
  uri_key = $page.url.searchParams.get("key");
  monitor_interval();
  interval = setInterval(monitor_interval, 50000);
});

async function monitor_interval() {
  await update_api_data();
  monitor_opening_hours();
}
/**
 * @param {any} openingHours
 * @returns {boolean}
 */
function isCurrentTimeWithinOpeningHours(openingHours) {
  if (openingHours == null) {
    return true;
  }
  const currentTime = new Date();
  const currentDay = currentTime.getDay() + 1;
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  for (const entry of openingHours) {
    if (entry.weekday === currentDay) {
      const fromHour = entry.from_hour.split(":");
      const toHour = entry.to_hour.split(":");
      const openingTime = new Date();
      const closingTime = new Date();

      openingTime.setHours(fromHour[0], fromHour[1], fromHour[2]);
      closingTime.setHours(toHour[0], toHour[1], toHour[2]);

      if (currentTime >= openingTime && currentTime <= closingTime) {
        return true;
      }
    }
  }

  return false;
}

function monitor_opening_hours() {
  console.log(api_data);
  if (isCurrentTimeWithinOpeningHours(api_data.opening_hours)) {
    console.log("The current time is within the opening hours.");
    is_location_open_now = true;
  } else {
    console.log("The current time is not within the opening hours.");
    is_location_open_now = false;
  }
}

onDestroy(() => {
  if (interval != null) {
    clearInterval(interval);
  }
});

async function update_api_data() {
  try {
    const response = await fetch("/api/tv-display/" + $page.params.id);
    if (response.status != 200) {
      return;
    }
    let temp = await response.json();

    // if (!deepEqual(temp, api_data)) {
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
      console.log("api_data", api_data);
    }
  } catch (error) {
    console.log("error updating api_data");
    console.log(error);
  }
  // is_location_open_now = temp.is_opening_hours_active;
}
</script>

<!-- <TvHeader />
<TvContent data={api_data} />
<TvFooter /> -->
{#if is_location_open_now}
  <TvDisplayFullScreen data={api_data} {uri_key} {page_refresh_needed} bind:no_broadcasts_to_show />
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
