
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, LoadingSpinner } from './CommonUI';
import { editImage, fileToBase64 } from '../services/gemini';
import { GenerationState } from '../types';

interface ImageEditorProps {
  isPro: boolean;
  energyUsed: number;
  maxEnergy: number;
  onEdit: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ isPro, energyUsed, maxEnergy, onEdit }) => {
  const [prompt, setPrompt] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<GenerationState>({
    loading: false,
    error: null,
    resultUrl: null,
    status: ''
  });

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (historyIndex >= 0 && historyIndex < history.length) {
      setState(prev => ({ ...prev, resultUrl: history[historyIndex] }));
    } else if (historyIndex === -1) {
      setState(prev => ({ ...prev, resultUrl: null }));
    }
  }, [historyIndex, history]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setHistory([]);
      setHistoryIndex(-1);
      setState(prev => ({ ...prev, resultUrl: null, error: null }));
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;

    setState(prev => ({ ...prev, loading: true, error: null, status: 'Reimaginando a composição...' }));
    try {
      const base64 = await fileToBase64(image);
      const result = await editImage(prompt, base64, image.type);
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(result);
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      onEdit();
      setState(prev => ({ ...prev, loading: false, error: null, status: 'Renderização concluída!' }));
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message || 'Falha ao editar imagem', status: '' }));
    }
  };

  const addPreset = (text: string) => {
    setPrompt(prev => prev ? `${prev}, ${text}` : text);
  };

  const allCategories = [
    {
      title: "Realismo de Armamento & Combate",
      items: [
        { label: "Aço Carbono", val: "textura de aço carbono polido com reflexos reais de alta fidelidade" },
        { label: "Calor do Cano", val: "efeito térmico e distorção de calor no cano após disparos" },
        { label: "Cerakote Tan", val: "acabamento tático cerakote desert tan fosco anti-reflexo" },
        { label: "Gravação Tática", val: "números de série e logotipos militares gravados a laser" },
        { label: "Desgaste", val: "desgaste de bordas metálicas e arranhões de combate realistas" },
        { label: "Óleo Balístico", val: "fina camada de lubrificante metálico com brilho iridescente" },
        { label: "Impacto", val: "faíscas e detritos de impacto balístico em superfície sólida" },
        { label: "Munição", val: "estojos de latão polido com reflexos especulares perfeitos" }
      ]
    },
    {
      title: "Materiais & Engenharia",
      items: [
        { label: "Fibra de Carbono", val: "entrelaçamento de fibra de carbono 3k com verniz brilhante" },
        { label: "Kevlar Mil-Spec", val: "trama de fibra de kevlar balística de alta densidade" },
        { label: "Titânio G5", val: "acabamento de titânio aeroespacial com tons azulados de calor" },
        { label: "Alumínio 7075", val: "anodização preta de alumínio de grau militar" },
        { label: "Grip Polímero", val: "textura estriada de polímero injetado ergonômico" },
        { label: "Madeira Nogueira", val: "madeira de luxo polida com veios naturais profundos" },
        { label: "Plexiglass", val: "transparência com refração tática e poeira superficial" },
        { label: "Aço Inox", val: "acabamento espelhado de aço inoxidável cirúrgico" }
      ]
    },
    {
      title: "Óptica & Dispositivos",
      items: [
        { label: "Red Dot", val: "ponto vermelho holográfico nítido com efeito bloom" },
        { label: "Night Vision G3", val: "visão noturna fósforo verde com ruído analógico e distorção" },
        { label: "Thermal Imaging", val: "visão de calor infravermelho com degradê branco-quente" },
        { label: "Lente Coated", val: "reflexos roxos e verdes de tratamento anti-reflexo de lente" },
        { label: "Laser IR", val: "feixe laser infravermelho visível apenas em névoa" },
        { label: "Anamorphic Pro", val: "bokeh oval e lens flares horizontais ultra-wide" },
        { label: "Macro Tático", val: "foco seletivo extremo em engrenagens e mecanismos" },
        { label: "Prisma 4x", val: "visão através de luneta tática com retículo iluminado" }
      ]
    },
    {
      title: "Cenários & Atmosferas",
      items: [
        { label: "Range Noturno", val: "estande de tiro à noite com iluminação de mercúrio" },
        { label: "Hangar Militar", val: "ambiente industrial com luzes de teto frias e sombras duras" },
        { label: "Zona de Guerra", val: "fumaça volumétrica, brasas e poeira em suspensão" },
        { label: "Cyber Punk", val: "chuva, luzes neon e reflexos em asfalto molhado" },
        { label: "Nuclear Sun", val: "iluminação solar desértica agressiva com alto contraste" },
        { label: "Foggy Forest", val: "névoa densa entre árvores com raios crepusculares" },
        { label: "Underground", val: "bunker de concreto com luzes de emergência vermelhas" },
        { label: "Sci-Fi Lab", val: "iluminação LED integrada em superfícies brancas minimalistas" }
      ]
    }
  ];

  const filteredCategories = allCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-4 space-y-6">
        <Card className="max-h-[85vh] overflow-y-auto custom-scrollbar border-indigo-500/10">
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            Controle Nexus
            <span className="text-[10px] px-2 py-1 rounded font-black bg-indigo-500/20 text-indigo-400">
              OPEN ACCESS
            </span>
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Mídia de Referência</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/50 transition-all bg-white/[0.02]"
              >
                {preview ? (
                  <img src={preview} alt="Referência" className="max-h-32 mx-auto rounded-lg shadow-2xl" />
                ) : (
                  <div className="text-gray-500 text-xs">
                    <p className="font-bold text-white/50">Carregar Imagem</p>
                    <p className="mt-1 opacity-50">Processamento Instantâneo</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Comandos de IA</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva as modificações detalhadamente..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 h-24 resize-none text-sm transition-all"
              />
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Pesquisar presets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none pr-10 transition-all"
              />
              <svg className="w-4 h-4 absolute right-3 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="space-y-5">
              {filteredCategories.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{cat.title}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.items.map((item, j) => (
                      <button 
                        key={j}
                        onClick={() => addPreset(item.val)} 
                        className="text-[9px] font-bold bg-white/5 hover:bg-white/10 border border-white/5 p-2 rounded text-left transition-all active:scale-95 leading-tight text-gray-400 hover:text-white"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleEdit} 
              disabled={state.loading || !image || !prompt} 
              className="w-full py-4 shadow-xl accent-gradient"
            >
              {state.loading ? 'Renderizando...' : 'Executar Edição Grátis'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-2">
            <Button variant="secondary" className="px-4 py-2 text-xs" onClick={() => historyIndex > 0 && setHistoryIndex(prev => prev - 1)} disabled={historyIndex < 0 || state.loading}>
              Voltar
            </Button>
            <Button variant="secondary" className="px-4 py-2 text-xs" onClick={() => historyIndex < history.length - 1 && setHistoryIndex(prev => prev + 1)} disabled={historyIndex >= history.length - 1 || state.loading}>
              Avançar
            </Button>
          </div>
          {history.length > 0 && (
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
              SESSÃO: {historyIndex + 1} / {history.length}
            </span>
          )}
        </div>

        <Card className="min-h-[600px] flex items-center justify-center relative bg-black/50 border-white/5 border-2 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
          {state.loading ? (
            <LoadingSpinner message={state.status} />
          ) : state.error ? (
            <div className="text-center p-12">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-red-400 font-bold text-sm uppercase tracking-widest">{state.error}</p>
            </div>
          ) : state.resultUrl ? (
            <div className="w-full flex flex-col items-center p-4">
              <img src={state.resultUrl} alt="Output" className="max-w-full rounded-xl shadow-2xl mx-auto border border-white/10 animate-in fade-in zoom-in duration-500" />
              <div className="mt-8 flex gap-4">
                <a href={state.resultUrl} download="nexus-edit.png" className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Exportar Resultado
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center p-12">
              <div className="w-24 h-24 bg-indigo-500/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-indigo-500/10">
                <svg className="w-12 h-12 text-indigo-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs">Aguardando Referência</p>
              <p className="text-[9px] text-indigo-500/40 uppercase tracking-widest mt-3 font-bold">Ambiente de Edição Livre Nexus</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
