<script>
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { user_token } from "$stores/stores";
import { login } from "$utils/user";
let btn_disabled = false;
let error_message = "";

function submit_login(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const value = Object.fromEntries(data.entries());
  login(
    value.username,
    value.password,
    () => {
      goto($page.url.searchParams.get("next") || "/");
    },
    (error) => {
      error_message = error;
      btn_disabled = false;
    }
  );
  btn_disabled = true;
}
</script>

<form method="post" on:submit={submit_login}>
  <input type="text" name="username" placeholder="Username" />
  <input type="password" name="password" placeholder="Password" />
  <button type="submit" disabled={btn_disabled}>Login</button>
  <span>{error_message}</span>
</form>
