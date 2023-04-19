import { persisted } from "svelte-local-storage-store";

import { writable } from "svelte/store";

export const  broadcasts_played_array = persisted("broadcasts_played", []);


export const user_token = persisted("user_token", '');