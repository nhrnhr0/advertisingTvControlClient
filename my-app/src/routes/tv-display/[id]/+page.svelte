<script>
import { onMount } from "svelte";
import TvContent from "./TvContent.svelte";
import TvFooter from "./TvFooter.svelte";
import TvHeader from "./TvHeader.svelte";
import { page } from "$app/stores";
import { browser } from "$app/environment";
import TvDisplay from "./TvDisplay.svelte";

let api_data = $page.data;
onMount(() => {
  //   id = window.location;
  update_api_data();
});

async function update_api_data() {
  const response = await fetch($page.url);
  let temp = await response.json();
  // if (!deepEqual(temp, api_data)) {
  if (api_data.updated == undefined) {
    api_data = temp;
  }
  if (temp.updated != api_data.updated) {
    window.location.reload();
  }
}

browser && setInterval(update_api_data, 10000);
</script>

<!-- <TvHeader />
<TvContent data={api_data} />
<TvFooter /> -->
<TvDisplay data={api_data} />

<style lang="scss">
:global(body) {
  margin: 0;
  padding: 0;
  background-color: #000;
}
</style>
