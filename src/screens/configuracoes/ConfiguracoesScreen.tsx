import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, Check, Save, HardDrive, Smartphone, MessageSquare, Info, Sliders, Mail, MapPin } from 'lucide-react';

interface ConfiguracoesTabProps {
  resetToFactoryDefault: () => void;
}

export interface CompanySettings {
  nomeEmpresa: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  creaNumero: string;
  valorHoraTecnico: number;
}

const DEFAULT_SETTINGS: CompanySettings = {
  nomeEmpresa: 'CLIMA FRIO',
  cnpj: '14.590.231/0001-90',
  telefone: '(11) 98888-7777',
  email: 'climafriorp@atendimento.com.br',
  endereco: 'Rua das Climatizações, 420 - Centro',
  cidade: 'São Paulo - SP',
  creaNumero: 'CREA-SP 5070293144',
  valorHoraTecnico: 120
};

export default function ConfiguracoesTab({ resetToFactoryDefault }: ConfiguracoesTabProps) {
  const [settings, setSettings] = useState<CompanySettings>(() => {
    try {
      const stored = localStorage.getItem('cf_company_settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof CompanySettings, val: string | number) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('cf_company_settings', JSON.stringify(settings));
      setSaved(true);
      
      // Emit event to update components dynamically
      window.dispatchEvent(new Event('cf_settings_updated'));
      
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Falha ao salvar configurações.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Title */}
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-frost-500" />
          Configurações do Sistema
        </h2>
        <p className="text-sm text-gray-500">
          Personalize as informações da sua empresa de refrigeração que aparecem nos laudos, recibos, orçamentos e fichas de impressão.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Form Column */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            <h3 className="font-display font-semibold text-gray-950 text-base border-b border-gray-100 pb-2">Informações Operacionais</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome da Empresa */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Razão Social / Nome de Exibição</label>
                <input
                  type="text"
                  required
                  value={settings.nomeEmpresa}
                  onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-frost-500"
                />
              </div>

              {/* CNPJ */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">CNPJ da Empresa</label>
                <input
                  type="text"
                  required
                  value={settings.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-frost-500 font-mono"
                />
              </div>

              {/* Telefone WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Telefone WhatsApp (Contato OS)</label>
                <input
                  type="text"
                  required
                  value={settings.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-frost-500 font-mono"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">E-mail Comercial</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-frost-500"
                />
              </div>

              {/* CREA */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Registro CREA do Responsável Técnico</label>
                <input
                  type="text"
                  required
                  value={settings.creaNumero}
                  onChange={(e) => handleChange('creaNumero', e.target.value)}
                  placeholder="CREA-SP 0000000000"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-frost-500 font-mono"
                />
              </div>

              {/* Valor Hora Mão de Obra */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Valor de Referência Mão de Obra (R$ / h)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={settings.valorHoraTecnico}
                  onChange={(e) => handleChange('valorHoraTecnico', parseFloat(e.target.value) || 0)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-frost-500 font-mono"
                />
              </div>
            </div>

            {/* Endereço completo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Endereço da Sede Operacional</label>
              <input
                type="text"
                required
                value={settings.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            {/* Cidade / UF */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Cidade e Estado (UF)</label>
              <input
                type="text"
                required
                value={settings.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {saved ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold animate-fade-in">
                  <Check className="w-4 h-4" />
                  Configurações Salvas com Sucesso!
                </span>
              ) : (
                <span className="text-xs text-gray-400">Campos marcados alteram o cabeçalho dos relatórios e PDFs.</span>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-frost-600 hover:bg-frost-700 text-white font-medium rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box & Maintenance actions */}
        <div className="space-y-6">
          
          {/* Homologation Status card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm flex items-center gap-1.5 text-frost-300">
              <ShieldCheck className="w-4 h-4 text-frost-400" />
              Selo CREA Homologado
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Os relatórios e laudos gerados por este ERP estão estruturados de acordo com as normas vigentes do CONFEA/CREA para a manutenção corretiva de sistemas térmicos de expansão direta e indireta.
            </p>
            <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-800 text-[10px] text-slate-400 font-mono">
              <span className="block text-slate-200 font-bold mb-0.5">Assinatura Digital Técnica</span>
              {settings.creaNumero || 'Não configurado'}
            </div>
          </div>

          {/* Backup or system reset block */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs uppercase">
              <Info className="w-4 h-4" />
              Zona de Risco Operacional
            </div>
            <p className="text-[11px] text-red-800 leading-relaxed">
              Se você quiser limpar todas as alterações, ordens de serviço, clientes cadastrados e faturamentos para recomeçar do zero com os dados de fábrica padrão da Clima Frio, use a opção abaixo.
            </p>
            <button
              type="button"
              onClick={resetToFactoryDefault}
              className="inline-flex items-center gap-1 px-3 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resetar Banco de Dados
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
