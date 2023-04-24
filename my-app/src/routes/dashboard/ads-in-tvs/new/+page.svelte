<!-- searchbar with list of all broadcasts  -->
<script>
import { onMount } from "svelte";
import { page } from "$app/stores";
import { get_paginated_broadcasts } from "$utils/network";
import { create_new_broadcast_in_tvs } from "$utils/network";
import { goto } from "$app/navigation";

export let broadcasts = [];
let search;
onMount(async () => {
  //   get broadcasts based on the query params
  let res = await get_paginated_broadcasts();
  broadcasts = res.results;
});
async function search_broadcasts(search) {
  //   get broadcasts based on the query params
  let res = await get_paginated_broadcasts(search);
  broadcasts = res.results;
}

function broadcast_btn_click(e) {
  console.log("clicked", e);
  create_new_broadcast_in_tvs(e.id).then((res) => {
    // turn to json
    res.json().then((data) => {
      let id = data.id;
      goto(`/dashboard/ads-in-tvs/${id}/edit`);
    });
  });
}
</script>

<div class="searchbar">
  <input type="text" placeholder="חפש שידור" bind:value={search} />
  <button on:click={() => search_broadcasts(search)}> חפש </button>
  <div class="results">
    {#each broadcasts as broadcast}
      <!-- {"id":21,"name":"pizza.jpg","updated":"2023-04-20T19:21:25.432263+03:00","created":"2023-04-20T19:21:25.412263+03:00","media":"http://127.0.0.1:8000/media/broadcasts/pizza.jpg","media_type":"image","publisher":2,"publisher__name":"dsa"},{"id":20,"name":"פורים_שמח.jpg","updated":"2023-04-20T19:21:25.388266+03:00","created":"2023-04- -->
      <div class="broadcast">
        <div class="media-wraper">
          {#if broadcast.media_type == "image"}
            <img src={broadcast.media} />
          {:else if broadcast.media_type == "video"}
            <video src={broadcast.media} />
          {/if}
        </div>
        <div class="info">
          <div class="name" title={broadcast.name}>
            {broadcast.name.substring(0, 20)}
          </div>
          <div class="publisher" title={broadcast.publisher__name}>
            {broadcast.publisher__name.substring(0, 20)}
          </div>
          <button
            on:click={() => {
              broadcast_btn_click(broadcast);
            }}
          >
            הוסף
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
.results {
  margin-top: 20px;
  display: grid;
  // flex-direction: row;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.media-wraper {
  display: block;
  position: relative;
  width: 200px;
  height: calc(200px * 9 / 16);

  border-radius: 15px;
  border: 1px solid #000;
  z-index: 1;
  overflow: hidden;
}
.media-wraper img {
  aspect-ratio: 16 / 9;
  width: 100%;
}
.media-wraper video {
  aspect-ratio: 16 / 9;
  width: 100%;
}
</style>
