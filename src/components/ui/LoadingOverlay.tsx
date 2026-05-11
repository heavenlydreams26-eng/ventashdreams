import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export function LoadingOverlay({ 
  visible, 
  text = "Cargando..." 
}: { 
  visible: boolean;
  text?: string;
}) {
  const [show, setShow] = useState(visible);

  // Smooth un-mount
  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-cyber-black/80 backdrop-blur-sm transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative w-full max-w-sm h-48 flex items-center justify-center perspective-[1000px]">
        {/*
          Instrucciones para el usuario:
          Debes asegurarte que la imagen de la camioneta (la que subiste) esté guardada 
          en la carpeta 'public' de tu proyecto con el nombre de 'loading-van.png'.
        */}
        <div className="w-56 h-56 animate-drive drop-shadow-2xl flex items-center justify-center relative bg-cyber-dark/50 rounded-lg overflow-hidden border border-cyber-electric/30">
            <img 
              src="/loading-van.png" 
              alt="Camioneta cargando..." 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'text-xs text-center p-4 text-cyber-electric';
                  fallback.innerText = 'Sube tu imagen como "loading-van.png" a la carpeta "public"';
                  parent.appendChild(fallback);
                }
              }}
            />
            {/* Animación de ZZZ simulando dormir */}
            <div className="absolute top-[35%] left-[55%] text-cyan-400 font-bold font-mono z-[10] select-none pointer-events-none text-glow">
               <span className="absolute animate-float-zzz-1 text-xl">Z</span>
               <span className="absolute animate-float-zzz-2 -ml-2 -mt-3 text-2xl">Z</span>
               <span className="absolute animate-float-zzz-3 -ml-4 -mt-6 text-3xl">Z</span>
            </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 bg-cyber-electric rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_var(--theme-electric)]"></div>
          <div className="w-2.5 h-2.5 bg-cyber-electric rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_var(--theme-electric)]"></div>
          <div className="w-2.5 h-2.5 bg-cyber-electric rounded-full animate-bounce shadow-[0_0_10px_var(--theme-electric)]"></div>
        </div>
        <p className="text-cyber-electric font-bold tracking-widest text-sm uppercase mt-4 text-glow">
          {text}
        </p>
      </div>
    </div>
  );
}
