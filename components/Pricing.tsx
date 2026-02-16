
import React from 'react';
import { Button, Card } from './CommonUI';

interface PricingProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <Card className="border-white/10 flex flex-col items-center text-center p-10 hover:border-white/20 transition-all">
          <h3 className="text-xl font-bold mb-2">Plano Mensal</h3>
          <div className="text-5xl font-black my-6">$5<span className="text-lg text-gray-500 font-normal">/mês</span></div>
          <ul className="text-sm text-gray-400 space-y-3 mb-10 text-left w-full">
            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> <b>ENERGIA INFINITA</b></li>
            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> +1.000 Presets Exclusivos</li>
            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Processamento em 4K Nativo</li>
          </ul>
          <Button onClick={onUpgrade} className="w-full mt-auto">Assinar Agora</Button>
        </Card>

        <Card className="relative border-indigo-500/50 flex flex-col items-center text-center p-10 ring-2 ring-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
          <div className="absolute -top-4 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Economia de 15%</div>
          <h3 className="text-xl font-bold mb-2">Plano Anual</h3>
          <div className="text-5xl font-black my-6">$70<span className="text-lg text-gray-500 font-normal">/ano</span></div>
          <ul className="text-sm text-gray-400 space-y-3 mb-10 text-left w-full">
            <li className="flex items-center gap-2 font-medium text-white"><svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> <b>ENERGIA INFINITA VITALÍCIA</b></li>
            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Suporte Prioritário VIP</li>
            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Acesso Antecipado a Modelos</li>
          </ul>
          <Button onClick={onUpgrade} variant="primary" className="w-full mt-auto accent-gradient">Garantir Plano Anual</Button>
        </Card>
      </div>
    </div>
  );
};
