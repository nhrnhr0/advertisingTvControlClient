<script>
import humanizeDuration from "humanize-duration";
export let schedule;
export let id;
export let tvs;
</script>

<!--
            "id": 2,
            "content_type": "plays_countdown",
            "content": {
                "plays_left": 100,
                "telegram_notification_in": 0,
                "telegram_notification_sent": false
            }
-->
{#if schedule}
  <div class="active">
    {#if schedule.is_active_now}
      <img src="/admin/img/icon-yes.svg" alt="פעיל" />
      פעיל
    {:else}
      <img src="/admin/img/icon-no.svg" alt="לא פעיל" />
      לא פעיל
    {/if}
  </div>
  {#if schedule.content_type == "plays_countdown"}
    <div class="title">ספירת שידורים</div>
    <div class="content">
      נשארו עוד {schedule.content.plays_left} שידורים
    </div>
  {:else if schedule.content_type == "between_dates"}
    <!-- "content": {
                "start_date": "2023-04-20T09:50:33Z",
                "end_date": "2023-04-22T09:50:36Z",
        } -->
    <div class="title">בין תאריכים</div>
    <div class="content">
      מתאריך {new Date(schedule.content.start_date).toLocaleString("he")}<br />
      עד {new Date(schedule.content.end_date).toLocaleString("he")}
      <br />
      {#if schedule.is_active_now}
        נשארו {humanizeDuration(
          new Date(schedule.content.end_date).getTime() - new Date().getTime(),
          { language: "he" }
        )}
      {/if}
    </div>
  {:else if schedule.content_type == "manual_control"}
    <div class="title">בקרה ידנית</div>
    <div class="content" />
  {/if}
{/if}
