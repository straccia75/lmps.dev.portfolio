"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Code2, Sparkles, Mic, MessageCircle } from 'lucide-react';

export default function PortfolioPage() {
  // Estado para el contador
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cambia esta fecha por la fecha real en la que planeas lanzar (Año-Mes-Día)
    const targetDate = new Date("2026-11-01T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#050505] text-zinc-400 font-sans selection:bg-blue-500/30 selection:text-white relative flex flex-col items-center">
      
      {/* Luces de fondo ambientales */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header - Logo */}
      <header className="relative z-10 w-full pt-6 flex justify-center shrink-0">
        <div className="relative w-56 h-20 sm:w-72 sm:h-24">
          <Image 
            src="/logo1.png" 
            alt="Brand Logo" 
            fill 
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full max-w-4xl text-center">
        
        {/* Badge / Contador Animado */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-xs font-medium text-zinc-300 mb-4 backdrop-blur-md shadow-lg shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-zinc-400">V2.0 Launch in:</span>
          {isMounted ? (
            <span className="text-white font-mono tracking-wider font-semibold">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          ) : (
            <span className="text-white font-mono tracking-wider font-semibold">Loading...</span>
          )}
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1] mb-3 shrink-0">
          Building the next <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">
            generation of learning.
          </span>
        </h1>
        
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 max-w-2xl font-light shrink-0">
          My personal portfolio is temporarily offline while I pivot my digital presence. The core focus of this transition is my upcoming SaaS ecosystem.
        </p>

        {/* Tarjeta de Proyecto: ProSpeak */}
        <div className="w-full text-left bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04] group relative overflow-hidden shrink-0">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">Upcoming Release</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">ProSpeak</h2>
              </div>
              
              <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-semibold text-blue-300 uppercase tracking-widest flex items-center gap-2 shadow-inner">
                <Mic className="w-3 h-3" />
                AI Pronunciation Practice
              </div>
            </div>
            
            <p className="text-zinc-400 leading-relaxed mb-5 text-[13px] sm:text-sm font-light max-w-3xl">
              An English learning platform designed for professionals across all industries. ProSpeak integrates Artificial Intelligence specifically to help users practice their pronunciation, enabling confident and fluent communication in the workplace.
            </p>

            {/* Stack Tecnológico Real */}
            <div>
              <h3 className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Code2 className="w-3 h-3" />
                Engineering Stack
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  'Next.js', 
                  'React', 
                  'Tailwind CSS',
                  'TypeScript', 
                  'Python Backend',
                  'FastAPI', 
                  'Alembic', 
                  'SQLite',
                  'JWT in Cookies'
                ].map(tech => (
                  <span 
                    key={tech} 
                    className="px-2.5 py-1 border border-white/10 bg-black/40 text-zinc-300 text-[9px] sm:text-[10px] font-medium rounded-lg shadow-sm backdrop-blur-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <a 
          href="https://wa.me/+393332988640?text=Hi,%20I%20visited%20your%20portfolio%20and%20I%20would%20like%20to%20request%20a%20quote%20for%20my%20project."           target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 rounded-full text-xs sm:text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Request a Quote / Contact Me
        </a>

      </main>

      {/* Footer minimalista */}
      <footer className="relative z-10 w-full pb-4 text-[10px] text-zinc-600 text-center shrink-0">
        <p>© 2026. All rights reserved.</p>
      </footer>
      
    </div>
  );
}