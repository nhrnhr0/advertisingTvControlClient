<!-- make a request to -->

<script>
import { onMount } from "svelte";
import { get_ads_in_tvs } from "$utils/network";
import { MEDIA_URL } from "$utils/consts";
import ScheduleDisplay from "../../../components/ScheduleDisplay.svelte";
import { API_HOST } from "../../../utils/consts";

let data = null;
onMount(async () => {
  data = await get_ads_in_tvs();
});
function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}
</script>

{#if !data}
  <div>loading...</div>
{:else}
  <div class="table-wraper">
    <table>
      <thead>
        <tr>
          <th class="table-index">#</th>
          <th>שם</th>
          <th>פרטים</th>
          <th>טלוויזיות</th>
          <th>לוח זמנים</th>
          <th>פעולות</th>
        </tr>
      </thead>
      <tbody>
        {#each data as ad, i}
          <tr>
            <td class="table-index">
              {i + 1}
            </td>
            <td>
              {#if ad.broadcast__media_type == "image"}
                <img
                  src={MEDIA_URL + ad.broadcast__media}
                  alt={ad.broadcast__name}
                  width="177.777778px"
                  height="100px"
                />
                <br />
                תמונה
              {:else if ad.broadcast__media_type == "video"}
                <video
                  src={MEDIA_URL + ad.broadcast__media}
                  alt={ad.broadcast__name}
                  width="177.777778px"
                  height="100px"
                  controls
                  pause
                  loop
                  muted
                />
                <br />
                סרטון
              {/if}
              <br />
              {truncateString(ad.broadcast__name, 22)}
              <br />
              {ad.broadcast__publisher__name}
            </td>
            <td>
              מאסטר: {ad.master ? "כן" : "לא"}<br />
              סדר: {ad.order}<br />
              משך: {ad.duration} שניות
            </td>
            <td>
              <ul>
                {#each ad.tvs_list as tv}
                  <li>
                    <a href="{API_HOST}/dashboard/tvs/{tv.id}">{tv.name}</a>
                  </li>
                {/each}
              </ul>
            </td>
            <td>
              {#if ad.activeSchedule}
                <ScheduleDisplay
                  schedule={ad.activeSchedule}
                  id={ad.activeSchedule.id}
                  tvs={ad.tvs_list}
                />
              {:else}
                לא קיים לוח זמנים
              {/if}
            </td>
            <td>
              <a href="/dashboard/ads-in-tvs/{ad.id}/edit">ערוך (ID:{ad.id})</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <!-- link to create new broadcast in tvs -->
  <!-- <a href="/dashboard/ads-in-tvs/new">הוספה</a> -->
  <button on:click={() => (window.location.href = "/dashboard/ads-in-tvs/new")}>
    הוספת שידור לטלוויזיות
  </button>
{/if}

<!-- [ { "broadcast": 2, "broadcast__name": "WhatsApp Image 2023-03-20 at 08.44.08 (1).jpeg", "broadcast__media": "/media/broadcasts/WhatsApp_Image_2023-03-20_at_08.44.08_1_kjEyKVl.jpeg", "broadcast__media_type": "image", "duration": 20, "order": 10, "updated": "2023-04-14T02:08:32.649549+03:00", "created": "2023-04-14T01:29:33.229301+03:00", "master": false, "tvs_list": [ { "id": 1, "name": "tv1" } ], "activeSchedule": { "id": 2, "content_type": "plays_countdown", "content": { "plays_left": 100, "telegram_notification_in": 0, "telegram_notification_sent": false } } }, { "broadcast": 1, "broadcast__name": "WhatsApp Image 2023-03-20 at 08.50.33.jpeg", "broadcast__media": "/media/broadcasts/WhatsApp_Image_2023-03-20_at_08.50.33_icFdSkG.jpeg", "broadcast__media_type": "image", "duration": 20, "order": 20, "updated": "2023-04-14T01:29:40.511571+03:00", "created": "2023-04-14T01:29:39.101464+03:00", "master": false, "tvs_list": [ { "id": 1, "name": "tv1" } ], "activeSchedule": null } ] -->
<style lang="scss">
.table-wraper {
  overflow-x: auto;
  margin: 0 auto;
  width: fit-content;
  table {
    border-collapse: collapse;
    font-size: 0.9em;
    font-family: sans-serif;
    text-align: right;
    width: 100%;
    margin-top: 1em;
    thead {
      background-color: #009879;
      color: #ffffff;
      tr {
        th {
          padding: 12px 15px;
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid #dddddd;
        td {
          padding: 12px 15px;

          &.table-index {
            color: #ededed;
            font-weight: bold;
            background-color: #848484;
          }
        }
      }
    }
  }
}
</style>
