
import React, { useState } from 'react';
import { ImageEditor } from './components/ImageEditor';
import { VideoEditor } from './components/VideoEditor';
import { AudioStudio } from './components/AudioStudio';

type EditorModule = 'image' | 'video' | 'audio';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<EditorModule>('image');
  const [copied, setCopied] = useState(false);
  
  const isPro = true;
  const energyUsed = 0;
  const maxEnergy = 999999;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header - Otimizado para Mobile e Cópia de Link */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 accent-gradient rounded-lg md:rounded-xl flex items-center justify-center font-black text-lg md:text-xl shadow-lg shadow-indigo-500/20 text-white">
              N
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-xl font-bold tracking-tight text-white uppercase leading-none">Nexus</h1>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">Unlocked</p>
            </div>
          </div>
          
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 scale-90 md:scale-100">
            <button 
              onClick={() => setActiveModule('image')} 
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-black tracking-widest transition-all ${activeModule === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              IMAGEM
            </button>
            <button 
              onClick={() => setActiveModule('video')} 
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-black tracking-widest transition-all ${activeModule === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              VÍDEO
            </button>
            <button 
              onClick={() => setActiveModule('audio')} 
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-black tracking-widest transition-all ${activeModule === 'audio' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              ÁUDIO
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão de Copiar Link */}
            <button 
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${copied ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
              title="Copiar Link do App"
            >
              {copied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              )}
              <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">
                {copied ? 'Copiado!' : 'Copiar App'}
              </span>
            </button>

            <div className="w-px h-6 bg-white/10 mx-1"></div>

            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
               <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto mb-6 md:mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-2xl md:text-6xl font-black mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 uppercase tracking-tighter">
            {activeModule === 'image' ? 'Image Studio' : activeModule === 'video' ? 'Video Engine' : 'Audio Lab'}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-[9px] md:text-sm uppercase tracking-widest font-bold">
            Ambiente Criativo Unlocked | <span className="text-indigo-400">Acesso Irrestrito</span>
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
      <footer className="py-4 md:py-8 px-4 md:px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <p className="text-center md:text-left">© 2024 Nexus Creative Suite.</p>
          <div className="flex gap-4 md:gap-6">
            <span className="flex items-center gap-2 text-indigo-400 cursor-pointer" onClick={handleCopyLink}>
              {copied ? 'URL COPIADA COM SUCESSO' : 'COMPARTILHAR ACESSO PÚBLICO'}
            </span>
            <span className="flex items-center gap-2 text-green-500">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></span>
              SISTEMA NOMINAL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
