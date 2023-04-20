<!-- searchbar with list of all broadcasts  -->
<script>
import { onMount } from "svelte";
import { page } from "$app/stores";

export let broadcasts = [];
let search;
onMount(async () => {
  //   get broadcasts based on the query params
  broadcasts = await get_broadcasts();
});
function search_broadcasts(search) {
  //   get broadcasts based on the query params
  broadcasts = await get_broadcasts(search);
}
</script>

<div class="searchbar">
  <input type="text" placeholder="חפש שידור" bind:value={search} />
  <button on:click={() => search_broadcasts(search)}> חפש </button>
  <ul>
    {#each broadcasts as broadcast}
      <li
        on:click={() => {
          search = broadcast.name;
          selected_broadcast = broadcast;
        }}
      >
        {broadcast.name}
      </li>
    {/each}
  </ul>
</div>
