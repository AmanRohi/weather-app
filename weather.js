const days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// Handling date events;
const baseurl = "https://api.openweathermap.org/data/2.5/weather?";
const API_key = "4635e0742a6a4545d17904f8d6876dfd";
const imgUrl1 = "http://openweathermap.org/img/wn/";
const imgUrl2 = "@2x.png";
const imgUrl3 = "@4x.png";
function setDateTime() {
  const dd = document.getElementById("dd");
  const month = document.getElementById("month");
  const year = document.getElementById("year");
  const first = document.getElementById("first");
  const second = document.getElementById("last");
  const day = document.querySelector(".day");
  const amPm = document.querySelector(".am-pm");
  const fetchTodayDay = document.querySelector(".fetch-day");
  const today = new Date();
  dd.innerText = today.getDate();
  month.innerText = months[today.getMonth()];
  year.innerText = today.getFullYear();
  day.innerText = fullDays[today.getDay()];
  fetchTodayDay.innerText = day.innerText;

  //   Setting the time
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let meridian = "AM";
  if (hours > 12) {
    hours = hours - 12;
    meridian = "PM";
  }
  hours = setNumber(hours);
  minutes = setNumber(minutes);
  first.innerText = hours;
  second.innerText = minutes;
  amPm.innerText = meridian;
}
function setNumber(number) {
  if (number < 10) return "0" + number;
  else return number;
}

setInterval(setDateTime, 1000);

// showing the weather report for the people :> ;
const currentTemp = document.getElementById("cr-temp");
const humidity = document.querySelector(".humidity");
const pressure = document.querySelector(".pressure");
const windSpeed = document.querySelector(".wind-speed");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sun-set");

const todayImg = document.querySelector("#img");
const min = document.querySelector(".min");
const max = document.querySelector(".max");
const position = document.querySelector(".location");
const feels = document.querySelector(".feels");
const type = document.getElementById("type-weather");
const btn = document.querySelector(".search-btn");
const val = document.querySelector("#search-text");
const code = document.querySelector(".code");
function callWeatherAPI(city) {
  fetch(`${baseurl}q=${city}&appid=${API_key}&units=metric`)
    .then((weatherReport) => {
      return weatherReport.json();
    })
    .then(showWeatherDetails);
}
function showWeatherDetails(weatherReport) {
  console.log(weatherReport);
  currentTemp.innerText = weatherReport.main.temp;
  humidity.innerText = weatherReport.main.humidity + "%";
  pressure.innerText = weatherReport.main.pressure + " mbar";
  windSpeed.innerText = weatherReport.wind.speed + " mps";
  sunrise.innerText = window.moment(weatherReport.sys.sunrise * 1000).format("HH:MM a");
  sunset.innerText = window.moment(weatherReport.sys.sunset * 1000).format("HH:MM a");
  todayImg.setAttribute("src", imgUrl1 + weatherReport.weather[0].icon + imgUrl3);
  min.innerText = weatherReport.main.temp_min;
  max.innerText = weatherReport.main.temp_max;
  position.innerHTML = `<i class="fas fa-street-view"></i> ${weatherReport.name}
  | <span class="code">${weatherReport.sys.country}</span>`;
  feels.innerText = weatherReport.main.feels_like;
  type.innerText = weatherReport.weather[0].main;
  secondAPICall(weatherReport.coord.lon, weatherReport.coord.lat);
}
function secondAPICall(longitude, lattitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=hourly,minutely&appid=${API_key}&units=metric`
  )
    .then((weatherReport) => {
      return weatherReport.json();
    })
    .then(wholeWeek);
}

const otherParts = document.querySelectorAll(".other-days-parts");

function wholeWeek(weatherReport) {
  console.log(weatherReport);
  let i = 1;
  let today = new Date();
  let t = today.getDay() + 1;
  otherParts.forEach((part) => {
    let weekDay = weatherReport.daily[i];
    if (t > 6) t = 0;
    part.innerHTML = `<div id="day">${days[t]}</div>
                      <div class="img-container2">
                          <img class ="img-week" src = ${imgUrl1}${weekDay.weather[0].icon}${imgUrl2} alt="weather">
                      </div>
                      <div class="temperatures">
                          <div class="temp">
                              Night <span class='night'>${weekDay.temp.night}</span> &#8451;
                          </div>
                          <div class="temp">
                              Day <span class="day">${weekDay.temp.day}</span> &#8451;
                          </div>
                      </div>`;
    i++;
    t++;
  });
}
btn.addEventListener("click", () => {
  let place = val.value;
  if (place == "") alert("Enter the Place");
  else callWeatherAPI(place);
});
val.addEventListener("keypress", (e) => {
  if(e.key==="Enter") btn.click();
});
callWeatherAPI("delhi");
