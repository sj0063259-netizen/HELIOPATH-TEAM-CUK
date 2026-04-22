function openPDF(file) {
  window.open(file, '_blank');
}

const apiKey = "0373e4c920312c723b3a1b98cae35ea4";
const city = "Kalaburagi";

// 🔥 GLOBAL DASHBOARD VARIABLES
let totalEnergy = 0;
let totalEfficiency = 0;
let count = 0;

// ⚡ Efficiency logic
function calculateEfficiency(temp, clouds) {
  let base;

  if (clouds < 20) base = 95;
  else if (clouds < 50) base = 75;
  else if (clouds < 80) base = 55;
  else base = 35;

  if (temp > 35) base -= 5;
  if (temp < 20) base -= 3;

  return Math.max(base, 30);
}

// 🔋 Energy estimation
function estimateEnergy(efficiency) {
  return (efficiency * 0.1).toFixed(2); // kWh
}

// 🎨 Efficiency color
function getEffClass(eff) {
  if (eff > 80) return "eff-high";
  if (eff > 60) return "eff-mid";
  return "eff-low";
}

// 📊 UPDATE DASHBOARD VALUES
function updateDashboard() {
  let avgEfficiency = (totalEfficiency / count).toFixed(1);
  let batteryLevel = Math.min(100, totalEnergy * 5).toFixed(0);

  document.getElementById("total-energy").innerText =
    totalEnergy.toFixed(2) + " kWh";

  document.getElementById("avg-efficiency").innerText =
    avgEfficiency + "%";

  document.getElementById("battery-level").innerText =
    batteryLevel + "%";
}

// ✅ CURRENT WEATHER
async function getCurrentWeather(container) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},in&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    let temp = data.main.temp;
    let clouds = data.clouds.all;
    let weather = data.weather[0].main;

    if (clouds < 20) weather = "Clear";

    let efficiency = calculateEfficiency(temp, clouds);
    let energy = estimateEnergy(efficiency);
    let effClass = getEffClass(efficiency);

    // 🔥 ADD TO DASHBOARD
    totalEnergy += parseFloat(energy);
    totalEfficiency += efficiency;
    count++;

    container.innerHTML += `
      <div class="weather-card">
        <h3>Today (Current)</h3>
        <p>🌡 Temp: ${temp.toFixed(1)}°C</p>
        <p>☁ Clouds: ${clouds}%</p>
        <p>🌤 Condition: ${weather}</p>
        <p>⚡ Efficiency: <span class="${effClass}">${efficiency}%</span></p>
        <p>🔋 Output: ${energy} kWh</p>
      </div>
    `;
  } catch (error) {
    console.log("Error:", error);
  }
}

// ✅ FORECAST
async function getForecast(container) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},in&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    for (let i = 0; i < data.list.length; i += 8) {
      let item = data.list[i];

      let temp = item.main.temp;
      let clouds = item.clouds.all;
      let weather = item.weather[0].main;

      if (clouds < 20) weather = "Clear";

      let date = new Date(item.dt_txt);
      let dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      let fullDate = date.toLocaleDateString();

      let efficiency = calculateEfficiency(temp, clouds);
      let energy = estimateEnergy(efficiency);
      let effClass = getEffClass(efficiency);

      // 🔥 ADD TO DASHBOARD
      totalEnergy += parseFloat(energy);
      totalEfficiency += efficiency;
      count++;

      container.innerHTML += `
        <div class="weather-card">
          <h3>${dayName}</h3>
          <small>${fullDate}</small>
          <p>🌡 Temp: ${temp.toFixed(1)}°C</p>
          <p>☁ Clouds: ${clouds}%</p>
          <p>🌤 Condition: ${weather}</p>
          <p>⚡ Efficiency: <span class="${effClass}">${efficiency}%</span></p>
          <p>🔋 Output: ${energy} kWh</p>
        </div>
      `;
    }

  } catch (error) {
    console.log("Error:", error);
  }
}

// 🚀 MAIN RENDER
async function renderWeather() {
  const container = document.getElementById("weather-container");

  // reset everything
  container.innerHTML = "";
  totalEnergy = 0;
  totalEfficiency = 0;
  count = 0;

  await getCurrentWeather(container);
  await getForecast(container);

  // 🔥 update dashboard after all data
  updateDashboard();
}

renderWeather();

// NAV TOGGLE
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  links.classList.toggle("active");
});
function revealOnScroll() {
  const elements = document.querySelectorAll(".reveal");

  elements.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
function toggleModel() {
  const section = document.getElementById("model-viewer");
  const btn = document.getElementById("view-btn");

  if (section.classList.contains("hidden-model")) {
    // SHOW MODEL
    section.classList.remove("hidden-model");

    setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Change button text
    btn.innerText = "Hide Model";

  } else {
    // HIDE MODEL
    section.classList.add("hidden-model");

    // Change button text back
    btn.innerText = "View Full Project";
  }
}