<script>
import { onMount } from "svelte";
import { writable } from "svelte/store";
import smodale from "smodale";
import PopupEditTvsList from "$components/popups/EditTvsList.svelte";
import { fetch_all_tvs_list } from "$utils/network";
import { all_tvs_list } from "$stores/stores";
const displayData = writable([]);
const targetRuns = writable(0);
const VIDEO_LENGTH = 10;

const modal_breakpoints = {
  "32rem": {
    centered: true,
    maxWidth: "var(--max-width-xxs)",
    margin: "var(--component-padding)",
    borderRadius: "var(--radius-md)",
    boxShadow: "7px 7px 20px 0 #717171b4",
  },
  "768px": {
    centered: true,
    backdropColor: "rgba(255, 255, 255, 0.6)",
    boxShadow: "0 0 20px 3px #717171b4",
    maxWidth: "var(--max-width-xs)",
  },
  "80rem": {
    centered: true,
    margin: "var(--component-padding) auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "0 0 20px 3px #717171b4",
    maxWidth: "48rem",
  },
};
function fetchtargetRuns() {
  displayData.set(data);
}

function setTargetRuns(e) {
  targetRuns.set(e.target.value);
}

let result = "";

function addMinToTimeString(timeString, minutesToAdd) {
  let hours = parseInt(timeString.substring(0, 2));
  let minutes = parseInt(timeString.substring(2, 4));
  if (hours === 23 && minutes == 59) {
    return "2400";
  }
  let totalMinutes = minutes + minutesToAdd;
  let carryOverHours = Math.floor(totalMinutes / 60);
  let remainingMinutes = totalMinutes % 60;
  let totalHours = (hours + carryOverHours) % 24;
  let result =
    String(totalHours).padStart(2, "0") +
    String(remainingMinutes).padStart(2, "0");
  return result;
}

function getDateFromWeekdayAndWeekNumber(datetimeValue, weekNumber) {
  const weekdayNumber = Math.floor(datetimeValue / 1000000); // extract weekday number
  const timeValue = datetimeValue % 1000000; // extract time value
  const hours = Math.floor(timeValue / 10000); // extract hours
  const minutes = Math.floor((timeValue % 10000) / 100); // extract minutes
  const seconds = timeValue % 100; // extract seconds

  const now = new Date(); // create a new Date object with the current date and time
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // set the time to midnight
  // const daysToAdd = weekdayNumber - today.getDay() + 7 * (weekNumber - 1); // calculate the number of days to add to reach the given weekday in the given week
  const daysToAdd =
    weekdayNumber - get_israel_day_number(today) + 7 * (weekNumber - 1); // calculate the number of days days to add to reach the given weekday in the given week

  today.setDate(today.getDate() + daysToAdd); // add the number of days to the current date to get the date for the given weekday
  today.setHours(hours); // set the hours to the given value
  today.setMinutes(minutes); // set the minutes to the given value
  today.setSeconds(seconds); // set the seconds to the given value

  return today;
}

function get_israel_day_number(date) {
  // in israel sunday is 1 and saturday is 7
  // in js Sunday - Saturday : 0 - 6

  const todayDay = date.getDay(); // 0 - 6
  return todayDay + 1;
}

function daysUntilTargetRuns() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  // const time = `${now.getDay()}${hours}${minutes}${seconds}`;
  const time = `${get_israel_day_number(now)}${hours}${minutes}${seconds}`;

  let totalRuns = 0;
  let weekNum = 0;
  let dateIndex;
  let timeStampedVideoRuns = {};

  const flatSchedule = $displayData.reduce((acc, cur) => {
    return [...acc, ...cur.opening_hours];
  }, []);

  const sortedFlatSchedule = flatSchedule.sort((a, b) => {
    return a.weekday - b.weekday;
  });

  // console.log({ sortedFlatSchedule });

  sortedFlatSchedule.forEach((daySchedule) => {
    // console.log("sorting flat schedule", daySchedule);

    const endhour = daySchedule.to_hour.replace(/:/g, "").substring(0, 4);

    let currentHhour = daySchedule.from_hour.replace(/:/g, "").substring(0, 4);

    let runIndex = 0;
    while (currentHhour < endhour) {
      const key = `${daySchedule.weekday}${currentHhour}`;
      // console.log({ key, currentHhour });

      if (!timeStampedVideoRuns[key]) {
        timeStampedVideoRuns[key] = 0;
      }

      if (runIndex === 0) {
        timeStampedVideoRuns[key] += 1;
      }

      currentHhour = addMinToTimeString(currentHhour, 1);
      // console.log({ currentHhour, endhour });
      runIndex += 1;
      runIndex = runIndex % 10;
    }
  });

  // console.log({ timeStampedVideoRuns });

  while (totalRuns < $targetRuns) {
    console.log("matching target runs");
    for (let index in timeStampedVideoRuns) {
      if (index > time || weekNum > 0) {
        totalRuns += 1;
      }

      if (totalRuns > $targetRuns) {
        break;
      }

      dateIndex = index;
    }

    weekNum += 1;
  }

  console.log({ dateIndex, weekNum });

  dateIndex = Number(String(dateIndex) + "00");

  console.log({ dateIndex });

  const targetDate = getDateFromWeekdayAndWeekNumber(dateIndex, weekNum);

  const timeDiff = targetDate.getTime() - Date.now();

  // Convert the time difference to weeks, days, hours, and minutes
  const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) % 7;
  const targethours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
  const targetminutes = Math.floor(timeDiff / (1000 * 60)) % 60;
  // result = `${$targetRuns} commercial runs will be achieved on ${targetDate.toLocaleString()}:
  //                 which is ${weeks} weeks, ${days} days, ${targethours} hours, ${targetminutes} minutes from now `;
  const hebrew_date = targetDate.toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });
  result = `${$targetRuns} שידורים יגמרו בתאריך: <b>${hebrew_date.toLocaleString()}</b>
 בעוד ${weeks} שבועות, ${days} ימים, ${targethours} שעות, ${targetminutes} דקות מעכשיו`;
}
function edit_tvs_btn() {
  let existing_tvs = $displayData.map((tv) => {
    return { id: tv.id, name: tv.name };
  });

  smodale
    .show(
      PopupEditTvsList,
      { tvs_list: existing_tvs },
      { breakpoints: modal_breakpoints }
    )
    .then((res) => {
      console.log(res); // { selected: [{id: 1, name: "Tv1"}] }
      // debugger;
      // map resutls from  { selected: [{id: 1, name: "Tv1"}] } to [{id: 1, name: "Tv1", opening_hours: [...]}] from $all_tvs_list
      let res_with_opening_hours = res.selected.map((tv) => {
        let tv_with_opening_hours = $all_tvs_list.find((tv2) => {
          return tv2.id === tv.id;
        });
        return tv_with_opening_hours;
      });

      displayData.set(res_with_opening_hours);
    })
    .catch((error) => {
      console.log(error.message); // 'Something went wrong'
    });
}
onMount(async () => {
  $all_tvs_list = await fetch_all_tvs_list();
  // await fetchtargetRuns();
});
</script>

<button class="btn btn-primary" on:click={edit_tvs_btn}>
  ערוך רשימת טלויזיות
</button>
<div class="w-[240px]">
  <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900"
    >Number of Displays</label
  >
  <!-- list of tvs in displayData -->
  <div class="flex flex-col mb-2">
    {#each $displayData as tv}
      <div class="flex items-center mb-1">
        <input
          type="checkbox"
          class="mr-2"
          checked
          disabled
          id={tv.id}
          name={tv.name}
        />
        <label for={tv.id}>{tv.name}</label>
      </div>
    {/each}
  </div>
  <input
    type="number"
    id="number_of_displays"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    placeholder="5000"
    value={$targetRuns}
    on:change={setTargetRuns}
    required
  />
  <button
    class="px-4 py-2 mt-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
    on:click={daysUntilTargetRuns}
    disabled={!$displayData.length || !$targetRuns}
  >
    חשב
  </button>

  <div class="p-2 font-seminold">
    {@html result}
  </div>
</div>
