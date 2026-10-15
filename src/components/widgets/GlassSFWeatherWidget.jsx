import React from 'react';
import { GlassSurface } from '../ui/glass-surface';
import { useLiveWeather } from '../../services/weatherService';
import { RenderWeatherIcon } from './WeatherWidget';

export default function GlassSFWeatherWidget() {
  const weather = useLiveWeather();

  return (
    <div className="w-40 h-40 p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={0}
        radius={24}
        blur={8}
        chroma={0.3}
        className="absolute inset-0 -z-10"
      />

      {/* Top half */}
      <div className="relative z-10">
        <div className="flex items-center gap-1 text-[13px] font-bold text-white/95 leading-none truncate">
          <span className="truncate">{weather.city}</span>
          {weather.isUserLocation && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="text-white/85 shrink-0">
              <path d="M21 3L3 10.53v.98l6.84 2.65L12.5 21h.98L21 3z" />
            </svg>
          )}
        </div>
        <div className="text-[38px] font-light text-white/95 mt-1.5 leading-none">
          {weather.temp}°
        </div>
      </div>

      {/* Bottom half */}
      <div className="relative z-10 mt-auto">
        <div className="flex items-center text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.4)] mb-1">
          <RenderWeatherIcon code={weather.weatherCode} isDay={weather.isDay} className="w-5 h-5" />
        </div>
        <div className="text-[11px] font-bold text-white/95 leading-none truncate">
          {weather.condition}
        </div>
        <div className="text-[9.5px] text-white/60 font-medium tracking-tight mt-1 leading-none">
          H:{weather.high}° L:{weather.low}°
        </div>
      </div>
    </div>
  );
}
