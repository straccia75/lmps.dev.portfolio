import React from 'react';
import Image from 'next/image';
import { Code2, Sparkles, Mic } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#050505] text-zinc-400 font-sans selection:bg-blue-500/30 selection:text-white relative flex flex-col items-center">
      
  
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

   
      <header className="relative z-10 w-full pt-8 flex justify-center shrink-0">
    
        <div className="relative w-96 h-40 sm:w-[500px] sm:h-[200px]">
          <Image 
            src="/logo1.png" 
            alt="Brand Logo" 
            fill 
            className="object-contain"
            priority
          />
        </div>
      </header>

     
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full max-w-4xl text-center">
        
        {/* Badge Animado */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-xs font-medium text-zinc-300 mb-6 backdrop-blur-md shadow-lg shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          System Architecture Upgrade
        </div>

       
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-4 shrink-0">
          Building the next <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">
            generation of learning.
          </span>
        </h1>
        
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 max-w-2xl font-light shrink-0">
          My personal portfolio is temporarily offline while I pivot my digital presence. The core focus of this transition is my upcoming SaaS ecosystem.
        </p>

        
        <div className="w-full text-left bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04] group relative overflow-hidden shrink-0">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">Upcoming Release</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">ProSpeak</h2>
              </div>
              
              <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-semibold text-blue-300 uppercase tracking-widest flex items-center gap-2 shadow-inner">
                <Mic className="w-3 h-3" />
                AI Pronunciation Practice
              </div>
            </div>
            
           
            <p className="text-zinc-400 leading-relaxed mb-6 text-sm font-light max-w-3xl">
              An English learning platform designed for professionals across all industries. ProSpeak integrates Artificial Intelligence specifically to help users practice their pronunciation, enabling confident and fluent communication in the workplace.
            </p>

         
            <div>
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" />
                Engineering Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Next.js', 
                  'React', 
                  'Tailwind CSS',
                  'JavaScript',
                  'TypeScript', 
                  'Python Backend',
                  'FastAPI', 
                  'Alembic', 
                  'SQLite',
                  'JWT in Cookies'
                ].map(tech => (
                  <span 
                    key={tech} 
                    className="px-3 py-1.5 border border-white/10 bg-black/40 text-zinc-300 text-[10px] sm:text-xs font-medium rounded-lg shadow-sm backdrop-blur-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full pb-6 text-[10px] sm:text-xs text-zinc-600 text-center shrink-0">
        <p>© 2026. All rights reserved.</p>
      </footer>
      
    </div>
  );
}