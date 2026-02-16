
import React, { useState } from 'react';
import { ImageEditor } from './components/ImageEditor';
import { VideoEditor } from './components/VideoEditor';
import { AudioStudio } from './components/AudioStudio';

type EditorModule = 'image' | 'video' | 'audio';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<EditorModule>('image');
  
  // All users are now "Pro" by default with no login required
  const isPro = true;
  const energyUsed = 0;
  const maxEnergy = 999999;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20 text-white">
              N
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">Nexus</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">Creative Suite Unlocked</p>
            </div>
          </div>
          
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button 
              onClick={() => setActiveModule('image')} 
              className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeModule === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              IMAGEM
            </button>
            <button 
              onClick={() => setActiveModule('video')} 
              className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeModule === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              VÍDEO
            </button>
            <button 
              onClick={() => setActiveModule('audio')} 
              className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${activeModule === 'audio' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              ÁUDIO
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Acesso</span>
                 <span className="text-[10px] font-black text-indigo-400">
                    ∞ ILIMITADO
                 </span>
               </div>
            </div>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
               <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 uppercase tracking-tighter">
            {activeModule === 'image' ? 'Image Studio Pro' : activeModule === 'video' ? 'Cinematic Video Engine' : 'Audio Synthesis Lab'}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm uppercase tracking-widest font-bold">
            Ambiente Criativo Nexus Cloud v2.5 | <span className="text-indigo-400">Totalmente Gratuito e Irrestrito</span>
          </p>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-500">
          {activeModule === 'image' && (
            <ImageEditor 
              isPro={isPro} 
              energyUsed={energyUsed} 
              maxEnergy={maxEnergy} 
              onEdit={() => {}} 
            />
          )}
          {activeModule === 'video' && <VideoEditor />}
          {activeModule === 'audio' && <AudioStudio />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <p>© 2024 Nexus Creative Suite. Suite de Ferramentas Públicas.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-indigo-400">
              MODO FULL ACCESS ATIVADO
            </span>
            <span className="flex items-center gap-2 text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              SISTEMA NOMINAL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
