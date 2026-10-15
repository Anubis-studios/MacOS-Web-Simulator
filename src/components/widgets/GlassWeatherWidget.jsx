import React from 'react';
import { GlassSurface } from '../ui/glass-surface';
import { useLiveWeather } from '../../services/weatherService';
import { RenderWeatherIcon } from './WeatherWidget';

export default function GlassWeatherWidget() {
  const weather = useLiveWeather();

  return (
    <div className="w-80 h-40 p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={0}
        radius={24}
        blur={8}
        chroma={0.3}
        className="absolute inset-0 -z-10"
      />

      {/* Top Section */}
      <div className="relative z-10 flex justify-between items-start w-full">
        {/* Left Info */}
        <div className="max-w-[150px]">
          <div className="flex items-center gap-1 text-[13px] font-bold text-white/95 leading-none truncate">
            <span className="truncate">{weather.city}</span>
            {weather.isUserLocation && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/85 shrink-0">
                <path d="M21 3L3 10.53v.98l6.84 2.65L12.5 21h.98L21 3z" />
              </svg>
            )}
          </div>
          <div className="text-4xl font-light text-white/95 mt-1.5 leading-none">
            {weather.temp}°
          </div>
        </div>

        {/* Right Info */}
        <div className="flex flex-col items-end text-right max-w-[140px]">
          <div className="mb-1 text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.5)]">
            <RenderWeatherIcon code={weather.weatherCode} isDay={weather.isDay} className="w-6 h-6" />
          </div>
          <div className="text-[12px] font-semibold text-white/95 leading-none truncate w-full text-right">
            {weather.condition}
          </div>
          <div className="text-[10px] text-white/60 font-medium tracking-tight mt-1.5 leading-none">
            H:{weather.high}° L:{weather.low}°
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 h-[1px] bg-white/10 my-2" />

      {/* Hourly Forecast */}
      <div className="relative z-10 flex justify-between items-center w-full px-1">
        {weather.hourly.slice(0, 6).map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold text-white/50 uppercase leading-none">
              {hour.time}
            </span>
            <div className="my-0.5 text-white/90">
              <RenderWeatherIcon code={hour.weatherCode} isDay={hour.isDay} className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white/90 leading-none">
              {hour.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
