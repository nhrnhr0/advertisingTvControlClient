
import { browser } from "$app/environment";
import { user_token } from "$stores/stores";
import { get } from "svelte/store";
import { send_logout } from "$utils/network";
import { api_get_login_token } from "$utils/network";

export function isLogged() {
  return browser && get(user_token) && get(user_token) !== '';
}


export async function logout() {
  let res = await send_logout();
    if (res.status == 200) {
        user_token.set('');
    }
    return res;
}

export function login(username, password, on_success, on_error) {
  api_get_login_token(username, password).then((res) => {
    if (res.status == 200) {
      console.log("Login success");
      res.json().then((json) => {
        user_token.set(json.token || "");
        on_success();
        // goto($page.url.searchParams.get("next") || "/");
      });
    } else {
      console.log("Login failed");
      let error_message = res.statusText;
      res.text().then((text) => {
        error_message += text;
        on_error(error_message);
      });
    }
  });
}