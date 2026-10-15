import React from "react";
import { useAppStore } from "../store/Appstore";

/**
 * Shared TrafficLights component with robust touch and pointer interaction handling.
 * Prevents drag interception, adds proper hitboxes, and ensures smooth close/minimize/maximize
 * across mobile, tablet (portrait & landscape), and desktop.
 */
export default function TrafficLights({ windowId, onClose }) {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    } else if (windowId) {
      close(windowId);
    }
  };

  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    if (windowId) minimize(windowId);
  };

  const handleMaximizeClick = (e) => {
    e.stopPropagation();
    if (windowId) toggleMaximize(windowId);
  };

  return (
    <div 
      className="traffic-lights-container flex items-center gap-2 group mr-4 select-none shrink-0"
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        type="button"
        className="traffic-light-btn w-3.5 h-3.5 sm:w-3 sm:h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] active:scale-95 transition-all duration-150 shadow-sm border-0 p-0 outline-none"
        onClick={handleCloseClick}
        title="Close"
      >
        <svg className="w-2 h-2 sm:w-1.5 sm:h-1.5 text-[#820005] opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Minimize Button */}
      <button
        type="button"
        className="traffic-light-btn w-3.5 h-3.5 sm:w-3 sm:h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] active:scale-95 transition-all duration-150 shadow-sm border-0 p-0 outline-none"
        onClick={handleMinimizeClick}
        title="Minimize"
      >
        <svg className="w-2 h-2 sm:w-1.5 sm:h-1.5 text-[#9a6400] opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Maximize / Restore Button */}
      <button
        type="button"
        className="traffic-light-btn w-3.5 h-3.5 sm:w-3 sm:h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] active:scale-95 transition-all duration-150 shadow-sm border-0 p-0 outline-none"
        onClick={handleMaximizeClick}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-2 h-2 sm:w-1.5 sm:h-1.5 text-[#006500] opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
