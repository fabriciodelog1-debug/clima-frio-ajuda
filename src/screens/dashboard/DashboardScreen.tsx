import React, { useState } from 'react';
import { useClimaFrioStore } from '../../services/store';
import {
  Users,
  HardDrive,
  Calendar,
  FileText,
  TrendingUp,
  ThermometerSnowflake,
  Activity,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface DashboardTabProps {
  setActiveTab: (tab: 'dashboard' | 'clientes' | 'equipamentos' | 'agenda' | 'ordens' | 'orcamentos' | 'relatorios' | 'financeiro' | 'configuracoes') => void;
  store: ReturnType<typeof useClimaFrioStore>;
}

export default function DashboardScreen({ setActiveTab, store }: DashboardTabProps) {
  const { clientes, equipamentos, agendamentos, ordensServico, transacoes } = store;

  // Stats calculate
  const totalClientes = clientes.length;
  const totalEquipamentos = equipamentos.length;
  const activeOS = ordensServico.filter(o => o.status === 'em_andamento' || o.status === 'aprovado' || o.status === 'orcamento').length;
  
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((sum, item) => sum + item.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, item) => sum + item.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // Active technicians preset
  const ACTIVE_TECS = ['Felipe Santos', 'Rodrigo Lima'];

  // Current date formatting
  const todayDateStr = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Filter today agendamentos
  const todayAgendamentos = agendamentos
    .filter(ag => ag.data === todayDateStr)
    .map(ag => {
      return {
        id: ag.id,
        hora: ag.horaInicio,
        clienteId: ag.clienteId,
        tipoServico: ag.tipoServico,
        tecnico: ag.tecnico,
        status: ag.status
      };
    })
    .sort((a, b) => a.hora.localeCompare(b.hora));

  // Filter recent OS
  const recentOS = [...ordensServico]
    .sort((a, b) => b.dataAbertura.localeCompare(a.dataAbertura))
    .slice(0, 4);

  // Equipment brand stats count
  const brandCounts: { [key: string]: number } = {};
  equipamentos.forEach(eq => {
    const brand = eq.marca.trim().toLowerCase();
    if (brand) {
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    }
  });

  const brandStats = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-frost-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-frost-500/20 text-frost-300 text-xs font-semibold rounded-full border border-frost-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Sistema Clima Frio Ativo
            </span>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">
              Olá, <span className="text-frost-300">Operador</span>
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-xl">
              Bem-vindo ao centro de operações Clima Frio. Acompanhe a escala da sua equipe de campo em tempo real.
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shrink-0 text-center md:text-right">
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Escala Geral</span>
            <span className="text-lg font-bold text-white block mt-0.5">{formattedToday}</span>
            <div className="flex gap-2.5 items-center justify-center md:justify-end mt-1.5 text-[10px] text-emerald-400 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {ACTIVE_TECS.length} técnicos ativos hoje
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <span className="block text-[10px] font-bold text-frost-400 uppercase tracking-widest font-mono mb-3 font-semibold">Painel de Acesso Rápido — Hoje</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              onClick={() => setActiveTab('ordens')}
              className="w-full text-left bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between hover:bg-slate-950/80 hover:border-frost-500/50 transition-all cursor-pointer group"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none mb-1 group-hover:text-frost-300 transition-colors">Serviços</span>
                <span className="text-sm font-semibold text-frost-300 font-mono">5 Serviços</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-frost-500 animate-pulse" />
            </button>
            <button
              onClick={() => setActiveTab('orcamentos')}
              className="w-full text-left bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between hover:bg-slate-950/80 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none mb-1 group-hover:text-amber-300 transition-colors">Orçamentos</span>
                <span className="text-sm font-semibold text-amber-400 font-mono">2 Orçamentos</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className="w-full text-left bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between hover:bg-slate-950/80 hover:border-rose-500/50 transition-all cursor-pointer group"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none mb-1 group-hover:text-rose-350 transition-colors">Retornos</span>
                <span className="text-sm font-semibold text-rose-400 font-mono">1 Retorno</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Clientes */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Clientes Atendidos</span>
            <span className="text-3xl font-bold text-gray-900 block mt-1 font-mono">{totalClientes}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1">Fichas ativas no sistema</span>
          </div>
          <div className="p-3.5 bg-sky-50 rounded-xl text-sky-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Equipamentos Contrato */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Aparelhos Registrados</span>
            <span className="text-3xl font-bold text-gray-900 block mt-1 font-mono">{totalEquipamentos}</span>
            <span className="text-[10px] text-indigo-600 font-medium block mt-1">Condicionadores em PMOC</span>
          </div>
          <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>

        {/* OS Ativas */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">OS Pendentes / Ativas</span>
            <span className="text-3xl font-bold text-amber-600 block mt-1 font-mono">{activeOS}</span>
            <span className="text-[10px] text-amber-600 font-medium block mt-1">Serviços em andamento</span>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Resultado Líquido */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Resultado Caixa</span>
            <span className={`text-xl font-bold block mt-1 font-mono ${saldoLiquido >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {saldoLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-[10px] text-gray-500 font-medium block mt-1">Entradas deduzidas de custos</span>
          </div>
          <div className={`p-3.5 rounded-xl ${saldoLiquido >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid content splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Today's Agenda & Recent OS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Agenda de hoje */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-frost-600" />
                  Agenda Técnica de Campo (Hoje)
                </h3>
                <p className="text-[11px] text-gray-400">Atendimentos agendados e visitas operacionais na data de hoje.</p>
              </div>
              <button
                onClick={() => setActiveTab('agenda')}
                className="text-xs font-semibold text-frost-600 hover:text-frost-700 flex items-center gap-0.5 cursor-pointer"
              >
                Ver Agenda Completa
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {todayAgendamentos.length === 0 ? (
                <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-100">
                  <CheckCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-medium">Nenhum atendimento escalado para hoje.</p>
                  <p className="text-[10px] text-gray-400">Aproveite para realizar rotinas preventivas PMOC.</p>
                </div>
              ) : (
                todayAgendamentos.map((ag) => {
                  const client = clientes.find(c => c.id === ag.clienteId);
                  return (
                    <div
                      key={ag.id}
                      className="flex items-center justify-between p-3 border border-gray-50 hover:bg-gray-50/60 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-frost-50 rounded-lg text-frost-600 text-xs font-bold shrink-0">
                          {ag.hora}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{client?.nome || 'Cliente Desconhecido'}</h4>
                          <span className="text-[10px] text-gray-400 block capitalize">{ag.tipoServico.replace('_', ' ')} — Técnico: {ag.tecnico}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                        ag.status === 'concluido' ? 'bg-emerald-50 text-emerald-700' :
                        ag.status === 'agendado' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ag.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Últimas Ordens de Serviço */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-frost-600" />
                  Ordens de Serviço Recentes
                </h3>
                <p className="text-[11px] text-gray-400">Acompanhamento dos laudos e orçamentos emitidos.</p>
              </div>
              <button
                onClick={() => setActiveTab('ordens')}
                className="text-xs font-semibold text-frost-600 hover:text-frost-700 flex items-center gap-0.5 cursor-pointer"
              >
                Gerenciar OS
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {recentOS.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">Nenhuma Ordem de Serviço cadastrada.</p>
              ) : (
                recentOS.map((os) => {
                  const client = clientes.find(c => c.id === os.clienteId);
                  return (
                    <div key={os.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">{os.id}</span>
                          <span className={`text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                            os.status === 'concluido' ? 'bg-emerald-50 text-emerald-700' :
                            os.status === 'em_andamento' ? 'bg-blue-50 text-blue-700' :
                            os.status === 'orcamento' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {os.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">{client?.nome || 'Cliente não identificado'}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-gray-900 block">
                          {os.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">{os.dataAbertura}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Brand Breakdown & Technical Alert Tips */}
        <div className="space-y-6">
          
          {/* Brand market share */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-frost-600" />
              Marcas Sob Atendimento
            </h3>
            <p className="text-[11px] text-gray-400">Distribuição dos condicionadores de ar climatizados por fabricante.</p>
            
            <div className="space-y-3.5 pt-1">
              {brandStats.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Nenhum equipamento cadastrado ainda.</p>
              ) : (
                brandStats.map(([brand, count]) => {
                  const pct = totalEquipamentos > 0 ? (count / totalEquipamentos) * 100 : 0;
                  return (
                    <div key={brand} className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-gray-700 font-medium">
                        <span className="capitalize font-bold">{brand}</span>
                        <span className="text-gray-400 text-[11px] font-mono">{count} un ({Math.round(pct)}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Environmental AI Climate Tips */}
          <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 space-y-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-bold uppercase rounded-md">
              <Activity className="w-3 h-3" />
              Diagnóstico Ambiental
            </span>
            <h4 className="text-xs font-bold text-sky-950">Alerta de Alta Umidade Relativa</h4>
            <p className="text-[11px] text-sky-800 leading-relaxed">
              Alta umidade aumenta o índice de condensação de água nas bandejas de dreno de splits comerciais. Sugira limpeza preventiva química de dreno para evitar vazamentos em ambientes de escritórios nesta semana.
            </p>
            <div className="border-t border-sky-100/60 pt-2 flex justify-between items-center text-[10px] text-sky-700 font-medium">
              <span>Sugerir PMOC para clientes</span>
              <button
                onClick={() => setActiveTab('clientes')}
                className="hover:underline flex items-center gap-0.5 cursor-pointer font-bold text-sky-900"
              >
                Ver Fichas
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
