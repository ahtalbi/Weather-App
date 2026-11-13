# Weather App

A small weather app built with Vite and Open-Meteo. Search for a city to see its current conditions and a five-day forecast.

## Run locally

```bash
npm install
npm run dev
```

## Project structure

```text
.
├── index.html
├── public/
│   └── favicon.png
├── src/
│   ├── components.js
│   ├── main.js
│   └── style.css
├── package.json
└── vite.config.js
```

## Weather API

- City search: [Open-Meteo Geocoding API](https://geocoding-api.open-meteo.com/v1/search?name=Paris)
- Current conditions and daily forecast: [Open-Meteo Forecast API](https://api.open-meteo.com/v1/forecast?latitude=48.86&longitude=2.35&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=6&timezone=auto)

The app first looks up a city to get its coordinates, then requests current temperature, humidity, wind speed, and daily forecast data. `src/components.js` turns the API values into a current-weather card and forecast cards. Temperatures and wind speeds use the units returned by the API; weather codes are mapped to descriptions and emoji icons.

Open-Meteo's public API does not require an API key. Usage limits and terms can change; see the [Open-Meteo terms](https://open-meteo.com/en/terms) for current details. An API error is shown as a general retry message.

Example response summary: the forecast response includes a `current` object (time, temperature, humidity, wind speed, weather code), a `current_units` object, and `daily` arrays for dates, weather codes, minimum/maximum temperatures, and precipitation probability.
