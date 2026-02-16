
import React from 'react';
import { Button, Card } from './CommonUI';

export const BetaReferral: React.FC<{ onClose: () => void; onShare: () => void }> = ({ onClose, onShare }) => {
  const referralLink = "https://nexus.creative/beta/ref-" + Math.random().toString(36).substring(7);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    onShare();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <Card className="max-w-md w-full border-indigo-500/30 p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 accent-gradient opacity-50"></div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/></svg>
        </div>

        <h3 className="text-2xl font-black text-white mb-2">INDICAÇÃO NEXUS</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Compartilhe seu link beta exclusivo com amigos e ganhe <span className="text-indigo-400 font-bold">1000 pontos (+10GB)</span> de energia instantaneamente!
        </p>

        <div className="bg-black/50 border border-white/10 rounded-xl p-4 mb-8 flex items-center gap-3">
          <code className="text-[10px] text-indigo-300 flex-1 truncate">{referralLink}</code>
          <button 
            onClick={copyToClipboard}
            className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
          >
            COPIAR
          </button>
        </div>

        <Button onClick={copyToClipboard} className="w-full py-4 accent-gradient shadow-xl">
          COMPARTILHAR AGORA
        </Button>
      </Card>
    </div>
  );
};
