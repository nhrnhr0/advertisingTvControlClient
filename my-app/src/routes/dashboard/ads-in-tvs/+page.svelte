<!-- make a request to -->

<script>
import { onMount } from "svelte";
import { get_ads_in_tvs } from "$utils/network";
import { MEDIA_URL } from "$utils/consts";
import ScheduleDisplay from "../../../components/ScheduleDisplay.svelte";

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
  <table>
    <thead>
      <tr>
        <th>שם</th>
        <th>פרטים</th>
        <th>טלוויזיות</th>
        <th>לוח זמנים</th>
        <th>פעולות</th>
      </tr>
    </thead>
    <tbody>
      {#each data as ad}
        <tr>
          <td>
            <img
              src={MEDIA_URL + ad.broadcast__media}
              alt={ad.broadcast__name}
              width="177.777778px"
              height="100px"
            />
            <br />
            {truncateString(ad.broadcast__name, 22)}
          </td>
          <td>
            מאסטר: {ad.master ? "כן" : "לא"}<br />
          </td>
          <td>
            <ul>
              {#each ad.tvs_list as tv}
                <li>
                  <a href="/dashboard/tvs/{tv.id}">{tv.name}</a>
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
            <a href="/dashboard/ads-in-tvs/{ad.broadcast}/edit">ערוך</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<!-- [ { "broadcast": 2, "broadcast__name": "WhatsApp Image 2023-03-20 at 08.44.08 (1).jpeg", "broadcast__media": "/media/broadcasts/WhatsApp_Image_2023-03-20_at_08.44.08_1_kjEyKVl.jpeg", "broadcast__media_type": "image", "duration": 20, "order": 10, "updated": "2023-04-14T02:08:32.649549+03:00", "created": "2023-04-14T01:29:33.229301+03:00", "master": false, "tvs_list": [ { "id": 1, "name": "tv1" } ], "activeSchedule": { "id": 2, "content_type": "plays_countdown", "content": { "plays_left": 100, "telegram_notification_in": 0, "telegram_notification_sent": false } } }, { "broadcast": 1, "broadcast__name": "WhatsApp Image 2023-03-20 at 08.50.33.jpeg", "broadcast__media": "/media/broadcasts/WhatsApp_Image_2023-03-20_at_08.50.33_icFdSkG.jpeg", "broadcast__media_type": "image", "duration": 20, "order": 20, "updated": "2023-04-14T01:29:40.511571+03:00", "created": "2023-04-14T01:29:39.101464+03:00", "master": false, "tvs_list": [ { "id": 1, "name": "tv1" } ], "activeSchedule": null } ] -->
