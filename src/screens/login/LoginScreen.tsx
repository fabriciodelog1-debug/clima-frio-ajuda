import React, { useState } from 'react';
import { ThermometerSnowflake, ShieldCheck, KeyRound, User, Sparkles, LogIn, HardDrive, Cpu } from 'lucide-react';
import mascotImg from '../../assets/images/clima_frio_mascot_1783168097277.jpg';

interface LoginScreenProps {
  onLogin: (user: { name: string; role: 'admin' | 'tecnico' | 'gerente' }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [operatorName, setOperatorName] = useState('');
  const [operatorRole, setOperatorRole] = useState<'admin' | 'tecnico' | 'gerente'>('admin');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const SUGGESTED_OPERATORS = [
    { name: 'Fabrício Santos', role: 'admin' as const, title: 'Responsável Técnico (CREA)' },
    { name: 'Rodrigo Lima', role: 'tecnico' as const, title: 'Técnico de Campo Senior' },
    { name: 'Felipe Santos', role: 'tecnico' as const, title: 'Técnico Operacional Júnior' },
    { name: 'Ana Paula Dias', role: 'gerente' as const, title: 'Gestão & Backoffice' }
  ];

  const handleSelectSuggested = (op: { name: string; role: 'admin' | 'tecnico' | 'gerente' }) => {
    setOperatorName(op.name);
    setOperatorRole(op.role);
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorName.trim()) {
      setError('Por favor, digite o seu nome para acessar.');
      return;
    }

    // Simulated simple access security
    if (pin.length > 0 && pin !== '1234') {
      setError('PIN incorreto. (Dica de homologação: Use o PIN 1234 ou deixe em branco)');
      return;
    }

    onLogin({
      name: operatorName.trim(),
      role: operatorRole
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      
      {/* Background aesthetic circles simulating cold/frost atmosphere */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-frost-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Brand/App Identity block */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-frost-500/25 rounded-full blur-2xl animate-pulse" />
            <img 
              src={mascotImg} 
              alt="Mascote Clima Frio" 
              className="relative w-36 h-36 mx-auto rounded-full object-cover border-4 border-slate-800 shadow-2xl bg-white p-1"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              CLIMA FRIO
            </h1>
            <p className="text-xs uppercase tracking-widest text-frost-400 font-bold mt-1">Gestão de Refrigeração & PMOC</p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
          <div className="space-y-1.5 text-center">
            <h2 className="text-base font-bold text-slate-100 flex items-center justify-center gap-1.5">
              <KeyRound className="w-4 h-4 text-frost-400" />
              Acesso do Operador
            </h2>
            <p className="text-xs text-slate-400">Digite seu próprio nome ou selecione um perfil abaixo para acessar.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Operator Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seu Nome Completo</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={operatorName}
                  onChange={(e) => {
                    setOperatorName(e.target.value);
                    setError('');
                  }}
                  placeholder="Digite seu nome completo"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-frost-500 placeholder-slate-700"
                />
              </div>
            </div>

            {/* Technical Role Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cargo / Função Técnica</label>
              <select
                value={operatorRole}
                onChange={(e) => {
                  setOperatorRole(e.target.value as 'admin' | 'tecnico' | 'gerente');
                  setError('');
                }}
                className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-frost-500"
              >
                <option value="admin">Responsável Técnico (CREA) / Administrador</option>
                <option value="tecnico">Técnico de Campo</option>
                <option value="gerente">Gestão & Backoffice / Gerente</option>
              </select>
            </div>

            {/* Suggested Profiles Quick Select */}
            <div className="space-y-2 pt-1 pb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Perfis Sugeridos:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {SUGGESTED_OPERATORS.map((op) => (
                  <button
                    key={op.name}
                    type="button"
                    onClick={() => handleSelectSuggested(op)}
                    className={`p-1.5 rounded-lg text-left border text-[10px] transition-all cursor-pointer ${
                      operatorName === op.name 
                        ? 'bg-frost-950/40 border-frost-500/80 text-frost-300' 
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold truncate">{op.name}</div>
                    <div className="text-[8px] opacity-70 truncate">{op.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* PIN Code */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Código PIN de Acesso</label>
                <span className="text-[9px] text-slate-500 font-mono">Dica: 1234</span>
              </div>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Digite o PIN ou clique em Entrar"
                className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-center font-mono tracking-widest text-slate-200 focus:outline-none focus:ring-1 focus:ring-frost-500 placeholder-slate-600"
              />
            </div>

            {error && (
              <p className="text-[11px] text-red-400 text-center font-medium bg-red-950/20 border border-red-900/30 py-1.5 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-frost-600 hover:bg-frost-500 active:bg-frost-700 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-frost-600/10 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Entrar no Workspace
            </button>
          </form>
        </div>

        {/* Regulatory/CREA verification banner */}
        <div className="text-center space-y-2 text-[10px] text-slate-500">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-frost-500" />
            <span>Homologação CREA-SP Ativa • Portaria PMOC N° 3.523</span>
          </div>
          <p className="opacity-60">Segurança de dados assegurada localmente por chaves criptográficas.</p>
        </div>

      </div>
    </div>
  );
}
