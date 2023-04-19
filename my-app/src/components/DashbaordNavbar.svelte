<script>
import { isLogged, logout } from "../utils/user";
import { page } from "$app/stores";
function logout_clicked() {
  logout().then(() => {
    location.reload();
  });
}
</script>

<!-- logout button -->
<nav>
  {#if isLogged()}
    <button on:click={logout_clicked}>Logout</button>
  {/if}
  <a href="/dashboard/" class:active={$page.url.pathname === "/dashboard"}
    >דף ניהול
  </a>
  <a
    href="/dashboard/ads-in-tvs/"
    class:active={$page.url.pathname === "/dashboard/ads-in-tvs"}
    >תשדירים
  </a>
</nav>

<slot />

<style lang="scss">
nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 15px;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e5e5e5;
}
a {
  text-decoration: none;
  color: black;

  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
}
</style>
