<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather App</title>
    <link rel="stylesheet" href="src/style.css">
</head>

<body>
    <header class="flex w-full items-center justify-between border-b border-slate-200 bg-white px-[7%] py-3">
        <a class="flex items-center gap-3 text-slate-800 no-underline" href="#home">
            <img class="h-11 w-11 object-contain" src="/favicon.png" alt="" />
            <h1 class="m-0 text-[21px] font-semibold">Weather App</h1>
        </a>
        <nav class="flex items-center gap-6 max-sm:gap-3">
        </nav>
    </header>
    <main class="flex min-h-screen justify-center bg-slate-50 px-5 pt-18" id="home">
        <section class="flex w-full max-w-190 flex-col items-center text-center" id="weather">
            <h2 class="mb-3 mt-0 text-4xl font-semibold text-slate-800 max-sm:text-[29px]">Check the weather</h2>
            <p id="search-status" class="mb-7.5 mt-0 text-base text-slate-500">Find the current weather for any city.</p>
            <form id="city-search" class="flex w-full max-w-155 items-center gap-2 rounded-lg border border-slate-200 bg-white p-2" role="search">
                <input id="city-input" class="min-w-0 flex-1 border-0 p-3 text-slate-800 outline-none" type="search" name="city" placeholder="Search for a city"/>
                <button class="cursor-pointer rounded-md border-0 bg-blue-600 px-5.5 py-3 text-white max-sm:px-3.5" type="submit">Search</button>
            </form>
            <h2 id="error-message" class="text-red-600" role="alert"></h2>
            <h1 id="succeded-results"></h1>
        </section>
    </main>
    <script type="module" src="./src/main.js"></script>
</body>

</html>

const WEATHER_CODES = {
    0: { label: "Ciel dégagé", icon: "☀️" },
    1: { label: "Plutôt dégagé", icon: "🌤️" },
    2: { label: "Partiellement nuageux", icon: "⛅" },
    3: { label: "Couvert", icon: "☁️" },
    45: { label: "Brouillard", icon: "🌫️" },
    48: { label: "Brouillard givrant", icon: "🌫️" },
    51: { label: "Bruine légère", icon: "🌦️" },
    53: { label: "Bruine", icon: "🌦️" },
    55: { label: "Bruine forte", icon: "🌦️" },
    56: { label: "Bruine verglaçante", icon: "🌧️" },
    57: { label: "Bruine verglaçante", icon: "🌧️" },
    61: { label: "Pluie légère", icon: "🌧️" },
    63: { label: "Pluie", icon: "🌧️" },
    65: { label: "Pluie forte", icon: "🌧️" },
    66: { label: "Pluie verglaçante", icon: "🌧️" },
    67: { label: "Pluie verglaçante", icon: "🌧️" },
    71: { label: "Neige légère", icon: "🌨️" },
    73: { label: "Neige", icon: "🌨️" },
    75: { label: "Neige forte", icon: "❄️" },
    77: { label: "Grains de neige", icon: "🌨️" },
    80: { label: "Averses légères", icon: "🌦️" },
    81: { label: "Averses", icon: "🌧️" },
    82: { label: "Averses violentes", icon: "⛈️" },
    85: { label: "Averses de neige", icon: "🌨️" },
    86: { label: "Fortes averses de neige", icon: "❄️" },
    95: { label: "Orage", icon: "⛈️" },
    96: { label: "Orage avec grêle", icon: "⛈️" },
    99: { label: "Orage avec forte grêle", icon: "⛈️" },
};

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

        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID 40109729-e947b0a0c61ebc379c60c8ce3`
            }
        });

        const image = await response.json();

        const imageUrl = image.results[0].urls.regular;

        console.log(imageUrl);

        console.log(data);
        results.textContent = 'City found!';
    } catch (error) {
        results.textContent = '';
        errorMessage.textContent = 'Something went wrong. Please try again.';
        console.error(error);
    }
});

