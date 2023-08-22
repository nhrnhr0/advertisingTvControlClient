<script>
// @ts-nocheck

// https://weatherwidget.io/
import { browser } from "$app/environment";
import { onMount, onDestroy } from "svelte";
import { get_hebrew_date } from "$utils/get_hebrew_date";
import { Circle } from "svelte-loading-spinners";
import { broadcasts_played_array } from "$stores/stores";

// import { Marquee, loop } from "dynamic-marquee";

/**@type {any} */
export let data;
/**@type {string} */
export let uri_key;
export let page_refresh_needed = false;
export let no_broadcasts_to_show = false;
export let is_demo = false;
let start_show_content = false;

let fotters;

$: {
  if (data && data["fotters"]) {
    let t = data["fotters"];
    // t = [{image, title, index}, ...]
    // sort by index
    t.sort((a, b) => {
      return a.index - b.index;
    });
    fotters = t;
  }
}

/**
 * @type {string | number | NodeJS.Timer | undefined}
 */
let send_played_broadcasts_interval; // = setInterval(() => {});

onMount(() => {
  start_loop_if_there_is_broadcasts();
  if (!is_demo) {
    send_played_broadcasts_interval = setInterval(() => {
      send_played_broadcasts();
    }, 60000);
  }
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
    start_loop_if_there_is_broadcasts();
  }
}

function start_loop_if_there_is_broadcasts() {
  let html_container = document.getElementById("hidden-content");
  if (html_container == null) return;
  if (data && data["broadcasts"] && start_show_content == false) {
    start_show_content = true;
    current_show_index = 0;
    set_broadcast_loop(current_show_index);
  }
}

const BASE_SRC = import.meta.env.VITE_DJANGO_SERVER_URL;

// /**
//  * @type {any[]}
//  */
// let broadcasts_statuses;

// function load_broadcasts() {
//   debugger;
//   if (!browser) return;
//   let broadcasts = data["broadcasts"];

//   let html_container = document.getElementById("hidden-content");
//   if (html_container == null) return;
//   if (broadcasts == null) return;
//   html_container.innerHTML = "";
//   broadcasts_statuses = [];
//   const BASE_SRC = import.meta.env.VITE_DJANGO_SERVER_URL;
//   if (broadcasts.length == 0) {
//     no_broadcasts_to_show = true;
//     if (page_refresh_needed) {
//       location.reload();
//       return;
//     } else {
//       setTimeout(() => {
//         load_broadcasts();
//         return;
//       }, 1000);
//     }
//   }
//   for (let i = 0; i < broadcasts.length; i++) {
//     broadcasts_statuses.push({
//       broadcast: {
//         id: broadcasts[i]["broadcast"],
//         media_type: broadcasts[i]["broadcast__media_type"],
//         media: BASE_SRC + broadcasts[i]["broadcast__media"],
//         duration: broadcasts[i]["duration"],
//       },
//       is_loaded: false,
//     });
//     broadcasts_statuses = [...broadcasts_statuses];
//     if (broadcasts[i]["broadcast__media_type"] == "video") {
//       let video = document.createElement("video");

//       video.preload = "auto";
//       video.autoplay = true;
//       broadcasts_statuses[i]["is_loaded"] = true;
//       video.oncanplay = () => {
//         // if all is loaded, we can start play
//         check_if_all_loaded();
//       };
//       video.onerror = () => {
//         console.log(`Error ${video?.error?.code}; details: ${video?.error?.message}`);
//         // take out the video from the list
//         broadcasts_statuses.splice(i, 1);
//         broadcasts_statuses = [...broadcasts_statuses];
//       };
//       video.autoplay = true;
//       // video.loop = true;
//       video.muted = true;
//       video.load();
//       let video_frame = document.createElement("div");
//       video_frame.className = "frame";
//       video_frame.appendChild(video);
//       html_container.appendChild(video_frame);
//       video.src = BASE_SRC + broadcasts[i]["broadcast__media"];
//     } else {
//       let image = document.createElement("img");
//       image.src = BASE_SRC + broadcasts[i]["broadcast__media"];
//       image.onload = () => {
//         broadcasts_statuses[i]["is_loaded"] = true;
//         // if all is loaded, we can start play
//         check_if_all_loaded();
//       };
//       image.onerror = () => {
//         console.log(`Error ${image?.error?.code}; details: ${image?.error?.message}`);
//         // take out the video from the list
//         broadcasts_statuses.splice(i, 1);
//         broadcasts_statuses = [...broadcasts_statuses];
//       };
//       let image_frame = document.createElement("div");
//       image_frame.className = "frame";
//       image_frame.appendChild(image);
//       html_container.appendChild(image_frame);
//       image.src = BASE_SRC + broadcasts[i]["broadcast__media"];
//     }
//   }
// }

let current_show_index = 0;

// function check_if_all_loaded() {
//   debugger;
//   let all_loaded = broadcasts_statuses.length > 0;
//   for (let i = 0; i < broadcasts_statuses.length; i++) {
//     if (!broadcasts_statuses[i]["is_loaded"]) {
//       all_loaded = false;
//       break;
//     }
//   }
//   if (all_loaded && !start_show_content) {
//     start_show_content = true;
//     current_show_index = 0;
//     set_broadcast_loop(current_show_index);
//   } else if (page_refresh_needed) {
//     location.reload();
//   }
// }
let next_broadcast_timeout;
// @ts-ignore
let item_id_to_asset_index = {};
function get_item_asset_index(item) {
  let item_id = item["id"];
  if (item_id_to_asset_index[item_id] == null) {
    item_id_to_asset_index[item_id] = 0;
  }
  return item_id_to_asset_index[item_id];
}

function set_item_next_asset(item) {
  let item_id = item["id"];
  if (item_id_to_asset_index[item_id] == null) {
    item_id_to_asset_index[item_id] = 0;
  }
  item_id_to_asset_index[item_id] += 1;

  if (item_id_to_asset_index[item_id] >= item.assets.length) {
    item_id_to_asset_index[item_id] = 0;
  }
  return item_id_to_asset_index[item_id];
}

function set_broadcast_loop(index) {
  // if the index is the first one, we check if page_refresh_needed is true, and if so, we reload the page
  if (index == 0 && page_refresh_needed) {
    location.reload();
    return;
  }
  current_show_index = index;
  let html_container = document.getElementById("hidden-content");
  if (html_container == null) return;

  // we create a new element to replace the old one
  let item = data.broadcasts[index];
  // let asset_index = item["asset_index"] || 0;
  let asset_index = get_item_asset_index(item);
  let media_type = item.assets[asset_index]["media_type"];
  let media = BASE_SRC + item.assets[asset_index]["media"];
  let duration = item["duration"];

  let new_element;
  if (media_type == "video") {
    new_element = document.createElement("video");
    new_element.autoplay = true;
    new_element.muted = true;
    new_element.loop = false;
    new_element.preload = "auto";
    new_element.src = media;
  } else {
    new_element = document.createElement("img");
    new_element.src = media;
  }
  let new_frame = document.createElement("div");
  new_frame.className = "frame";
  new_frame.appendChild(new_element);

  // clear old elements and set to new_frame
  if (html_container) {
    html_container.innerHTML = "";
    html_container.appendChild(new_frame);
  }
  // we set the timeout to show the next broadcast

  if (media_type == "image") {
    if (next_broadcast_timeout != null) clearTimeout(next_broadcast_timeout);
    next_broadcast_timeout = setTimeout(() => {
      set_broadcast_loop(next_index);
    }, duration * 1000);
  } else if (media_type == "video") {
    new_element.onended = () => {
      if (next_broadcast_timeout != null) clearTimeout(next_broadcast_timeout);
      set_broadcast_loop(next_index);
    };
    new_element.onerror = () => {
      if (next_broadcast_timeout != null) clearTimeout(next_broadcast_timeout);
      set_broadcast_loop(next_index);
    };
  }

  // item["asset_index"] = (asset_index + 1) % item.assets.length;
  set_item_next_asset(item);
  let next_index = (index + 1) % data.broadcasts.length;
  setTimeout(() => {
    preload_asset(next_index);
  }, 100);
}

async function preload_asset(index) {
  let item = data.broadcasts[index];
  if (item == null) return;
  // let asset_index = item["asset_index"] || 0;
  let asset_index = get_item_asset_index(item);
  let media_type = item.assets[asset_index]["media_type"];
  let media = BASE_SRC + item.assets[asset_index]["media"];
  if (media_type == "image") {
    let img = new Image();
    img.src = media;
    await img.decode();
  } else if (media_type == "video") {
    const res = await fetch(media);
    const blob = await res.blob();
  }
  console.log("preloaded", media);
  return true;
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
  const b_in_tvs_id = data["broadcasts"].find((v) => v["broadcast"] == broadcast_id)["id"];
  const played_info = {
    broadcast: broadcast_id,
    tv_display: data["id"],
    time: new Date().toISOString(),
    uuid: generage_uuid(),
    b_in_tvs_id: b_in_tvs_id,
  };

  try {
    broadcasts_played_array.update((n) => {
      // @ts-ignore
      n.push(played_info);
      return n;
    });
  } catch (e) {
    console.log(e);
    // reset to empty array
    broadcasts_played_array.set([]);
  }
}

function next_broadcast_btn() {
  if (next_broadcast_timeout) {
    clearTimeout(next_broadcast_timeout);
  }
  current_show_index++;
  if (current_show_index >= broadcasts_statuses.length) {
    current_show_index = 0;
    // ifi we are in the end of the loop,
    // we need to check if we need to refresh the page
    // to get new broadcasts
    if (page_refresh_needed) {
      setTimeout(() => {
        location.reload();
      }, 20);
    }
  }
  set_broadcast_loop(current_show_index);
}
function prev_broadcast_btn() {
  if (next_broadcast_timeout) {
    clearTimeout(next_broadcast_timeout);
  }
  current_show_index--;
  if (current_show_index < 0) {
    current_show_index = broadcasts_statuses.length - 1;
  }
  set_broadcast_loop(current_show_index);
}
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Flow+Block&family=Rubik:wght@400;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="content">
  <div class="wraper">
    <div class="block-1">
      {#if is_demo == true}
        <div class="stats">
          <button on:click={next_broadcast_btn}>הבא</button>
          <button on:click={prev_broadcast_btn}>הקודם</button>
        </div>
      {/if}
      <div id="hidden-content" />
      <div class="fotter">
        {#if fotters}
          {#each fotters as fotter}
            <img src={BASE_SRC + fotter.image} class="image-fotter" />
          {/each}
        {/if}
      </div>

      <!-- <div id="hidden-content" style="display: none" /> -->
      {#if start_show_content == false}
        <div style="color:white; font-size: 12px; text-align: center">.</div>
      {/if}

      <!-- <div class="side-wraper">
        <div class="right-size-content">
          <div class="business-name">כולבו גבולות</div>
          <div class="business-phone">
            <div class="phone-text">054-229-2115</div>
          </div>
        </div>
      </div> -->
    </div>
    <!-- <div class="block-2">
      <div class="fotter">
        <div class="fotter-text">
          <img
            src="/icons8-phone-48.png"
            alt="phone"
            width="110px"
            height="110px"
          />
          רוצים לפרסם במסך? צרו קשר עוד היום - 055-557-1040
        </div>
      </div>
    </div> -->
  </div>
</div>

<style lang="scss">
:root {
  --assets-vh: 80vh;
  --fotter-vh: var(calc(100vh - var(--assets-vh)));
}
.stats {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000c9;
  color: white;
  padding: 5px;
  font-size: 12px;
}
:root {
  --bg-clr: #ffffffc9;
}
* {
  font-family: "Flow Block", cursive;
  font-family: "Rubik", sans-serif;
}
.spinner-wraper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
#hidden-content {
  // display: none;
  flex: 1;
}
:global(body) {
  padding: 0px;
  margin: 0px;
  overflow: hidden;
  height: 100vh;
  background-color: #202020;
  background: url("/bg.svg") repeat;
  background-size: 35%;
  // background-position: ;
}
.content {
  .wraper {
    .block-1 {
      // height: 91vh;
      // width: 99vw;
      // width: calc(16 / 9 * 97vh);
      margin: auto;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .fotter {
        position: absolute;
        bottom: 0;
        height: var(--fotter-vh);
        top: var(--assets-vh);
        width: 100%;
        .image-fotter {
          height: 20vh;
          max-width: 25vw;
          width: 100%;
          object-fit: contain;
        }
      }

      // flex-grow: 1;

      // flex: 3;
      // width: 100%;
      // margin-left: 5px;
      // border: 1px solid red;
      #hidden-content {
        position: relative;
        :global(.frame) {
          // height: 91vh;

          height: var(--assets-vh);
          // width: calc(16 / 9 * var(--assets-vh));
          width: calc(80 / 36 * var(--assets-vh));
          margin: auto;
          max-width: 100%;
          // border: 1px solid red;
          // border: 3px solid #8e8c8c;
          // border-radius: 10px;
          // border-bottom: 5px solid #8e8c8c;
          // border-right: 5px solid #8e8c8c;
          // border-left: 5px solid #8e8c8c;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          :global(img),
          :global(video) {
            // border-bottom-right-radius: 10px;
            // border-radius: 10px;
            // aspect-ratio: 16 / 9;
            aspect-ratio: 80 / 36;
            object-fit: contain;
            // width: auto;
            // height: 100%;
            // // border: 1px solid red;
            width: 100%;
            height: 100%;
            // object-fit: contain;
            // border-radius: 50px;
            // border: 1px solid #000000;
            // box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
            //   rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
            //   rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
          }
        }
      }

      .side-wraper {
        height: 100%;
        padding-left: 8px;
        padding-right: 8px;
        width: 15vw;
        .right-size-content {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          margin-top: 120px;
          position: relative;
          .business-name {
            color: black;
            top: 200px;
            // font-size: 60px;
            // font-size: in rem
            font-size: 7.75rem;
            font-weight: bold;
            text-align: center;
            position: absolute;

            // width: 320px;
            // position: absolute;
            background: var(--bg-clr);

            box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
              rgba(0, 0, 0, 0.09) 0px -3px 5px;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
              rgba(0, 0, 0, 0.09) 0px -3px 5px;
          }
          .business-phone {
            font-size: 40px;
            // font-size: in red;
            // font-size: 4.5rem;
            text-align: center;
            margin-top: 860px;
            margin-bottom: 157px;
            display: inline-block;

            display: table-cell;
            white-space: nowrap;
            background: var(--bg-clr);
            font-weight: bold;
            color: black;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
              rgba(0, 0, 0, 0.09) 0px -3px 5px;
            border-radius: 10px;

            box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
              rgba(0, 0, 0, 0.09) 0px -3px 5px;
          }
          .business-qr {
            // background: #ffffff;
            background: none;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              border: 4px solid #8e8c8c;
              border-radius: 10px;
            }
          }
        }
      }
    } // block-1
    .block-2 {
      width: calc(100%);
      height: 10vh;
      // border: 1px solid red;
      text-align: center;
      // font-size: 7.5625rem;
      font-size: 60px;
      // 7.5625rem is 120px
      // border: 1px solid red;

      font-weight: bolder;
      .fotter {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background: var(--bg-clr);
        .fotter-text {
          width: 100vw;
          padding-right: 8px;
          padding-left: 8px;
          color: black;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  } // wraper
}
</style>
