<script>
import { getModalContext } from "smodale";
import { onMount } from "svelte";
import { update_active_schedule } from "$utils/network";

const { hide, cancel } = getModalContext();
const OPTIONS_LIST = {
  plays_countdown: "ספירת שידורים לאחור",
  between_dates: "בין תאריכים",
  manual_control: "שליטה ידנית",
};
const OPTIONS_LIST_KEYS = Object.keys(OPTIONS_LIST);
export let schedule;
export let broadcast_in_tvs_id;
let new_info = {};
const onCancelClick = () => cancel("Something went wrong");
const onOkClick = () => {
  debugger;
  // send request to update the schedule
  update_active_schedule(broadcast_in_tvs_id, new_info).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        hide({ schedule: data });
      });
    }
  });
};

onMount(() => {
  console.log("schedule", schedule);
  new_info = { ...schedule };
});
function option_clicked(option) {
  return () => {
    if (schedule.content_type == option) {
      new_info = { ...schedule };
      return;
    }
    if (new_info.content_type != option) {
      let temp = { content_type: option, content: {} };
      new_info = { ...temp };
    }
  };
}

function start_date_changed(e) {
  //   set new_info.content.start_date to e.target.value + "Z"
  new_info.content.start_date = e.target.value + "Z";
}
function end_date_changed(e) {
  //   set new_info.content.end_date to e.target.value + "Z"
  new_info.content.end_date = e.target.value + "Z";
}
</script>

<div class="modal-wraper">
  <!-- schedule: {"id":3,"content_type":"between_dates","content":{"start_date":"2023-04-20T09:50:33Z","end_date":"2023-04-22T09:50:36Z","telegram_notification_in":null,"telegram_notification_sent":false},"is_active_now":true} -->
  <!-- show the 3 options as buttons and set the selected as active based on content_type -->
  <div class="option-btns-wraper">
    {#each OPTIONS_LIST_KEYS as option}
      <button
        class="option-btn"
        class:active={new_info.content_type == option}
        on:click={option_clicked(option)}
      >
        {OPTIONS_LIST[option]}
      </button>
    {/each}
  </div>
  <!-- plays_countdown -->
  {#if new_info.content_type == OPTIONS_LIST_KEYS[0]}
    <div>
      <span>כמות שידורים שנשארו: </span>
      <span>{new_info.content.plays_left || 0}</span>
    </div>

    <div>
      <label for="change_plays_left">כמות להוספה</label>
      <input
        type="number"
        name="change_plays_left"
        bind:value={new_info.change_plays_left}
      />
    </div>
  {:else if new_info.content_type == OPTIONS_LIST_KEYS[1]}
    <!-- between_dates -->
    <label for="start_date"> מתאריך </label>
    <input
      name="start_date"
      type="datetime-local"
      value={(new_info.content.start_date || "").replace("Z", "")}
      on:change={start_date_changed}
    />
    <label for="end_date"> עד </label>
    <input
      name="end_date"
      type="datetime-local"
      value={(new_info.content.end_date || "").replace("Z", "")}
      on:change={end_date_changed}
    />
  {:else if new_info.content_type == OPTIONS_LIST_KEYS[2]}
    <!-- manual_control -->
    <label for="is_active_bool">האם פעיל</label>
    <input
      type="checkbox"
      name="is_active_bool"
      bind:checked={new_info.content.is_active}
    />
  {/if}

  <div class="submit-wraper">
    <button on:click={onCancelClick}>Cancel</button>
    <button on:click={onOkClick}>Ok</button>
  </div>
</div>

<style lang="scss">
.modal-wraper {
  min-height: 450px;
  position: relative;
  .option-btns-wraper {
    display: flex;
    flex-direction: row;
    gap: 10px;

    .option-btn {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #fff;
      &.active {
        background-color: #ccc;
      }
    }
  }
  .submit-wraper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
}
</style>
