<script>
import Spinner from "$components/Spinner.svelte";

import { getModalContext } from "smodale";
import { onMount } from "svelte";
import { fetch_all_tvs_list, update_tvs_list } from "$utils/network";
import { all_tvs_list } from "$stores/stores";
const { hide, cancel } = getModalContext();
import MultiSelect from "svelte-multiselect";
import { derived } from "svelte/store";
/**@type {Array<{id: number, name: string}>} */
export let tvs_list = [];
export let broadcast_in_tvs_id = undefined;

let options = derived(all_tvs_list, (tvs) => {
  if (!tvs || !tvs.length) return [];
  return tvs.map((tv) => {
    return {
      label: tv.name,
      value: tv.id,
    };
  });
});

/**@type {Array<{label: string, value: number}>} */
let selected = [];
let loading = false;
onMount(async () => {
  // if all_tvs_list is undefined or empty, fetch it
  if (!$all_tvs_list || !$all_tvs_list.length) {
    $all_tvs_list = await fetch_all_tvs_list();
  }

  // existing_tvs = [1,]
  // $all_tvs_list = [{id: 1, name: "tv1"}, {id: 2, name: "tv2"}]
  // set selected = [{label: "tv1", value: 1}]

  selected = tvs_list.map((tv) => {
    return {
      label: tv.name,
      value: tv.id,
    };
  });
});
const onCancelClick = () => cancel(new Error("Something went wrong"));
const onOkClick = () => {
  let ret = selected.map((opt) => {
    return {
      id: opt.value,
      name: opt.label,
    };
  });
  debugger;
  if (broadcast_in_tvs_id) {
    // send request to update tvs_list
    // ret =
    update_tvs_list(broadcast_in_tvs_id, ret).then((res) => {
      debugger;
      if (res.status === 200) {
        hide({ selected: ret });
      } else {
        new Error("Something went wrong");
      }
    });
    loading = true;
  } else {
    // hide({ selected: ret });
    new Error("No broadcast_in_tvs_id provided");
  }
};
</script>

<div class="modal-wraper">
  {#if $all_tvs_list && $all_tvs_list.length}
    <div class="multi-select-wraper">
      <MultiSelect id="tvs" options={$options} bind:selected />
    </div>

    {#if loading}
      <Spinner />
    {/if}
    <div class="submit-wraper">
      <button on:click={onCancelClick}>Cancel</button>
      <button on:click={onOkClick}>Ok</button>
    </div>
  {:else}
    <Spinner />
  {/if}
</div>

<style lang="scss">
.modal-wraper {
  min-height: 450px;
  position: relative;
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
.multi-select-wraper {
  width: 100%;
  height: 100%;
  margin-bottom: 100px;
}
</style>
