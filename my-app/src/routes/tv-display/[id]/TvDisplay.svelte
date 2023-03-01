<script>
// https://weatherwidget.io/
import { browser } from "$app/environment";
import { onMount, onDestroy } from "svelte";
import { get_hebrew_date } from "../../../utils/get_hebrew_date";
import { Circle } from "svelte-loading-spinners";
import { broadcasts_played_array } from "../../../stores/stores";

/**@type {any} */
export let data;
/**@type {string} */
let curr_time_str = "00:00";
/**@type {string} */
let curr_date_str = "00/00/0000";
/**@type {string} */
let curr_hebrew_date_str = "";

let start_show_content = false;

/**
 * @type {string | number | NodeJS.Timer | undefined}
 */
let send_played_broadcasts_interval; // = setInterval(() => {});
onMount(() => {
  setInterval(() => {
    recalc_dates();
  }, 5000);
  recalc_dates();
  load_broadcasts();
  send_played_broadcasts_interval = setInterval(() => {
    send_played_broadcasts();
  }, 60000);
});
onDestroy(() => {
  if (send_played_broadcasts_interval) {
    clearInterval(send_played_broadcasts_interval);
  }
});

function send_played_broadcasts() {
  // if (!browser) return;
  // if ($broadcasts_played_array.length == 0) return;
  console.log("send_played_broadcasts");
  let data = { broadcasts: $broadcasts_played_array };
  // data.append("broadcasts", JSON.stringify(broadcasts_played));
  let api_url = "/api/broadcasts-played";
  // import.meta.env.VITE_DJANGO_SERVER_URL +
  fetch(api_url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["success"]) {
        let last_uuid_recvied = data["last_uuid_played"];
        let new_broadcasts_played = [];
        // filter out all the broadcasts that were played (by uuid)
        if (last_uuid_recvied) {
          let idx = $broadcasts_played_array.findIndex((v) => {
            return v.uuid == last_uuid_recvied;
          });
          if (idx != -1) {
            broadcasts_played_array.update((v) => {
              v.splice(0, idx + 1);
              return v;
            });
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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
  if (broadcasts == null) return;
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
      let video_frame = document.createElement("div");
      video_frame.className = "frame";
      video_frame.appendChild(video);
      html_container.appendChild(video_frame);
    } else {
      let image = document.createElement("img");
      image.src = BASE_SRC + broadcasts[i]["broadcast__media"];
      image.onload = () => {
        broadcasts_statuses[i]["is_loaded"] = true;
        // if all is loaded, we can start play
        check_if_all_loaded();
      };
      let image_frame = document.createElement("div");
      image_frame.className = "frame";
      image_frame.appendChild(image);
      html_container.appendChild(image_frame);
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
  console.log("set_broadcast_loop", index);
  let html_container = document.getElementById("hidden-content");
  if (html_container == null) return;
  let children = html_container.children;
  for (let i = 0; i < children.length; i++) {
    if (i == index) {
      if (broadcasts_statuses[i]["broadcast"]["media_type"] == "video") {
        children[i].children[0].currentTime = 0;
        children[i].children[0].play();
      }

      children[i].style.display = "block";
      // children[i].style.visibility = "visible";
    } else {
      children[i].style.display = "none";
      // children[i].style.visibility = "hidden";
    }
  }
  setTimeout(() => {
    broadcast_played(broadcasts_statuses[index]["broadcast"]["id"]);
    current_show_index++;
    if (current_show_index >= children.length) {
      current_show_index = 0;
    }
    set_broadcast_loop(current_show_index);
  }, broadcasts_statuses[index]["broadcast"]["duration"] * 1000);
}

function generage_uuid() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    uuid += Math.floor(Math.random() * 16).toString(16);
  }
  return uuid;
}

/**
 * @param {number} broadcast_id
 */
function broadcast_played(broadcast_id) {
  let t = new Date();
  // t.setDate(t.getDate() - 5);
  const played_info = {
    broadcast: broadcast_id,
    tv_display: data["id"],
    time: new Date().toISOString(),
    uuid: generage_uuid(),
  };

  broadcasts_played_array.update((n) => {
    // @ts-ignore
    n.push(played_info);
    return n;
  });
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
            href="https://forecast7.com/he/31d2434d36/nir-yitzhak/"
            data-icons="Climacons Animated"
            data-mode="Current"
            data-theme="original"
            data-
            data-basecolor=""
            data-textcolor="#001b34">באר שבע ישראל</a
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
      <div class="line" />
      <div class="time">
        {curr_time_str}
      </div>
    </div>

    <div class="title">קהילתון</div>
    <div class="date">
      <div class="en">
        {curr_date_str}
      </div>
      <div class="he">
        {curr_hebrew_date_str}
      </div>
    </div>
  </div>
  <div class="content-and-right-flex">
    <div class="right-wraper">
      <div class="up">
        <h2>מפרסם המודעה</h2>
        <div class="publisher-phone">054-123-4567</div>
        <div class="publisher-qr">
          <img src="/qr-code.png" alt="qr" />
        </div>
      </div>
      <div class="down">
        <div class="bottom-left-title">לכל המפרסמים</div>
        <div class="bottom-left-qr">
          <img src="/qr-code.png" alt="qr" />
        </div>
      </div>
    </div>
    <div class="content">
      <div
        id="hidden-content"
        style="display: {start_show_content ? 'block' : 'none'}"
      />
      <!-- <div id="hidden-content" style="display: none" /> -->
      {#if start_show_content == false}
        <div class="spinner-wraper">
          <Circle size="360" color="#FF3E00" unit="px" duration="1.3s" />
        </div>
      {/if}
      <!-- </div> -->
    </div>
  </div>

  <div class="bottom-wraper">
    <div class="bottom-left" />
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
:root {
  --main-color: #bbdcfa;
  --main-stroke-color: hsla(209, 100%, 12%, 0.05);
  --text-color: #001b34;
  --font-size-xl: 36px;
  --font-size-l: 32px;
  --font-size-m: 28px;
  --font-size-s: 24px;
  --font-size-xs: 20px;
  --font-size-xxs: 16px;
}
.spinner-wraper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
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
.line {
  /* Line 1 */

  position: absolute;
  width: 46px;
  height: 0px;
  left: 189px;
  top: 35px;
  border: 1px solid #001b34;
  transform: rotate(90deg);
}
.content-wraper {
  max-height: 100vh;
  .content-and-right-flex {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: flex-start;
    height: 100%;

    .right-wraper {
      color: var(--text-color);
      .up {
        margin: 5px;
        padding: 10px;
        height: 100%;
        // border: 1px solid blue;

        text-align: center;

        background: url("/topography.svg") repeat;
        background-color: var(--main-color);
        // height: calc(100vh - 100px);
        // height: 100%;
        height: calc(100vh - 165px);
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        h2 {
          font-size: 65px;
          color: #000000;
          font-weight: 500;

          text-align: center;
        }
        .publisher-phone {
          font-size: 2.1rem;
          // line-height: 227px;
          color: #000000;
          font-weight: 400;

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
    .down {
      margin: 5px;
      padding: 10px;
      background: url("/topography.svg") repeat;
      background-color: var(--main-color);
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
  }
  .content {
    margin: 5px;
    height: 100%;

    // flex-grow: 1;

    // flex: 3;
    // width: 100%;
    // margin-left: 5px;
    // border: 1px solid red;
    #hidden-content {
      position: relative;
      :global(.frame) {
        :global(img),
        :global(video) {
          padding: 5px;
          border: 1px solid #bbdcfa;
          aspect-ratio: 16 / 9;
          // width: auto;
          // height: 100%;
          // // border: 1px solid red;
          height: calc(100vh - 140px);
          // object-fit: contain;
          // border-radius: 50px;
          // border: 1px solid #000000;
          // box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
          //   rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
          //   rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
        }
      }
    }
  }

  .bottom-wraper {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    margin-top: 15px;
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

  // height: 100px;
  background: var(--main-color);
  border: 1px solid var(--main-stroke-color);
  color: var(--text-color);
  .title {
    // font-size: 2.1rem;
    // line-height: 227px;
    // color: #000000;
    color: var(--text-color);
    font-size: var(--font-size-xl);
    font-weight: 600;
    position: absolute;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }

  .left-side {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .wherher {
      width: 221px;
      margin-bottom: -15px;
      margin-top: -15px;
      /* border: 1px solid red; */
    }
    .time {
      font-weight: 400;
      text-align: center;
      font-size: var(--font-size-s);
    }
  }
  .date {
    font-weight: 400;
    font-size: var(--font-size-xs);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    text-align: center;
    // height: 65px;
    margin-right: 10px;
    // border: 1px solid red;
    div {
      flex-grow: 1;
      //   border: 1px solid blue;
    }
    div.en {
      font-size: var(--font-size-xs);
      font-weight: 400;
      color: var(--text-color);
    }
    div.he {
      font-size: var(--font-size-xxs);
      font-weight: 600;
      color: var(--text-color);
    }
  }
}
</style>
