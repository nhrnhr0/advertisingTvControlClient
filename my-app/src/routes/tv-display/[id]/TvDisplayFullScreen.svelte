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
export let uri_key;
let start_show_content = false;

/**
 * @type {string | number | NodeJS.Timer | undefined}
 */
let send_played_broadcasts_interval; // = setInterval(() => {});
onMount(() => {
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
  console.log("send_played_broadcasts", $broadcasts_played_array.length);
  let data = { broadcasts: $broadcasts_played_array, key: uri_key };
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
      video.autoplay = true;
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
  let broad_time = broadcasts_statuses[index]["broadcast"]["duration"] * 1000;
  console.log("set_broadcast_loop", index, " for ", broad_time, "ms");
  let html_container = document.getElementById("hidden-content");
  if (html_container == null) return;
  let children = html_container.children;
  requestAnimationFrame(() => {
    for (let i = 0; i < children.length; i++) {
      if (i == index) {
        if (broadcasts_statuses[i]["broadcast"]["media_type"] == "video") {
          children[i].children[0].currentTime = 0;
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
    }, broad_time);
  });
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
</script>

<div class="content">
  <div
    id="hidden-content"
    style="display: {start_show_content ? 'block' : 'none'}"
  />
  <!-- <div id="hidden-content" style="display: none" /> -->
  {#if start_show_content == false}
    <div style="color:white; font-size: 12px; text-align: center">.</div>
  {/if}
  <!-- </div> -->
</div>

<style lang="scss">
:root {
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
  padding: 0px;
  margin: 0px;
  overflow: hidden;
  height: 100vh;
  background-color: #202020;
}
.content {
  height: 100%;
  background-color: #000;
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
        aspect-ratio: 16 / 9;
        // width: auto;
        // height: 100%;
        // // border: 1px solid red;
        width: 100%;
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
</style>
