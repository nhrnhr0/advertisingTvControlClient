<script>
import { getModalContext } from "smodale";

const { hide, cancel } = getModalContext();

export let text = "";

const onCancelClick = () => cancel(text.toUpperCase());
const onOkClick = () => hide({ foo: "bar" });
</script>

<div class="modal-wraper">
  <div class="submit-wraper">
    <button on:click={onCancelClick}>Cancel</button>
    <button on:click={onOkClick}>Ok</button>
  </div>
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
</style>
