import { CreateWeatherArticle, CreateForecastCards } from "./components.js";

async function getLongitudeAndLatitiude(city) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    if (!res.ok) {
        throw new Error('City search failed.');
    }
    const data = await res.json();
    return data.results || [];
}

async function GetWeatherBytime(infos) {
    const { latitude, longitude } = infos;
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=6&timezone=auto`);
    if (!res.ok) {
        throw new Error('Weather forecast request failed.');
    }
    return await res.json();
}

const form = document.querySelector('#city-search');
const input = document.querySelector('#city-input');
const errorMessage = document.querySelector('#error-message');
const results = document.querySelector('#succeded-results');
const weatherResult = document.querySelector('#weather-result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    errorMessage.textContent = '';
    results.textContent = '';

    if (!query) {
        errorMessage.textContent = 'Please enter a city name.';
        return;
    }

    results.textContent = 'Loading…';

    try {
        const cities = await getLongitudeAndLatitiude(query);
        if (!cities.length) {
            results.textContent = '';
            errorMessage.textContent = 'City not found.';
            return;
        }
        const city = cities[0];

        const data = await GetWeatherBytime({
            latitude: city.latitude,
            longitude: city.longitude,
        });

        weatherResult.replaceChildren(
            CreateWeatherArticle(data, city),
            CreateForecastCards(data)
        );
        results.textContent = '';
    } catch (error) {
        results.textContent = '';
        errorMessage.textContent = 'Something went wrong. Please try again.';
        console.error(error);
    }
});
