
import React, { useState } from 'react';
import { Button, Card, LoadingSpinner } from './CommonUI';
import { generateTTS } from '../services/gemini';
import { GenerationState } from '../types';

export const AudioStudio: React.FC = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [emotion, setEmotion] = useState('');
  const [state, setState] = useState<GenerationState>({
    loading: false,
    error: null,
    resultUrl: null,
    status: ''
  });

  const voices = [
    { id: 'Kore', name: 'Kore (Masculino - Enérgico)' },
    { id: 'Puck', name: 'Puck (Feminino - Suave)' },
    { id: 'Charon', name: 'Charon (Profundo/Sombrio)' },
    { id: 'Fenrir', name: 'Fenrir (Forte/Autoritário)' },
    { id: 'Zephyr', name: 'Zephyr (Calmo/Relaxante)' }
  ];

  const emotions = [
    { id: '', label: 'Neutro' },
    { id: 'empolgado e vibrante', label: 'Empolgado' },
    { id: 'sério e profissional', label: 'Sério' },
    { id: 'sombrio e misterioso', label: 'Misterioso' },
    { id: 'calmo e reconfortante', label: 'Calmo' },
    { id: 'agressivo e direto', label: 'Tático/Forte' }
  ];

  const handleGenerate = async () => {
    if (!text) return;
    setState({ loading: true, error: null, resultUrl: null, status: 'Sintetizando voz de alta fidelidade...' });
    try {
      const url = await generateTTS(text, voice, emotion);
      setState({ loading: false, error: null, resultUrl: url, status: 'Narração Pronta!' });
    } catch (err: any) {
      setState({ loading: false, error: err.message || 'Falha ao gerar áudio', resultUrl: null, status: '' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto p-4">
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Módulo de Áudio</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Roteiro da Narração</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Insira o texto para ser narrado pela IA..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 h-40 resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Personalidade Vocal</label>
              <select 
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {voices.map(v => (
                  <option key={v.id} value={v.id} className="bg-[#0a0a0a]">{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tom & Emoção</label>
              <div className="grid grid-cols-3 gap-2">
                {emotions.map((e) => (
                  <button 
                    key={e.id}
                    onClick={() => setEmotion(e.id)}
                    className={`text-[9px] font-bold p-2 rounded border transition-all ${emotion === e.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={state.loading || !text} className="w-full py-4 accent-gradient shadow-xl">
              {state.loading ? 'Gerando Áudio...' : 'Sintetizar Voz'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <Card className="min-h-[400px] flex items-center justify-center relative bg-black/40 border-white/5">
          {state.loading ? (
            <LoadingSpinner message={state.status} />
          ) : state.resultUrl ? (
            <div className="w-full flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="w-32 h-32 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" /></svg>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-xl">HQ Audio</div>
              </div>
              
              <audio src={state.resultUrl} controls className="w-full max-w-md filter invert opacity-80" />
              
              <div className="flex gap-4">
                <a href={state.resultUrl} download="nexus-voice.wav" className="px-10 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  Exportar WAV
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <p className="text-gray-400 font-medium">Pronto para Sintetizar</p>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">Vozes Neurais de Alta Definição</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
