<script>
import { page } from "$app/stores";
import { onMount } from "svelte";
import { fetch_ad_info } from "$utils/network";
import { API_HOST, MEDIA_URL } from "$utils/consts";
let id = $page.params.id;

let data;
onMount(async () => {
  console.log(id);
  data = await fetch_ad_info(id);
});
</script>

<!-- 
    data:
       {
  "broadcast": 1,
  "broadcast__name": "WhatsApp Image 2023-03-20 at 08.50.33.jpeg",
  "broadcast__media": "/media/broadcasts/WhatsApp_Image_2023-03-20_at_08.50.33_icFdSkG.jpeg",
  "broadcast__media_type": "image",
  "duration": 20,
  "order": 20,
  "updated": "2023-04-19T12:53:12.559540+03:00",
  "created": "2023-04-14T01:29:39.101464+03:00",
  "master": false,
  "tvs_list": [
    {
      "id": 1,
      "name": "tv1"
    }
  ],
  "activeSchedule": {
    "id": 3,
    "content_type": "between_dates",
    "content": {
      "start_date": "2023-04-20T09:50:33Z",
      "end_date": "2023-04-22T09:50:36Z",
      "telegram_notification_in": null,
      "telegram_notification_sent": false
    },
    "is_active_now": false
  }
}
 -->

<!--
    first we display the broadcast info and a link to the admin page ({BACKEND}/admin/tv/broadcast/2/change/)
    the info is: the image/video, the duration, the order, the master
    then we show the the active schedule and the list of tvs that are playing this broadcast
-->
{#if data}
  <div class="info">
    {#if data.broadcast__media_type == "image"}
      <img
        width="177.777778px"
        height="100px"
        src={MEDIA_URL + data.broadcast__media}
        alt={data.broadcast__name}
      />
    {:else if data.broadcast__media_type == "video"}
      <video controls autoplay loop muted width="177.777778px" height="100px">
        <source src={MEDIA_URL + data.broadcast__media} type="video/mp4" />
      </video>
    {/if}
    <p>
      שם השידור: {data.broadcast__name}
    </p>
    <form method="post">
      <div class="form-group">
        <label for="duration">משך</label>
        <input
          type="number"
          name="duration"
          id="duration"
          value={data.duration}
          min="1"
          max="100"
        />
      </div>
      <div class="form-group">
        <label for="order">סדר</label>
        <input
          type="number"
          name="order"
          id="order"
          value={data.order}
          min="1"
          max="100"
        />
      </div>
      <div class="form-group">
        <label for="master">מאסטר</label>
        <input
          type="checkbox"
          name="master"
          id="master"
          checked={data.master}
          value={data.master}
        />
      </div>
      <button type="submit">Save</button>
    </form>
    <a
      href="{API_HOST}/admin/tv/broadcast/{id}/change/"
      target="popup"
      on:click={() => {
        window.open(
          API_HOST + "/admin/tv/broadcast/{id}/change/",
          "popup",
          "width=600,height=600"
        );
        return false;
      }}
    >
      לשידור באדמין
    </a>
  </div>

  <div class="tvs">
    <h2>טלוויזיות</h2>
    <ul>
      {#each data.tvs_list as tv}
        <li>{tv.name}</li>
      {/each}
    </ul>
    <!-- button to edit selected tvs -->
  </div>
{/if}
