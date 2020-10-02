const weatherForm = document.querySelector('.form-location');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const icon = document.querySelector('.icon');

// openWeatherMap Data API Key
const key = '26128ced5b1f85488ef52c88e2f678fd';

async function getCity(cityName) {
    const base = `https://api.openweathermap.org/data/2.5/weather`;
    const query = `?q=${cityName}&appid=${key}`;

    const response = await fetch(base + query);
    const data = await response.json();
    
    return data;
}


const updateUI = (data) => {
    // Destructuring example just to make less code
    const { cityWeather } = data;

    // formula to convert Kalvin to Celsius
    // temp = temp - 273.15;
    const weatherConverted = parseInt((cityWeather.main.temp) - 273.15);

    details.innerHTML = `
        <h5>${cityWeather.name}</h5>
          <div>${cityWeather.weather[0].description}</div>
          <div class="infos">
            <span>${weatherConverted}</span>
            <span>&deg;C</span>
          </div>
    `;

    // updating UI weather icon
    let iconSrc = `http://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`;
    icon.setAttribute('src', iconSrc);

    // make card shows when updatingUI
    if (card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }
}

async function updateCityWeather(cityName) {
    const cityWeather = await getCity(cityName);

    return { cityWeather };
}

function updateError() {
    details.innerHTML = `<div>location not found</div>`

    let iconSrc = `img/404.svg`;
    icon.setAttribute('src', iconSrc);

    // make card shows when updatingError
    if (card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cityNameValue = weatherForm.location.value.trim();
    weatherForm.reset();

    updateCityWeather(cityNameValue)
        .then(data => updateUI(data))
        .catch(err => updateError(err))
    // saving data to localStorage
    localStorage.setItem('city', cityNameValue)
});

if (localStorage.getItem('city')) {
    updateCityWeather(localStorage.getItem('city'))
        .then(data => updateUI(data))
        .catch(err => updateError(err))
}