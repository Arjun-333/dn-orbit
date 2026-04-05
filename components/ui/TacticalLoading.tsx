"use client";

import React from 'react';

interface TacticalLoadingProps {
  message?: string;
}

export const TacticalLoading = ({ message = "ESTABLISHING_UPLINK" }: TacticalLoadingProps) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[1010]" />
      
      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-[1011] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-[1020] space-y-8 flex flex-col items-center max-w-md w-full px-6">
        <div className="text-white text-5xl font-black italic tracking-tighter uppercase text-center leading-none">
          {message}
        </div>
        
        <div className="w-full h-px bg-zinc-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-white w-1/3 animate-[loading-bar_1.5s_infinite_ease-in-out]" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-bold animate-pulse">
            TRANSMITTING_CALIBRATION_PACKETS
          </div>
          <div className="text-[8px] text-zinc-800 uppercase tracking-widest font-bold">
            ADDRESS_SPACE: 0x{Math.random().toString(16).slice(2, 6).toUpperCase()} // SECURE_HANDSHAKE
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};
