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

let start_show_content = false;

onMount(() => {
  setInterval(() => {
    recalc_dates();
  }, 5000);
  recalc_dates();
  load_broadcasts();
});

$: {
  if (data && data["broadcasts"]) {
    load_broadcasts();
  }
}

/**
 * @type {any[]}
 */
let broadcasts_statuses;

function load_broadcasts() {
  if (!browser) return;
  let broadcasts = data["broadcasts"];
  let html_container = document.getElementById("hidden-content");
  if (html_container == null) return;
  html_container.innerHTML = "";
  broadcasts_statuses = [];
  const BASE_SRC = import.meta.env.VITE_DJANGO_SERVER_URL;
  for (let i = 0; i < broadcasts.length; i++) {
    broadcasts_statuses.push({
      broadcast: {
        id: broadcasts[i]["broadcast"],
        media_type: broadcasts[i]["broadcast__media_type"],
        media: BASE_SRC + broadcasts[i]["broadcast__media"],
        duration: broadcasts[i]["duration"],
      },
      is_loaded: false,
    });
    broadcasts_statuses = [...broadcasts_statuses];
    if (broadcasts[i]["broadcast__media_type"] == "video") {
      let video = document.createElement("video");
      video.src = BASE_SRC + broadcasts[i]["broadcast__media"];
      video.preload = "auto";
      video.oncanplaythrough = () => {
        broadcasts_statuses[i]["is_loaded"] = true;
        // if all is loaded, we can start play
        check_if_all_loaded();
      };
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.load();
      html_container.appendChild(video);
    } else {
      let image = document.createElement("img");
      image.src = BASE_SRC + broadcasts[i]["broadcast__media"];
      image.onload = () => {
        broadcasts_statuses[i]["is_loaded"] = true;
        // if all is loaded, we can start play
        check_if_all_loaded();
      };
      html_container.appendChild(image);
    }
  }
}

let current_show_index = 0;

function check_if_all_loaded() {
  let all_loaded = broadcasts_statuses.length > 0;
  for (let i = 0; i < broadcasts_statuses.length; i++) {
    if (!broadcasts_statuses[i]["is_loaded"]) {
      all_loaded = false;
      break;
    }
  }
  if (all_loaded && !start_show_content) {
    start_show_content = true;
    current_show_index = 0;
    set_broadcast_loop(current_show_index);
  }
}

function set_broadcast_loop(index) {
  let html_container = document.getElementById("hidden-content");
  if (html_container == null) return;
  let children = html_container.children;
  debugger;
  for (let i = 0; i < children.length; i++) {
    if (i == index) {
      children[i].style.display = "block";
    } else {
      children[i].style.display = "none";
    }
  }
  setTimeout(() => {
    current_show_index++;
    if (current_show_index >= children.length) {
      current_show_index = 0;
    }
    set_broadcast_loop(current_show_index);
  }, broadcasts_statuses[index]["broadcast"]["duration"] * 1000);
}

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
    <div class="left-side">
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
    </div>

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
  <div class="content-and-right-flex">
    <div class="right-wraper">
      <h3>
        מפרסם
        <br />
        המודעה
      </h3>
      <div class="publisher-phone">054-123-4567</div>
      <div class="publisher-qr">
        <img src="/qr-code.png" alt="qr" />
      </div>
    </div>
    <div class="content">
      <!-- <div class="ratio ratio-16x9"> -->
      <!-- <img src="/temp.jpg" alt="temp" /> -->
      <!-- {start_show_content}
      {JSON.stringify(broadcasts_statuses)} -->
      <div id="hidden-content" />
      <!-- </div> -->
    </div>
  </div>

  <div class="bottom-wraper">
    <div class="bottom-left">
      <div class="bottom-left-title">לכל המפרסמים</div>
      <div class="bottom-left-qr">
        <img src="/qr-code.png" alt="qr" />
      </div>
    </div>
    <div class="bottom-right">
      <div class="bottom-right-title">
        רוצים להופיע גם? צרו קשר עוד היום 054-7919908
      </div>
      <div class="bottom-right-qr">
        <img src="/qr-code.png" alt="qr" />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
#hidden-content {
  // display: none;
}
:global(body) {
  overflow: hidden;
  height: 100vh;
  background-color: #e7e9f1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(231, 233, 241, 1) 100%
  );
}
.content-wraper {
  max-height: 100vh;
  .content-and-right-flex {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    .right-wraper {
      // border: 1px solid blue;
      text-align: center;
      flex-grow: 1;
      h3 {
        font-size: 65px;
        color: #000000;
        font-weight: 500;
        font-family: "Frank Ruhl Libre";
        text-align: center;
      }
      .publisher-phone {
        font-size: 2.1rem;
        // line-height: 227px;
        color: #000000;
        font-weight: 400;
        font-family: "Frank Ruhl Libre";
        text-align: center;
      }

      .publisher-qr {
        width: 100%;
        height: 100%;
        object-fit: contain;
        img {
          width: 100%;
          // height: 100%;
          // max-height: 350px;
          // height 150-450 px
          height: clamp(150px, 14vw, 450px);
          object-fit: contain;
          // border: 1px solid red;
        }
      }
    }
  }
  .content {
    height: 100%;
    flex-grow: 1;
    // width: 100%;
    margin-left: 25px;
    // border: 1px solid red;
    :global(img),
    :global(video) {
      width: auto;
      height: 100%;
      // border: 1px solid red;
      height: calc(100vh - 160px);
      object-fit: contain;
      border-radius: 50px;
      border: 1px solid #000000;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
        rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    }
  }

  .bottom-wraper {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    .bottom-left {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      flex-grow: 1;
      .bottom-left-title {
        font-size: 2.1rem;
        // line-height: 227px;
        color: #000000;
        font-weight: 400;
        font-family: "Frank Ruhl Libre";
        text-align: center;
        display: inline-block;
        width: max-content;
        margin-right: 80px;
        margin-left: 15px;
      }
      .bottom-left-qr {
        // width: 100%;
        height: 100%;
        object-fit: contain;
        flex-grow: 0;
        img {
          width: 100%;
          // height: 100%;
          // max-height: 350px;
          // height 150-450 px
          height: 60px;
          object-fit: contain;
          // border: 1px solid red;
        }
      }
    }
    .bottom-right {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      flex-grow: 1;
      .bottom-right-title {
        font-size: 2.1rem;
        color: #000000;
        font-weight: 400;
        font-family: "Frank Ruhl Libre";
        text-align: center;
        display: inline-block;
        width: max-content;
        margin-left: 10px;
      }
      .bottom-right-qr {
        height: 100%;
        object-fit: contain;
        flex-grow: 0;
        img {
          width: 100%;
          height: 60px;
          object-fit: contain;
        }
      }
    }
  }
}
.top-wraper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 2.1rem;
    // line-height: 227px;
    color: #000000;
    font-weight: 600;
    font-family: "Frank Ruhl Libre";
    text-align: center;
  }

  .left-side {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .wherher {
      width: 221px;
      // height: 115px;
      color: white;
      margin-bottom: -15px;
      /* border: 1px solid red; */
    }
    .time {
      font-size: 2.1rem;
      // line-height: 227px;
      color: #000000;
      font-weight: 400;
      font-family: "Frank Ruhl Libre";
      text-align: center;
    }
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
