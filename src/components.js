
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

export function CreateWeatherArticle(data, city) {
    const current = data.current;
    const units = data.current_units;

    const weather = WEATHER_CODES[current.weather_code] || {
        label: "Inconnu",
        icon: "🌡️"
    };

    const article = document.createElement("article");
    article.classList.add(
        "w-full",
        "max-w-md",
        "rounded-3xl",
        "bg-gradient-to-br",
        "from-sky-500",
        "to-blue-700",
        "p-7",
        "text-white",
        "shadow-xl"
    );

    const cityTitle = document.createElement("h2");
    cityTitle.classList.add("text-3xl", "font-bold");
    cityTitle.textContent = city.name;

    const location = document.createElement("p");
    location.classList.add("text-sm", "text-blue-100");
    location.textContent = `${city.admin1 || ""}, ${city.country || ""}`;

    const cityHeader = document.createElement("header");
    cityHeader.append(cityTitle, location);

    const temperature = document.createElement("p");
    temperature.classList.add("text-7xl", "font-light");
    temperature.textContent =
        `${Math.round(current.temperature_2m)}${units.temperature_2m}`;

    const icon = document.createElement("span");
    icon.classList.add("text-7xl");
    icon.textContent = weather.icon;

    const weatherSection = document.createElement("section");
    weatherSection.classList.add(
        "flex",
        "items-center",
        "justify-between",
        "py-8"
    );

    const weatherInfo = document.createElement("div");
    weatherInfo.append(
        temperature,
        document.createTextNode(weather.label)
    );

    weatherSection.append(weatherInfo, icon);

    const feelsLike = document.createElement("p");
    feelsLike.classList.add("text-sm", "text-blue-100");
    feelsLike.textContent = `Feels like ${current.apparent_temperature}${units.apparent_temperature}`;

    const details = document.createElement("section");
    details.classList.add("grid", "grid-cols-2", "gap-3", "mt-6");

    const createDetail = (emoji, label, value) => {
        const card = document.createElement("div");
        card.classList.add("rounded-2xl", "bg-white/15", "p-4");

        const heading = document.createElement("p");
        heading.classList.add("text-sm", "text-blue-100");
        heading.textContent = `${emoji} ${label}`;

        const content = document.createElement("p");
        content.classList.add("text-xl", "font-semibold");
        content.textContent = value;

        card.append(heading, content);
        return card;
    };

    details.append(
        createDetail(
            "💧",
            "Humidity",
            `${current.relative_humidity_2m}${units.relative_humidity_2m}`
        ),
        createDetail(
            "💨",
            "Wind speed",
            `${current.wind_speed_10m} ${units.wind_speed_10m}`
        ),
        createDetail(
            "⛰️",
            "Elevation",
            `${data.elevation} m`
        ),
        createDetail(
            "🕒",
            "Local time",
            current.time.replace("T", " ")
        )
    );

    article.append(cityHeader, weatherSection, feelsLike, details);

    return article;
}
