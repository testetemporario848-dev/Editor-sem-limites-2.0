
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, LoadingSpinner } from './CommonUI';
import { generateVideo, fileToBase64 } from '../services/gemini';
import { GenerationState } from '../types';

interface VideoEditorProps {
  initialImage?: File | null;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ initialImage }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(initialImage || null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Video Config States
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

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
    if (initialImage) {
      setImage(initialImage);
      setPreview(URL.createObjectURL(initialImage));
    }
  }, [initialImage]);

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
      setPreview(URL.createObjectURL(file));
      setHistory([]);
      setHistoryIndex(-1);
      setState(prev => ({ ...prev, resultUrl: null, error: null }));
    }
  };

  const addPreset = (text: string) => {
    setPrompt(prev => prev ? `${prev}, ${text}` : text);
  };

  const handleGenerate = async () => {
    if (!prompt) return;

    // MANDATORY: Check for API Key selection for Veo models.
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey && typeof aistudio.openSelectKey === 'function') {
        await aistudio.openSelectKey();
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null, status: 'Nossa IA está concebendo seu vídeo...' }));
    
    const messages = [
      "Processando física de partículas...",
      "Simulando iluminação dinâmica...",
      "Refinando movimentos táticos...",
      "Renderizando efeitos de disparo...",
      "Sincronizando quadros de alta fidelidade..."
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setState(prev => ({ ...prev, status: messages[msgIdx] }));
    }, 8000);

    try {
      let b64, type;
      if (image) {
        b64 = await fileToBase64(image);
        type = image.type;
      }
      const result = await generateVideo(prompt, b64, type, { resolution, aspectRatio });
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(result);
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setState(prev => ({ ...prev, loading: false, error: null, status: 'Produção completa!' }));
    } catch (err: any) {
      // If error indicates key issue, prompt to re-select
      if (err.message && err.message.includes("Requested entity was not found") && aistudio?.openSelectKey) {
        await aistudio.openSelectKey();
      }
      setState(prev => ({ ...prev, loading: false, error: err.message || 'Falha na geração do vídeo', status: '' }));
    } finally {
      clearInterval(interval);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  };

  const actions = [
    { label: "Recarga Tática", val: "recarga de carregador tática rápida com movimento de câmera dinâmico" },
    { label: "Slow Motion", val: "movimento em câmera lenta extrema (1000fps) destacando detalhes balísticos" },
    { label: "Impacto Real", val: "projétil atingindo alvo com fragmentação de ambiente realista e poeira" },
    { label: "POV / FPS", val: "visão em primeira pessoa (POV) com balanço de câmera de caminhada tática" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto p-4">
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Módulo de Vídeo</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Resolução</label>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                  <button onClick={() => setResolution('720p')} className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${resolution === '720p' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>720P</button>
                  <button onClick={() => setResolution('1080p')} className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${resolution === '1080p' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>1080P</button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Formato</label>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                  <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>16:9</button>
                  <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>9:16</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Quadro de Referência</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/50 transition-colors bg-white/[0.02]">
                {preview ? <img src={preview} alt="Referência" className="max-h-32 mx-auto rounded-lg shadow-xl" /> : <p className="text-gray-500 text-xs">Arraste uma foto aqui</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Script Visual</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva a sequência cinematográfica..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 h-24 resize-none text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Ações Predefinidas</label>
              <div className="grid grid-cols-2 gap-2">
                {actions.map((act, i) => (
                  <button key={i} onClick={() => addPreset(act.val)} className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 p-2 rounded text-left transition-all">{act.label}</button>
                ))}
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={state.loading || !prompt} className="w-full py-4 accent-gradient shadow-xl">
              {state.loading ? 'Renderizando...' : 'Iniciar Produção Veo'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-2">
            <Button variant="secondary" className="px-4 py-2 text-xs" onClick={handleUndo} disabled={historyIndex < 0 || state.loading}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              Voltar
            </Button>
            <Button variant="secondary" className="px-4 py-2 text-xs" onClick={handleRedo} disabled={historyIndex >= history.length - 1 || state.loading}>
              Avançar
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
            </Button>
          </div>
          {history.length > 0 && (
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              Produção {historyIndex + 1} de {history.length}
            </span>
          )}
        </div>

        <Card className="min-h-[550px] flex items-center justify-center relative bg-black border-white/5">
          {state.loading ? (
            <LoadingSpinner message={state.status} />
          ) : state.resultUrl ? (
            <div className="w-full flex flex-col items-center">
              <video key={state.resultUrl} src={state.resultUrl} controls autoPlay loop className="max-w-full rounded-xl shadow-2xl bg-black border border-white/10" />
              <div className="mt-6 flex gap-4">
                <a href={state.resultUrl} download="nexus-video.mp4" className="px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                  Baixar Produção (MP4)
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>
              </div>
              <p className="text-gray-400 font-medium">Estúdio Pronto para Produção</p>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">Tecnologia Veo 3.1 Ativada</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
