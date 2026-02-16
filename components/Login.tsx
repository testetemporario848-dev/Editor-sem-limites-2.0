
import React, { useState, useEffect } from 'react';
import { Button, Card } from './CommonUI';

type CommsChannel = 'whatsapp' | 'sms' | 'google' | 'facebook' | null;

interface VerificationStep {
  label: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [stage, setStage] = useState<'intro' | 'identification' | 'confirm' | 'channel' | 'dispatch' | 'code' | 'verifying'>('intro');
  const [channel, setChannel] = useState<CommsChannel>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<VerificationStep[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('identification');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.length < 5) {
      setError("Insira um identificador válido (E-mail ou Telefone).");
      return;
    }
    setError(null);
    setStage('confirm');
  };

  const startDispatch = async () => {
    setStage('dispatch');
    const dispatchSteps: VerificationStep[] = [
      { label: `Conectando ao servidor ${channel?.toUpperCase()}`, status: 'processing' },
      { label: 'Gerando Hash de Segurança OTP', status: 'pending' },
      { label: 'Despachando sinal criptografado', status: 'pending' }
    ];
    setSteps(dispatchSteps);

    for (let i = 0; i < dispatchSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      setSteps(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, status: 'complete' };
        if (idx === i + 1) return { ...s, status: 'processing' };
        return s;
      }));
    }
    
    setTimeout(() => setStage('code'), 500);
  };

  const handleVerify = async () => {
    if (verificationCode !== '123456') {
      setError("Código inválido. Tente '123456' para o protótipo.");
      return;
    }

    setStage('verifying');
    const finalSteps: VerificationStep[] = [
      { label: 'Autenticando via Nexus Cloud', status: 'processing' },
      { label: 'Validando integridade biométrica', status: 'pending' },
      { label: 'Liberando Suite Criativa Irrestrita', status: 'pending' }
    ];
    setSteps(finalSteps);

    for (let i = 0; i < finalSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSteps(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, status: 'complete' };
        if (idx === i + 1) return { ...s, status: 'processing' };
        return s;
      }));
    }

    setTimeout(() => onLogin(), 500);
  };

  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-1000">
          <div className="w-24 h-24 accent-gradient rounded-[2rem] flex items-center justify-center font-black text-5xl shadow-[0_0_60px_rgba(99,102,241,0.5)] text-white mb-8 animate-flare">N</div>
          <h1 className="text-4xl font-black text-white tracking-[0.3em] uppercase">Nexus</h1>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-[0.5em] mt-4">Security Protocol v2.5</p>
        </div>
        <div className="scanline"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      
      <div className="max-w-md w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 accent-gradient rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl text-white mb-6">N</div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Nexus Creative Suite</h1>
          <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Verificação Multifatorial Requerida</p>
        </div>

        <Card className="bg-white/[0.02] border-white/5 p-8 backdrop-blur-3xl min-h-[480px] flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full h-1 accent-gradient opacity-30"></div>

          {stage === 'identification' && (
            <form onSubmit={handleIdSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-4">
                <h2 className="text-white font-bold uppercase tracking-widest text-sm">Acesso Global Nexus</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">E-mail ou Celular</label>
                  <input 
                    type="text" required placeholder="Identificador de conta"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={identifier} onChange={e => setIdentifier(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Senha de Segurança</label>
                  <input 
                    type="password" required placeholder="********"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full py-4 accent-gradient shadow-xl">Continuar Identificação</Button>
            </form>
          )}

          {stage === 'confirm' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Conferência de Dados</h3>
                <p className="text-[10px] text-gray-500 uppercase">Verifique se o destino está correto</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
                <span className="text-xs text-indigo-400 font-mono font-bold block mb-1">Destino:</span>
                <span className="text-lg text-white font-bold break-all">{identifier}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" onClick={() => setStage('identification')} className="py-3 text-[10px]">CORRIGIR</Button>
                <Button onClick={() => setStage('channel')} className="py-3 text-[10px] accent-gradient">ESTÁ CORRETO</Button>
              </div>
            </div>
          )}

          {stage === 'channel' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <h3 className="text-white font-bold uppercase tracking-widest text-[10px] text-center mb-4">Escolha o Canal para Receber o Código</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setChannel('whatsapp')} className="flex flex-col items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl hover:bg-green-500/20 transition-all group">
                  <svg className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.139c1.52.907 3.21 1.385 4.94 1.385h.006c5.441 0 9.869-4.427 9.871-9.87 0-2.64-1.03-5.117-2.9-6.985-1.87-1.868-4.348-2.898-6.988-2.898-5.443 0-9.87 4.427-9.872 9.869-.001 1.83.504 3.618 1.47 5.165l-1.069 3.907 4.008-1.052zm10.957-7.391c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.776.975-.951 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.488-.893-.797-1.495-1.782-1.67-2.083-.175-.3-.018-.462.13-.61.134-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.631-.926-2.235-.244-.589-.493-.51-.676-.519-.174-.008-.375-.01-.576-.01-.2 0-.525.075-.8.375-.275.3-1.051 1.026-1.051 2.503 0 1.478 1.075 2.903 1.225 3.103.15.2 2.117 3.232 5.128 4.534.715.311 1.275.497 1.711.635.717.227 1.369.195 1.885.117.576-.088 1.771-.726 2.021-1.426.25-.7.25-1.301.175-1.426-.075-.125-.275-.2-.575-.35z"/></svg>
                  <span className="text-[10px] font-bold text-white">WhatsApp</span>
                </button>
                <button onClick={() => setChannel('sms')} className="flex flex-col items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-all group">
                  <svg className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                  <span className="text-[10px] font-bold text-white">SMS Gateway</span>
                </button>
                <button onClick={() => setChannel('google')} className="flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                  <img src="https://www.google.com/favicon.ico" className="w-8 h-8 group-hover:scale-110 transition-transform" alt="Google" />
                  <span className="text-[10px] font-bold text-white">Google Prompt</span>
                </button>
                <button onClick={() => setChannel('facebook')} className="flex flex-col items-center gap-3 p-4 bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-2xl hover:bg-[#1877F2]/20 transition-all group">
                  <svg className="w-8 h-8 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span className="text-[10px] font-bold text-white">FB Messenger</span>
                </button>
              </div>
              <Button onClick={startDispatch} disabled={!channel} className="w-full py-4 accent-gradient">Confirmar e Enviar</Button>
            </div>
          )}

          {(stage === 'dispatch' || stage === 'verifying') && (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4"></div>
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Nexus Protocol v2.5</h3>
              </div>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    step.status === 'complete' ? 'bg-green-500/10 border-green-500/20' : 
                    step.status === 'processing' ? 'bg-indigo-500/10 border-indigo-500/30' : 
                    'bg-white/5 border-transparent opacity-40'
                  }`}>
                    <div className="w-4 h-4 flex items-center justify-center">
                      {step.status === 'complete' ? <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> : <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${step.status === 'complete' ? 'text-green-400' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === 'code' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Código Enviado</h3>
                <p className="text-[10px] text-gray-500 uppercase">Enviado para seu {channel}</p>
              </div>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center rounded-lg uppercase">{error}</div>}
              <input 
                type="text" maxLength={6} required placeholder="000000"
                className="w-full bg-black/60 border-2 border-indigo-500/30 rounded-2xl px-4 py-6 text-center text-4xl text-white focus:border-indigo-500 outline-none tracking-[0.5em] font-mono shadow-2xl"
                value={verificationCode} onChange={e => setVerificationCode(e.target.value)}
              />
              <Button onClick={handleVerify} className="w-full py-4 accent-gradient">Verificar Acesso</Button>
              <button onClick={() => setStage('channel')} className="w-full text-[10px] text-gray-600 font-bold uppercase tracking-widest hover:text-white transition-colors">Trocar Canal de Envio</button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center relative z-10">
            <p className="text-gray-600 text-[8px] uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
              Criptografia de Sinal Nexus v2.5 Ativa
              <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
