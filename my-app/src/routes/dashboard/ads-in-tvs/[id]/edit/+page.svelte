<script>
import { page } from "$app/stores";
import { onMount } from "svelte";
import { fetch_ad_info } from "$utils/network";
import { API_HOST, MEDIA_URL } from "$utils/consts";
import smodale from "smodale";
import PopupEditTvsList from "$components/popups/EditTvsList.svelte";
import ScheduleDisplay from "$components/ScheduleDisplay.svelte";
import PopupEditSchedule from "$components/popups/EditSchedule.svelte";

let id = $page.params.id;
let data;
const modal_breakpoints = {
  "32rem": {
    centered: true,
    maxWidth: "var(--max-width-xxs)",
    margin: "var(--component-padding)",
    borderRadius: "var(--radius-md)",
    boxShadow: "7px 7px 20px 0 #717171b4",
  },
  "768px": {
    centered: true,
    backdropColor: "rgba(255, 255, 255, 0.6)",
    boxShadow: "0 0 20px 3px #717171b4",
    maxWidth: "var(--max-width-xs)",
  },
  "80rem": {
    centered: true,
    margin: "var(--component-padding) auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "0 0 20px 3px #717171b4",
    maxWidth: "48rem",
  },
};
function edit_tvs_btn() {
  let existing_tvs = [];
  if (data && data.tvs_list) {
    for (let i = 0; i < data.tvs_list.length; i++) {
      existing_tvs.push(data.tvs_list[i].id);
    }
  }
  smodale
    .show(
      PopupEditTvsList,
      { broadcast_in_tvs_id: data.id, tvs_list: data.tvs_list },
      { breakpoints: modal_breakpoints }
    )
    .then((res) => {
      console.log(res); // { selected: [{id: 1, name: "Tv1"}] }
      data.tvs_list = res.selected;
    })
    .catch((error) => {
      console.log(error.message); // 'Something went wrong'
    });
}

function edit_active_schedule_btn() {
  debugger;
  smodale
    .show(
      PopupEditSchedule,
      { broadcast_in_tvs_id: data.id, schedule: data.activeSchedule },
      { breakpoints: modal_breakpoints }
    )
    .then((res) => {
      debugger;
      data.activeSchedule = res.schedule;
    })
    .catch((error) => {
      console.log(error.message); // 'Something went wrong'
    });
}

onMount(async () => {
  console.log(id);
  data = await fetch_ad_info(id);
});
</script>

<div class="page-wraper">
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
    </div>

    <div class="detail">
      משך: {data.duration}
      <br />
      סדר: {data.order}
      <br />
      מאסטר: {data.master ? "כן" : "לא"} <br />
      עודכן לאחרונה: {data.updated}
      <br />
      נוצר: {data.created}
      <br />
      <a
        href="{API_HOST}/admin/tv/broadcast/{data.broadcast}/change/"
        target="popup"
        on:click={() => {
          window.open(
            API_HOST + "/admin/tv/broadcast/{data.broadcast}/change/",
            "popup",
            "width=600,height=600"
          );
          return false;
        }}
      >
        לשידור באדמין
      </a>
      <a
        href="{API_HOST}/admin/tv/broadcastintvs/{data.id}/change/"
        target="popup"
        on:click={() => {
          window.open(
            API_HOST + "/admin/tv/broadcastintvs/{data.id}/change/",
            "popup",
            "width=600,height=600"
          );
          return false;
        }}
      >
        לשידור בתוך הטלווזיות
      </a>
    </div>
    <div class="flex-wraper">
      <div class="tvs">
        <h2>פעיל ב</h2>
        <ul>
          {#each data.tvs_list as tv}
            <li>{tv.name}</li>
          {/each}
        </ul>
        <!-- button to edit selected tvs -->
        <button on:click={edit_tvs_btn}>ערוך רשימת טלוויזיות</button>
      </div>

      <div class="schedule">
        <h2>לוח זמנים</h2>
        {#if data.activeSchedule}
          <!-- "activeSchedule": { "id": 2, "content_type": "plays_countdown", "content": { "plays_left": 100, "telegram_notification_in": 0, "telegram_notification_sent": false } } -->
          <ScheduleDisplay
            schedule={data.activeSchedule}
            id={data.activeSchedule.id}
            tvs={data.tvs_list}
          />
        {:else}
          לא קיים לוח זמנים
        {/if}
        <button on:click={edit_active_schedule_btn}>ערוך לוח זמנים</button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
.page-wraper {
  max-width: 95vw;
  margin: 0 auto;
  margin-top: 1em;
}
.info {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1em;
}
.detail {
  font-size: 0.8em;
  color: #666;
  background-color: #eee;
}
.tvs {
  background-color: #eee;
  flex: 1;
}
.schedule {
  background-color: #eee;
  flex: 1;
}
.flex-wraper {
  gap: 25px;
}
</style>
