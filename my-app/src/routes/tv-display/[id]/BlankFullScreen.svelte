<script>
export let page_refresh_needed = false;
$: {
  if (page_refresh_needed) {
    window.location.reload();
  }
}
</script>

<div class="blank">
  <!-- <h1>נשוב לשדר בקרוב</h1> -->
</div>

<style lang="scss">
:global(body) {
  margin: 0;
  padding: 0;
  background-color: #000;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.blank {
  background-color: #000;
  height: 100%;
  width: 100%;
}
</style>
