// Weather code to text / icon mapping for Open-Meteo WMO Weather interpretation codes
export function getWeatherDetails(code, isDay = 1) {
  switch (code) {
    case 0:
      return {
        condition: isDay ? "Clear Sky" : "Clear Night",
        type: "clear",
        icon: isDay ? "sun" : "moon"
      };
    case 1:
      return {
        condition: isDay ? "Mainly Clear" : "Mostly Clear",
        type: "mostly_clear",
        icon: isDay ? "sun" : "moon"
      };
    case 2:
      return {
        condition: "Partly Cloudy",
        type: "partly_cloudy",
        icon: isDay ? "partly_cloudy_day" : "partly_cloudy_night"
      };
    case 3:
      return {
        condition: "Overcast",
        type: "cloudy",
        icon: "cloud"
      };
    case 45:
    case 48:
      return {
        condition: "Foggy",
        type: "fog",
        icon: "fog"
      };
    case 51:
    case 53:
    case 55:
      return {
        condition: "Drizzle",
        type: "drizzle",
        icon: "drizzle"
      };
    case 56:
    case 57:
      return {
        condition: "Freezing Drizzle",
        type: "drizzle",
        icon: "drizzle"
      };
    case 61:
    case 63:
    case 65:
      return {
        condition: "Rain",
        type: "rain",
        icon: "rain"
      };
    case 66:
    case 67:
      return {
        condition: "Freezing Rain",
        type: "rain",
        icon: "rain"
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        condition: "Snow",
        type: "snow",
        icon: "snow"
      };
    case 80:
    case 81:
    case 82:
      return {
        condition: "Rain Showers",
        type: "rain",
        icon: "rain"
      };
    case 85:
    case 86:
      return {
        condition: "Snow Showers",
        type: "snow",
        icon: "snow"
      };
    case 95:
    case 96:
    case 99:
      return {
        condition: "Thunderstorm",
        type: "thunderstorm",
        icon: "thunderstorm"
      };
    default:
      return {
        condition: isDay ? "Sunny" : "Clear",
        type: "clear",
        icon: isDay ? "sun" : "moon"
      };
  }
}

// Default fallback: San Francisco, CA (Celsius)
const DEFAULT_SF = {
  city: "San Francisco",
  lat: 37.7749,
  lon: -122.4194,
  temp: 12,
  high: 14,
  low: 10,
  condition: "Partly Cloudy",
  weatherCode: 2,
  isDay: 1,
  hourly: [
    { time: "NOW", temp: 12, weatherCode: 2, isDay: 1 },
    { time: "5 PM", temp: 12, weatherCode: 2, isDay: 1 },
    { time: "6 PM", temp: 11, weatherCode: 2, isDay: 1 },
    { time: "7 PM", temp: 10, weatherCode: 2, isDay: 0 },
    { time: "8 PM", temp: 9, weatherCode: 1, isDay: 0 },
    { time: "9 PM", temp: 9, weatherCode: 1, isDay: 0 }
  ]
};

// Cached weather state in memory
let cachedWeather = null;
let listeners = new Set();

function notifyListeners() {
  listeners.forEach(fn => fn(cachedWeather));
}

// Fetch reverse geocode name from latitude and longitude
async function getCityName(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      return (
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        addr.state ||
        "My Location"
      );
    }
  } catch (err) {
    console.warn("Could not reverse geocode location", err);
  }
  return "My Location";
}

// Fetch weather from Open-Meteo in Celsius
async function fetchOpenMeteoWeather(lat, lon, cityName) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code&hourly=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&forecast_days=2&timezone=auto`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather from Open-Meteo");
  const data = await res.json();

  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  const currentTemp = Math.round(current.temperature_2m ?? 53);
  const weatherCode = current.weather_code ?? 2;
  const isDay = current.is_day ?? 1;
  const details = getWeatherDetails(weatherCode, isDay);

  const high = daily.temperature_2m_max?.[0] != null ? Math.round(daily.temperature_2m_max[0]) : currentTemp + 4;
  const low = daily.temperature_2m_min?.[0] != null ? Math.round(daily.temperature_2m_min[0]) : currentTemp - 4;

  // Format hourly list from current hour
  const now = new Date();
  const currentHour = now.getHours();
  const hourlyForecast = [];

  if (hourly.time && hourly.temperature_2m) {
    const totalHours = hourly.time.length;
    let startIdx = hourly.time.findIndex(t => {
      const d = new Date(t);
      return d.getHours() === currentHour && d.getDate() === now.getDate();
    });
    if (startIdx === -1) startIdx = 0;

    for (let i = 0; i < 6; i++) {
      const idx = startIdx + i;
      if (idx < totalHours) {
        const timeStr = hourly.time[idx];
        const dateObj = new Date(timeStr);
        const hourNum = dateObj.getHours();
        const hourLabel = i === 0 ? "NOW" : `${hourNum % 12 || 12} ${hourNum >= 12 ? "PM" : "AM"}`;
        const temp = Math.round(hourly.temperature_2m[idx]);
        const hCode = hourly.weather_code?.[idx] ?? weatherCode;
        const hIsDay = hourly.is_day?.[idx] ?? (hourNum >= 6 && hourNum < 19 ? 1 : 0);
        
        hourlyForecast.push({
          time: hourLabel,
          temp,
          weatherCode: hCode,
          isDay: hIsDay
        });
      }
    }
  }

  return {
    city: cityName,
    lat,
    lon,
    temp: currentTemp,
    high,
    low,
    condition: details.condition,
    weatherCode,
    isDay,
    hourly: hourlyForecast.length ? hourlyForecast : DEFAULT_SF.hourly,
    isUserLocation: true
  };
}

let isFetching = false;

export async function fetchLiveWeather() {
  if (isFetching) return cachedWeather;
  isFetching = true;

  // Try Geolocation API
  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err),
        { timeout: 7000, enableHighAccuracy: false }
      );
    });
  };

  try {
    const coords = await getCoordinates();
    const city = await getCityName(coords.lat, coords.lon);
    const weather = await fetchOpenMeteoWeather(coords.lat, coords.lon, city);
    cachedWeather = weather;
    try {
      localStorage.setItem("os_cached_weather", JSON.stringify(weather));
    } catch {}
    notifyListeners();
    isFetching = false;
    return weather;
  } catch (err) {
    // If geolocation denied or unavailable, try IP-based geolocation
    try {
      const ipRes = await fetch("https://ipapi.co/json/");
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.latitude && ipData.longitude) {
          const city = ipData.city || ipData.region || "My Location";
          const weather = await fetchOpenMeteoWeather(ipData.latitude, ipData.longitude, city);
          cachedWeather = weather;
          try {
            localStorage.setItem("os_cached_weather", JSON.stringify(weather));
          } catch {}
          notifyListeners();
          isFetching = false;
          return weather;
        }
      }
    } catch (ipErr) {
      console.warn("IP geolocation fallback failed:", ipErr);
    }

    // Default to San Francisco
    try {
      const sfWeather = await fetchOpenMeteoWeather(DEFAULT_SF.lat, DEFAULT_SF.lon, DEFAULT_SF.city);
      sfWeather.isUserLocation = false;
      cachedWeather = sfWeather;
    } catch {
      cachedWeather = { ...DEFAULT_SF, isUserLocation: false };
    }
    try {
      localStorage.setItem("os_cached_weather", JSON.stringify(cachedWeather));
    } catch {}
    notifyListeners();
    isFetching = false;
    return cachedWeather;
  }
}

// React Hook for widgets
import { useState, useEffect } from "react";

export function useLiveWeather() {
  const [weather, setWeather] = useState(() => {
    if (cachedWeather) return cachedWeather;
    try {
      const local = localStorage.getItem("os_cached_weather");
      if (local) return JSON.parse(local);
    } catch {}
    return { ...DEFAULT_SF, isUserLocation: false };
  });

  useEffect(() => {
    const listener = (newWeather) => {
      if (newWeather) setWeather(newWeather);
    };
    listeners.add(listener);

    fetchLiveWeather();

    // Auto-refresh weather every 15 minutes
    const interval = setInterval(() => {
      fetchLiveWeather();
    }, 15 * 60 * 1000);

    return () => {
      listeners.delete(listener);
      clearInterval(interval);
    };
  }, []);

  return weather;
}
