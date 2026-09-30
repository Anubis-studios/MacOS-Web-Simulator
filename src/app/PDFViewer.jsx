import React from "react";
import { useAppStore } from "../store/Appstore";

import TrafficLights from "../components/TrafficLights";

export default function PDFViewer({ file, windowId, isDragging, isResizing }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  if (!file) return null;

  return (
    <div className={`flex flex-col h-full w-full select-none transition-colors duration-150 ${
      isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
    }`}>
      <div className={`window-drag-handle flex items-center justify-between border-b px-4 py-2.5 select-none cursor-grab active:cursor-grabbing ${
        isDarkMode ? "bg-[#2D2D2D] border-white/10" : "bg-[#F6F6F6] border-gray-200"
      }`}>
        {/* Traffic Lights */}
        <div className="flex items-center gap-1.5 group/pdf-traffic w-16">
          <TrafficLights windowId={windowId} />
        </div>

        <h2 className="text-xs font-semibold text-center flex-1">{file.name}</h2>
        <div className="w-16"></div>
      </div>
      <iframe 
        src={file.url} 
        title={file.name}
        className={`flex-1 w-full border-none bg-white ${isDragging || isResizing ? "pointer-events-none" : ""}`} 
      />
    </div>
  );
}
