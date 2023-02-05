<!-- the time and date in english and the date also in hebrew format -->
<script>
let date = new Date();
// to get the hebrew date: date=YYYY-MM-DD
// https://www.hebcal.com/converter?cfg=json&date=2011-06-02&g2h=1&strict=1

// 01/06/2023
// 22/05/2023
// hebrewDate = format date
/**@type {string} */
let hebrewDate;
/**@type {string} */
let time;
init();
function init() {
  date = new Date();
  hebrewDate = date.toLocaleDateString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });
  time = date.toLocaleTimeString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });
}
setInterval(() => {
  init();
}, 1000);
</script>

<div>
  <h1 class="time">{time}</h1>
  <h4 class="date">{hebrewDate}</h4>
</div>

<style lang="scss">
h1,
h4 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
}
.time {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
}
.date {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
}
</style>
