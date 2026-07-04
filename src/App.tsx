import React, { useState } from 'react';
import { useClimaFrioStore } from './services/store';
import mascotImg from './assets/images/clima_frio_mascot_1783168097277.jpg';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import ClientesScreen from './screens/clientes/ClientesScreen';
import EquipamentosScreen from './screens/equipamentos/EquipamentosScreen';
import AgendaScreen from './screens/agenda/AgendaScreen';
import OrdensServicoTab from './screens/ordem_servico/OrdemServicoScreen';
import FinanceiroTab from './screens/financeiro/FinanceiroScreen';
import ConfiguracoesTab from './screens/configuracoes/ConfiguracoesScreen';
import RelatoriosTab from './screens/relatorios/RelatoriosScreen';
import LoginScreen from './screens/login/LoginScreen';
import {
  Users,
  HardDrive,
  Calendar,
  FileText,
  TrendingUp,
  ThermometerSnowflake,
  Activity,
  Menu,
  X,
  FileCode,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Sparkles,
  LayoutDashboard,
  Sliders,
  LogOut,
  UserCheck,
  Calculator
} from 'lucide-react';

export default function App() {
  // Current logged operator session
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'admin' | 'tecnico' | 'gerente' } | null>(() => {
    try {
      const saved = localStorage.getItem('cf_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clientes' | 'equipamentos' | 'agenda' | 'ordens' | 'orcamentos' | 'relatorios' | 'financeiro' | 'configuracoes'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load persistence store
  const store = useClimaFrioStore();

  const handleLogin = (user: { name: string; role: 'admin' | 'tecnico' | 'gerente' }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('cf_current_user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sessão técnica de campo atual?')) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('cf_current_user');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen setActiveTab={setActiveTab} store={store} />;
      case 'clientes':
        return (
          <ClientesScreen
            clientes={store.clientes}
            equipamentos={store.equipamentos}
            addCliente={store.addCliente}
            updateCliente={store.updateCliente}
            deleteCliente={store.deleteCliente}
          />
        );
      case 'equipamentos':
        return (
          <EquipamentosScreen
            equipamentos={store.equipamentos}
            clientes={store.clientes}
            addEquipamento={store.addEquipamento}
            updateEquipamento={store.updateEquipamento}
            deleteEquipamento={store.deleteEquipamento}
            addCliente={store.addCliente}
          />
        );
      case 'agenda':
        return (
          <AgendaScreen
            agendamentos={store.agendamentos}
            clientes={store.clientes}
            equipamentos={store.equipamentos}
            addAgendamento={store.addAgendamento}
            updateAgendamento={store.updateAgendamento}
            deleteAgendamento={store.deleteAgendamento}
          />
        );
      case 'ordens':
        return (
          <OrdensServicoTab
            mode="ordens"
            ordensServico={store.ordensServico}
            clientes={store.clientes}
            equipamentos={store.equipamentos}
            addOrdemServico={store.addOrdemServico}
            updateOrdemServico={store.updateOrdemServico}
            deleteOrdemServico={store.deleteOrdemServico}
            addCliente={store.addCliente}
            addEquipamento={store.addEquipamento}
          />
        );
      case 'orcamentos':
        return (
          <OrdensServicoTab
            mode="orcamentos"
            ordensServico={store.ordensServico}
            clientes={store.clientes}
            equipamentos={store.equipamentos}
            addOrdemServico={store.addOrdemServico}
            updateOrdemServico={store.updateOrdemServico}
            deleteOrdemServico={store.deleteOrdemServico}
            addCliente={store.addCliente}
            addEquipamento={store.addEquipamento}
          />
        );
      case 'relatorios':
        return (
          <RelatoriosTab
            clientes={store.clientes}
            equipamentos={store.equipamentos}
            ordensServico={store.ordensServico}
            transacoes={store.transacoes}
          />
        );
      case 'financeiro':
        return (
          <FinanceiroTab
            transacoes={store.transacoes}
            addTransacao={store.addTransacao}
            deleteTransacao={store.deleteTransacao}
            resetToFactoryDefault={store.resetToFactoryDefault}
          />
        );
      case 'configuracoes':
        return <ConfiguracoesTab resetToFactoryDefault={store.resetToFactoryDefault} />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, desc: 'Métricas e Visão Geral' },
    { id: 'clientes', label: 'Clientes', icon: Users, desc: 'Fichas, contatos e locais' },
    { id: 'agenda', label: 'Agenda', icon: Calendar, desc: 'Escala técnica em campo' },
    { id: 'equipamentos', label: 'Equipamentos', icon: HardDrive, desc: 'Aparelhos sob contrato' },
    { id: 'ordens', label: 'Ordem de Serviço', icon: FileText, desc: 'Laudos e atendimentos' },
    { id: 'orcamentos', label: 'Orçamentos', icon: Calculator, desc: 'Propostas e estimativas' },
    { id: 'financeiro', label: 'Financeiro', icon: TrendingUp, desc: 'Caixa e faturamentos' },
    { id: 'relatorios', label: 'Relatórios & PMOC', icon: ShieldCheck, desc: 'Conformidade e Métricas' },
    { id: 'configuracoes', label: 'Configurações', icon: Sliders, desc: 'Branding e Custos' }
  ] as const;

  // Live status indicators
  const pendingOrdersCount = store.ordensServico.filter(o => o.status === 'em_andamento' || o.status === 'aprovado').length;
  const todaysTasksCount = store.agendamentos.filter(a => a.data === new Date().toISOString().split('T')[0] && a.status !== 'cancelado').length;

  return (
    <div className="min-h-screen bg-frost-55 flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* Mobile top navigation rail */}
      <header className="no-print md:hidden bg-frost-900 text-white px-4 py-3 flex justify-between items-center border-b border-frost-700 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <img 
            src={mascotImg} 
            alt="Mascote" 
            className="w-8 h-8 rounded-full object-cover border border-frost-700 bg-white p-0.5"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-display font-black tracking-tight text-base leading-tight">CLIMA FRIO</h1>
            <span className="text-[9px] uppercase tracking-wider text-frost-300 font-semibold block leading-none">Sistemas de Climatização</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[10px] font-bold text-white leading-none">{currentUser.name}</span>
            <span className="text-[8px] text-frost-300 capitalize font-medium">{currentUser.role === 'admin' ? 'Responsável Técnico' : currentUser.role}</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-frost-800 rounded transition-colors text-white"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Sidebar - Desktop and overlay for Mobile */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-coal-950 via-coal-900 to-frost-950 text-slate-100 flex flex-col justify-between transform transition-transform duration-300 border-r border-slate-800/50 md:translate-x-0 md:relative md:flex shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col overflow-y-auto shrink-0 flex-1 px-5 py-5">
          
          {/* Brand/Identity block */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/60">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-frost-500/20 rounded-full blur-sm" />
              <img 
                src={mascotImg} 
                alt="Mascote Clima Frio" 
                className="relative w-12 h-12 rounded-full object-cover border-2 border-slate-700 bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-display font-black text-xl tracking-tight text-white leading-tight">CLIMA FRIO</h1>
              <span className="text-[10px] uppercase tracking-wider text-frost-400 font-bold block leading-none">Gestão de Refrigeração</span>
            </div>
          </div>

          {/* Active Logged Operator Profile Card */}
          <div className="bg-slate-800/65 border border-slate-700/40 rounded-xl p-3 mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-frost-500/25 border border-frost-500/40 flex items-center justify-center font-bold text-frost-300 text-xs shadow-inner">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-150 leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-frost-400 capitalize block leading-none mt-0.5 font-semibold">
                  {currentUser.role === 'admin' ? 'Eng. Supervisor' : currentUser.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded-lg transition-all cursor-pointer"
              title="Encerrar Sessão Técnica"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ambient Business Status Card */}
          <div className="bg-slate-800/30 border border-slate-800/70 rounded-xl p-3.5 mb-5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-[10px] tracking-wide uppercase text-slate-400">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                Painel do Campo
              </span>
              <span className="text-[9px] font-mono text-slate-500">Lei 13589</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-950/45 border border-slate-800/40 rounded-lg p-1.5">
                <span className="block text-xs font-bold font-mono text-frost-400">{todaysTasksCount}</span>
                <span className="text-[9px] text-slate-400">Visitas Hoje</span>
              </div>
              <div className="bg-slate-950/45 border border-slate-800/40 rounded-lg p-1.5">
                <span className="block text-xs font-bold font-mono text-amber-400">{pendingOrdersCount}</span>
                <span className="text-[9px] text-slate-400">OS Ativas</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-frost-600 text-white font-semibold shadow-md shadow-frost-600/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-frost-400'
                  }`} />
                  <div>
                    <span className="block text-xs uppercase tracking-wider leading-none font-bold">{item.label}</span>
                    <span className="text-[9px] text-slate-500 block group-hover:text-slate-400 mt-0.5 leading-none font-normal">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Technical Footer concept */}
        <div className="no-print p-4 border-t border-slate-800/60 bg-slate-950/30 text-[9px] text-slate-500 flex flex-col gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-frost-500" />
            <span>Portaria ANVISA 3.523/98</span>
          </div>
          <p className="opacity-60">© 2026 Clima Frio Ltda.</p>
        </div>
      </aside>

      {/* Main Content Workspace viewport */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        
        {/* Dynamic header / breadcrumb style */}
        <div className="no-print hidden md:flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold text-frost-600 uppercase tracking-widest font-mono">Espaço de Trabalho</span>
            <h2 className="text-xl font-display font-bold text-gray-900">
              {activeTab === 'dashboard' && 'Painel de Controle'}
              {activeTab === 'clientes' && 'Gestão de Clientes'}
              {activeTab === 'equipamentos' && 'Equipamentos e Máquinas'}
              {activeTab === 'agenda' && 'Grade Técnico-Operacional'}
              {activeTab === 'ordens' && 'Ordens de Serviço'}
              {activeTab === 'relatorios' && 'Relatórios e Conformidade PMOC'}
              {activeTab === 'financeiro' && 'Faturamentos e Custos'}
              {activeTab === 'configuracoes' && 'Configurações Globais'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-semibold text-gray-500 bg-white px-3.5 py-1.5 border border-gray-100 rounded-lg shadow-2xs">
            <span className="flex items-center gap-1.5 text-frost-600">
              <span className="w-2 h-2 rounded-full bg-frost-500 animate-pulse" />
              Técnico: {currentUser.name}
            </span>
            <span className="text-gray-300">|</span>
            <span>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Tab content injection */}
        <div className="max-w-7xl mx-auto">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}
