<script>
import Navbar from "$components/DashbaordNavbar.svelte";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { isLogged } from "$utils/user";
import { browser } from "$app/environment";
if (browser && !isLogged()) {
  goto("/login?next=" + $page.url.pathname);
}
</script>

<Navbar />

<slot />

<style lang="scss">
:global(body) {
  direction: rtl;
  background-color: #f5f5f5;
}
</style>
