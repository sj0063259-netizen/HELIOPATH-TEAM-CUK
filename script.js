function openPDF(file) {
  window.open(file, '_blank');
}

const apiKey = "0373e4c920312c723b3a1b98cae35ea4"; // Replace with your OpenWeatherMap API key
const city = "Kalaburagi";

async function getWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},in&appid=${apiKey}&units=metric`
    );

    const data = await res.json();
    console.log(data); // Debugging

    const container = document.getElementById("weather-container");
    container.innerHTML = "";

    // Take data every 8 steps (~24 hours)
    for (let i = 0; i < data.list.length; i += 8) {
      let item = data.list[i];

      let temp = item.main.temp;
      let date = new Date(item.dt_txt);
      let dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      let fullDate = date.toLocaleDateString();

      // ⚡ Efficiency logic
      let efficiency;
      if (temp > 40) efficiency = "85%";
       else if (temp>=39) efficiency = "83%";
      else if (temp>=38) efficiency = "82%";
      else if (temp>=37) efficiency = "81%";
      else if (temp>=36) efficiency = "80%";
      else if (temp>=35) efficiency = "79%";
      else if (temp>=34) efficiency = "78%";
      else if (temp>=33) efficiency = "77%";
    else if (temp>=32) efficiency = "76%";
     else if (temp>=31) efficiency = "75%";
     else if (temp>=30) efficiency = "74%";
      else if (temp>=29) efficiency = "73%";
      else if (temp>=28) efficiency = "69%";
        else if (temp>=27) efficiency = "65%";
    else if (temp>=26) efficiency = "70%";
     else if (temp>=25) efficiency = "65%";
     else if (temp>=24) efficiency = "60%";
      else if (temp>=23) efficiency = "55%";
      else if (temp>=21) efficiency = "50%";
       else efficiency = "40%";

      let weather = item.weather[0].main;

      container.innerHTML += `
        <div class="weather-card">
          <h3>${dayName}</h3>
          <small>${fullDate}</small>
          <p>🌡 Temp: ${temp.toFixed(1)}°C</p>
          <p>☁ Condition: ${weather}</p>
          <p>⚡ Efficiency: <strong>${efficiency}</strong></p>
        </div>
      `;
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

getWeather();
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  links.classList.toggle("active");
});

