<script>
import { browser } from "$app/environment";
import { onMount } from "svelte";

export let data;
let current_broadcast = 0;
let current_broadcast_duration = 0;
/** @type {Array<{broadcast: number, play_time: Date}>} */
let broadcasts_played = [];
let interval = setInterval(() => {
  if (data["broadcasts"] == undefined) return;

  current_broadcast_duration += 1;
  if (current_broadcast < data["broadcasts"].length) {
    if (data["broadcasts"][current_broadcast] == undefined) return;
    if (
      current_broadcast_duration >=
      data["broadcasts"][current_broadcast]["duration"]
    ) {
      console.log(
        'data["broadcasts"][current_broadcast]: ',
        data["broadcasts"][current_broadcast]
      );
      broadcasts_played.push({
        broadcast: data["broadcasts"][current_broadcast].broadcast,
        play_time: new Date(),
      });
      broadcasts_played = [...broadcasts_played];
      current_broadcast_duration = 0;
      current_broadcast = (current_broadcast + 1) % data["broadcasts"].length;
      on_broadcast_changed(data["broadcasts"][current_broadcast]);
    }
  }
}, 1000);

$: {
  data &&
    data["broadcasts"] &&
    on_broadcast_changed(data["broadcasts"][current_broadcast]);
}
// onMount(() => {
//   data &&
//     data["broadcasts"] &&
//     on_broadcast_changed(data["broadcasts"][current_broadcast]);
// });

/**@type {string | undefined} */
let current_broadcast_media = undefined;
/**@type {string} */
let current_broadcast_media_type = "unknown";

function on_broadcast_changed(broadcast) {
  current_broadcast_media = broadcast["broadcast__media"];
  let file_type = "unknown";
  if (current_broadcast_media) {
    let file_end = current_broadcast_media.split(".").pop();

    if (file_end) {
      file_end = file_end.toLowerCase();
      if (file_end == "png" || file_end == "jpg" || file_end == "jpeg") {
        file_type = "image";
      } else if (file_end == "mp4" || file_end == "webm" || file_end == "mov") {
        file_type = "video";
      }
    }
    current_broadcast_media_type = file_type;
  }

  // if it's a video, we need to play the video tag
  if (file_type == "video") {
    setTimeout(() => {
      play_video();
    }, 10);
  }
  function play_video() {
    /**@type {HTMLVideoElement | null} */
    let video = document.querySelector(".tv-content-video");
    if (video) {
      video.play();
    }
  }
}

// listen to broadcast_refresh event
browser &&
  window.addEventListener("broadcast_refresh", (e) => {
    console.log("broadcast_refresh event received");
    data = e.detail;
    current_broadcast = 0;
    current_broadcast_duration = 0;
    on_broadcast_changed(data["broadcasts"][current_broadcast]);
  });
</script>

<div class="tv-content">
  <!-- <pre>
  {JSON.stringify(data, null, 4)}
  </pre> -->
  <!-- <h1>
    <a href="{import.meta.env.VITE_DJANGO_SERVER_URL}{current_broadcast_media}">
      {current_broadcast_media}
    </a>
  </h1> -->
  <div class="tv-content-duration">
    {#if data && data["broadcasts"] && data["broadcasts"][current_broadcast]}
      {current_broadcast_duration} / {data["broadcasts"][current_broadcast][
        "duration"
      ]}s
      {current_broadcast_media_type}
    {/if}
    <br />
    {current_broadcast + 1} / {data &&
      data["broadcasts"] &&
      data["broadcasts"].length}
    <!-- <br />
    <pre>
      {JSON.stringify(broadcasts_played, null, 4)}
    </pre> -->
  </div>
  {#if current_broadcast_media_type == "image"}
    <img
      class="tv-content-image"
      src="{import.meta.env.VITE_DJANGO_SERVER_URL}{current_broadcast_media}"
      alt="image"
    />
  {:else if current_broadcast_media_type == "video"}
    <video
      class="tv-content-video"
      src="{import.meta.env.VITE_DJANGO_SERVER_URL}{current_broadcast_media}"
      alt="video"
      autoplay
      loop
      muted
    />
  {/if}
</div>

<style lang="scss">
.tv-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
}
.tv-content .tv-content-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 81vh;
}
.tv-content .tv-content-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 81vh;
}
.tv-content .tv-content-duration {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}
</style>
