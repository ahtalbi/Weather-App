
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
        "mx-auto",
        "rounded-3xl",
        "bg-gradient-to-br",
        "from-sky-500",
        "to-blue-700",
        "p-7",
        "text-white",
        "shadow-xl",
        "text-center"
    );

    const cityTitle = document.createElement("h2");
    cityTitle.classList.add("text-3xl", "font-bold");
    cityTitle.textContent = city.name;

    const today = document.createElement("p");
    today.classList.add("mt-1", "text-blue-100");
    const date = new Date(data.current?.time);

    today.textContent = data.current?.time
        ? `Aujourd’hui · ${date.getDate()} ${["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"][date.getMonth()]}`
        : "Aujourd’hui";

    const temperature = document.createElement("p");
    temperature.classList.add("text-6xl", "font-light");
    temperature.textContent = `${Math.round(current.temperature_2m)}${units.temperature_2m}`;

    const icon = document.createElement("span");
    icon.classList.add("text-7xl");
    icon.textContent = weather.icon;

    const weatherSection = document.createElement("section");
    weatherSection.classList.add(
        "flex",
        "items-center",
        "justify-center",
        "gap-4",
        "py-6"
    );

    const weatherInfo = document.createElement("div");
    weatherInfo.classList.add("text-center");
    const descriptionTitle = document.createElement("p");
    descriptionTitle.classList.add("mt-3", "text-sm", "font-medium", "text-blue-100");
    descriptionTitle.textContent = "Description";
    const weatherDescription = document.createElement("p");
    weatherDescription.classList.add("mt-1", "text-lg", "font-semibold", "text-white");
    weatherDescription.textContent = weather.label;
    weatherInfo.append(temperature, descriptionTitle, weatherDescription);

    weatherSection.append(weatherInfo, icon);

    const details = document.createElement("section");
    details.classList.add("grid", "grid-cols-2", "gap-3", "mt-2");

    const createDetail = (emoji, label, value) => {
        const card = document.createElement("div");
        card.classList.add("rounded-2xl", "bg-white/15", "p-4", "text-center");

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
        createDetail("💧", "Humidité", `${current.relative_humidity_2m}${units.relative_humidity_2m}`),
        createDetail("💨", "Vent", `${current.wind_speed_10m} ${units.wind_speed_10m}`)
    );

    article.append(cityTitle, today, weatherSection, details);

    return article;
}

export function CreateForecastCards(data) {
    const section = document.createElement("section");
    section.classList.add("mt-8", "w-full");

    const title = document.createElement("h2");
    title.classList.add("mb-5", "text-left", "text-2xl", "font-bold", "tracking-tight", "text-slate-800");
    title.textContent = "Les 5 prochains jours";
    section.append(title);

    const grid = document.createElement("div");
    grid.classList.add("grid", "grid-cols-1", "gap-4", "sm:grid-cols-2", "md:grid-cols-3", "xl:grid-cols-5");

    const daily = data.daily;
    if (!daily?.time?.length) {
        const missing = document.createElement("p");
        missing.classList.add("rounded-xl", "bg-white", "p-4", "text-slate-500");
        missing.textContent = "Prévisions indisponibles.";
        section.append(missing);
        return section;
    }

    for (let index = 1; index < daily.time.length; index++) {
        const date = daily.time[index].split("-").reverse().join("/");
        const weather = WEATHER_CODES[daily.weather_code?.[index]] || { label: "Donnée indisponible", icon: "🌡️" };
        const card = document.createElement("article");
        card.classList.add("group", "relative", "flex", "min-h-52", "flex-col", "items-center", "overflow-hidden", "rounded-3xl", "bg-gradient-to-br", "from-sky-500", "to-blue-700", "p-5", "text-center", "text-white", "shadow-lg", "transition", "duration-200", "hover:-translate-y-1", "hover:shadow-xl");

        const dateHeading = document.createElement("h3");
        dateHeading.classList.add("text-sm", "font-semibold", "tracking-wide", "text-blue-100");
        dateHeading.textContent = date;

        const icon = document.createElement("p");
        icon.classList.add("my-3", "flex", "h-16", "w-16", "items-center", "justify-center", "rounded-full", "bg-white/15", "text-4xl", "transition", "group-hover:scale-110");
        icon.textContent = weather.icon;
        const description = document.createElement("p");
        description.classList.add("text-base", "font-semibold", "text-white");
        description.textContent = weather.label;
        const temperature = document.createElement("p");
        temperature.classList.add("mt-3", "text-xl", "font-bold", "tracking-tight", "text-white");
        temperature.textContent = `${Math.round(daily.temperature_2m_min[index])}°  /  ${Math.round(daily.temperature_2m_max[index])}°C`;
        const rain = document.createElement("p");
        rain.classList.add("mt-3", "rounded-full", "bg-white/15", "px-3", "py-1.5", "text-xs", "font-medium", "text-blue-50");
        rain.textContent = `💧 Risque de pluie : ${daily.precipitation_probability_max[index]}%`;

        card.append(dateHeading, icon, description, temperature, rain);
        grid.append(card);
    }

    section.append(grid);
    return section;
}
