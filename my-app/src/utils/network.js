import { API_HOST } from '$utils/consts.js';
import { user_token } from '../stores/stores';
import {get} from 'svelte/store';

/**@type {function(string, string): Promise<Response>} */
export async function api_get_login_token(username, password) {
  var myHeaders = new Headers();
  var formdata = new FormData();
  formdata.append("username", username);
  formdata.append("password", password);
  debugger;
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    // redirect: 'follow'
  };
  let response = await fetch(`${API_HOST}/api-token-auth/`, requestOptions);
  return response;
}

export async function send_logout() {
  debugger;
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    // redirect: 'follow'
  };
  let response = await fetch(`${API_HOST}/api-auth/logout/`, requestOptions);
  return response;
}

export async function get_ads_in_tvs() {
  debugger;
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // redirect: 'follow'
  };
  let response = await  fetch_wraper(`${API_HOST}/dashboard/ads-in-tvs/`, requestOptions)
  // let response = await fetch(`${API_HOST}/dashboard/ads-in-tvs/`, requestOptions);
  let data = await response.json();
  return data
}

export async function fetch_ad_info(ad_id) {
  debugger;
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // redirect: 'follow'
  };
  let response = await fetch_wraper(`${API_HOST}/dashboard/ads-in-tvs/${ad_id}/`, requestOptions);
  let data = await response.json();
  return data
}


export async function fetch_wraper(url, options, fetch_to_use=undefined) {
  let my_fetch;
  if (!fetch_to_use) {
    my_fetch = window.fetch;
  }else {
    my_fetch= fetch_to_use;
  }
  // add user token to header if exists
  let user_tkn = get(user_token);
  if (user_tkn) {
    if (!options.headers) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', `Token ${user_tkn}`);
  }

  let response = await my_fetch(url, options);
  return response;
}