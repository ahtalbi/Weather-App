import { CreateWeatherArticle } from "./components.js";

async function getLongitudeAndLatitiude(city) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    if (!res.ok) {
        throw new Error('City search failed.');
    }
    const data = await res.json();
    return data.results || [];
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

        let res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`);
        const data = await res.json();

        weatherResult.replaceChildren(CreateWeatherArticle(data, city));
        results.textContent = '';
    } catch (error) {
        results.textContent = '';
        errorMessage.textContent = 'Something went wrong. Please try again.';
        console.error(error);
    }
});

