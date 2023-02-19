<script>
// https://weatherwidget.io/
import { browser } from "$app/environment";
import { onMount } from "svelte";
import { get_hebrew_date } from "../../../utils/get_hebrew_date";

/**@type {any} */
export let data;
/**@type {string} */
let curr_time_str = "00:00";
/**@type {string} */
let curr_date_str = "00/00/0000";
/**@type {string} */
let curr_hebrew_date_str = "";
onMount(() => {
  // curr_time_str
  // curr_date_str
  // curr_hebrew_date_str
  setInterval(() => {
    recalc_dates();
  }, 5000);
  recalc_dates();
});

function recalc_dates() {
  let date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  curr_time_str = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  curr_date_str = `${day}/${month}/${year}`;
  curr_hebrew_date_str = get_hebrew_date();
}
</script>

<div class="content-wraper">
  <div class="top-wraper">
    <!-- whether | time (hh:mm) | title (קהילטון) | date and hebrew date -->
    <div class="wherher">
      <!-- data-label_1="באר שבע"
        data-label_2="ישראל" -->
      {#if browser}
        <a
          class="weatherwidget-io"
          href="https://forecast7.com/he/31d2534d79/beer-sheva/"
          data-textcolor="#000000"
          data-suncolor="#000000"
          data-mode="Current">באר שבע ישראל</a
        >
        <script>
        !(function (d, s, id) {
          var js,
            fjs = d.getElementsByTagName(s)[0];
          if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = "https://weatherwidget.io/js/widget.min.js";
            fjs.parentNode.insertBefore(js, fjs);
          }
        })(document, "script", "weatherwidget-io-js");
        </script>
      {/if}
    </div>
    <div class="time">{curr_time_str}</div>
    <div class="title">קהילתון</div>
    <div class="date">
      <div>
        {curr_date_str}
      </div>
      <div>
        {curr_hebrew_date_str}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
:global(body) {
  background-color: #e7e9f1 !important;
}
.top-wraper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .time {
    font-size: 2.1rem;
    // line-height: 227px;
    color: #000000;
    font-weight: 400;
    font-family: "Frank Ruhl Libre";
    text-align: center;
  }
  .title {
    font-size: 2.1rem;
    // line-height: 227px;
    color: #000000;
    font-weight: 600;
    font-family: "Frank Ruhl Libre";
    text-align: center;
  }
  .wherher {
    width: 221px;
    // height: 115px;
    color: white;
    /* border: 1px solid red; */
  }
  .date {
    font-size: 1.2rem;
    // line-height: 227px;
    color: #000000;
    font-weight: 400;
    font-family: "Frank Ruhl Libre";
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    text-align: center;
    height: 65px;
    margin-right: 10px;
    // border: 1px solid red;
    div {
      flex-grow: 1;
      //   border: 1px solid blue;
    }
  }
}
</style>
