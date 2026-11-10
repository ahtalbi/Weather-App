async function searchCityInApi(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('City search failed.');
    }

    const data = await response.json();
    return data.results || [];
}

const form = document.querySelector('#city-search');
const input = document.querySelector('#city-input');
const errorMessage = document.querySelector('#error-message');
const results = document.querySelector('#succeded-results');

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
        const cities = await searchCityInApi(query);
        if (!cities.length) {
            results.textContent = '';
            errorMessage.textContent = 'City not found.';
            return;
        }
        results.textContent = 'City found!';
    } catch (error) {
        results.textContent = '';
        errorMessage.textContent = 'Something went wrong. Please try again.';
        console.error(error);
    }
});