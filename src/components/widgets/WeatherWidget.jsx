import React from 'react';
import { useLiveWeather } from '../../services/weatherService';

const SunIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" fill="currentColor" className="text-yellow-300 stroke-none" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" className="text-indigo-200 stroke-none" />
  </svg>
);

const CloudIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.3 1.5-4.3 3.6-4.8A6 6 0 0 1 18 13.5a5 5 0 0 1-.5 5.5Z" fill="currentColor" className="text-white/80 stroke-none" />
  </svg>
);

const PartlyCloudyIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41" className="text-yellow-300" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" fill="currentColor" className="text-yellow-300 stroke-none" />
    <path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.3 1.5-4.3 3.6-4.8A6 6 0 0 1 18 13.5a5 5 0 0 1-.5 5.5Z" fill="currentColor" className="text-white/80 stroke-none" />
  </svg>
);

const RainIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 15H9a5 5 0 0 1-5-5c0-2.3 1.5-4.3 3.6-4.8A6 6 0 0 1 18 9.5a5 5 0 0 1-.5 5.5Z" fill="currentColor" className="text-white/80 stroke-none" />
    <line x1="8" y1="17" x2="8" y2="21" stroke="currentColor" />
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" />
    <line x1="16" y1="17" x2="16" y2="21" stroke="currentColor" />
  </svg>
);

const ThunderIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 14H9a5 5 0 0 1-5-5c0-2.3 1.5-4.3 3.6-4.8A6 6 0 0 1 18 8.5a5 5 0 0 1-.5 5.5Z" fill="currentColor" className="text-white/80 stroke-none" />
    <polygon points="13 13 9 19 14 19 11 23 17 16 13 16 15 13" fill="currentColor" className="text-yellow-300 stroke-none" />
  </svg>
);

export function RenderWeatherIcon({ code, isDay = 1, className = "w-5 h-5" }) {
  if (code === 0 || code === 1) {
    return isDay ? <SunIcon className={className} /> : <MoonIcon className={className} />;
  }
  if (code === 2) {
    return <PartlyCloudyIcon className={className} />;
  }
  if (code === 3 || code === 45 || code === 48) {
    return <CloudIcon className={className} />;
  }
  if (code >= 51 && code <= 82) {
    return <RainIcon className={className} />;
  }
  if (code >= 95) {
    return <ThunderIcon className={className} />;
  }
  return isDay ? <SunIcon className={className} /> : <MoonIcon className={className} />;
}

export default function WeatherWidget() {
  const weather = useLiveWeather();

  return (
    <div className="w-40 h-40 p-4 flex flex-col justify-between bg-gradient-to-br from-[#4b88d3] to-[#4374b6] rounded-3xl text-white shadow-sm select-none shrink-0 pointer-events-auto">
      <div>
        <div className="flex items-center gap-1 text-sm font-semibold mb-1 truncate">
          <span className="truncate">{weather.city}</span>
          {weather.isUserLocation && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="text-white/90 shrink-0">
              <path d="M21 3L3 10.53v.98l6.84 2.65L12.5 21h.98L21 3z" />
            </svg>
          )}
        </div>
        <div className="text-5xl font-light">{weather.temp}°</div>
      </div>
      <div>
        <div className="flex items-center text-yellow-300 drop-shadow-sm mb-1">
          <RenderWeatherIcon code={weather.weatherCode} isDay={weather.isDay} className="w-5 h-5" />
        </div>
        <div className="text-xs font-semibold truncate">{weather.condition}</div>
        <div className="text-xs text-white/80 font-medium tracking-tight mt-0.5">
          H:{weather.high}° L:{weather.low}°
        </div>
      </div>
    </div>
  );
}
