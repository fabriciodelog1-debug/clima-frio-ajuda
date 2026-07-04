import React, { useState } from 'react';
import { Cliente, Equipamento, OrdemServico, TransacaoFinanceira } from '../../models/types';
import { 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  Layers, 
  AlertTriangle, 
  CheckSquare, 
  User, 
  Search,
  Check,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';

interface RelatoriosTabProps {
  clientes: Cliente[];
  equipamentos: Equipamento[];
  ordensServico: OrdemServico[];
  transacoes: TransacaoFinanceira[];
}

export default function RelatoriosTab({
  clientes,
  equipamentos,
  ordensServico,
  transacoes
}: RelatoriosTabProps) {
  // PMOC Custom Generator State
  const [selectedClienteId, setSelectedClienteId] = useState(clientes[0]?.id || '');
  const [pmocMonth, setPmocMonth] = useState('Julho - 2026');
  const [activeTab, setActiveTab] = useState<'kpis' | 'pmoc'>('kpis');

  // Interactive Checklist for PMOC
  const [checklist, setChecklist] = useState({
    limpezaFiltros: true,
    evaporadorHigienizado: true,
    reapertoEletrico: true,
    pressaoGas: true,
    ventiladoresGiro: true,
    isolamentoTubos: false,
    correnteMedida: true
  });

  const [responsavelTecnico, setResponsavelTecnico] = useState('Eng. Bruno Guimarães (CREA-SP 5070293144)');
  const [showPrintPmoc, setShowPrintPmoc] = useState<boolean>(false);

  // Financial statistics
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // OS by Status Count
  const statusCount = ordensServico.reduce((acc, os) => {
    acc[os.status] = (acc[os.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Equipment by Brand Count
  const brandCount = equipamentos.reduce((acc, eq) => {
    acc[eq.marca] = (acc[eq.marca] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Category Expense breakdown
  const despesaCategorias = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'orcamento': return 'Orçamento';
      case 'aprovado': return 'Aprovado';
      case 'em_andamento': return 'Em Execução';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return s;
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'orcamento': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'aprovado': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'em_andamento': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'concluido': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelado': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCheckboxChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedClienteObj = clientes.find(c => c.id === selectedClienteId);
  const selectedClienteEquips = equipamentos.filter(e => e.clienteId === selectedClienteId);

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm border border-slate-200 no-print">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'kpis'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Métricas de Campo
        </button>
        <button
          onClick={() => setActiveTab('pmoc')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'pmoc'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Emissão PMOC
        </button>
      </div>

      {activeTab === 'kpis' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Faturamento Técnico</span>
                <span className="text-xl font-mono font-bold text-gray-900">
                  {totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Clientes Regulados</span>
                <span className="text-xl font-mono font-bold text-gray-900">{clientes.length}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Máquinas Contratadas</span>
                <span className="text-xl font-mono font-bold text-gray-900">{equipamentos.length}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total de OS Emitidas</span>
                <span className="text-xl font-mono font-bold text-gray-900">{ordensServico.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Status OS Card list */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-frost-500" />
                Status Geral das Ordens de Serviço
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['orcamento', 'aprovado', 'em_andamento', 'concluido'].map(st => {
                  const qty = statusCount[st] || 0;
                  const pct = ordensServico.length ? Math.round((qty / ordensServico.length) * 100) : 0;
                  return (
                    <div key={st} className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">{getStatusLabel(st)}</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-mono font-black text-gray-900">{qty}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            st === 'concluido' ? 'bg-emerald-500' :
                            st === 'em_andamento' ? 'bg-indigo-500' :
                            st === 'aprovado' ? 'bg-sky-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Brands and Capacities card list */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-frost-500" />
                Marcas sob Manutenção Preventiva
              </h3>
              <div className="space-y-3">
                {Object.entries(brandCount).map(([brand, count]) => {
                  const pct = equipamentos.length ? Math.round((count / equipamentos.length) * 100) : 0;
                  return (
                    <div key={brand} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">{brand}</span>
                        <span className="font-mono text-gray-500">{count} {count === 1 ? 'aparelho' : 'aparelhos'} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-frost-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {Object.keys(brandCount).length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-6">Nenhum equipamento cadastrado para gerar estatísticas.</p>
                )}
              </div>
            </div>

            {/* Financial Expenses by Category Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Distribuição de Custos Operacionais e Insumos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Despesas Totais</span>
                    <span className="text-2xl font-mono font-bold text-rose-600 mt-1 block">
                      {totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">Referente a custos de combustível, ferramentas, impostos e estoque de reposição.</p>
                </div>

                <div className="md:col-span-2 space-y-3">
                  {Object.entries(despesaCategorias).map(([cat, val]) => {
                    const pct = totalDespesas ? Math.round((val / totalDespesas) * 100) : 0;
                    return (
                      <div key={cat} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                        <div>
                          <span className="font-bold text-gray-800 capitalize">{cat.replace('_', ' ')}</span>
                          <span className="text-[10px] text-gray-400 block font-mono">Partilha de despesa</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-gray-900">{val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          <span className="text-[10px] text-slate-400 block">{pct}% do total</span>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(despesaCategorias).length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-8">Nenhuma despesa registrada no período fiscal corrente.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PMOC EMISSION TAB */}
      {activeTab === 'pmoc' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in no-print">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-frost-600" />
              Emissor Digital de PMOC (Laudo Mensal de Conformidade)
            </h3>
            <p className="text-xs text-gray-500">
              Gere termos de manutenção segundo a Lei Federal 13.589/2018 (PMOC) para controle e apresentação à Vigilância Sanitária (ANVISA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PMOC Form Controls */}
            <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Cliente Regulado</label>
                <select
                  value={selectedClienteId}
                  onChange={(e) => setSelectedClienteId(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-frost-500 bg-white"
                >
                  {clientes.map(cli => (
                    <option key={cli.id} value={cli.id}>{cli.nome}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Mês de Competência</label>
                <select
                  value={pmocMonth}
                  onChange={(e) => setPmocMonth(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-frost-500 bg-white"
                >
                  <option value="Janeiro - 2026">Janeiro - 2026</option>
                  <option value="Fevereiro - 2026">Fevereiro - 2026</option>
                  <option value="Março - 2026">Março - 2026</option>
                  <option value="Abril - 2026">Abril - 2026</option>
                  <option value="Maio - 2026">Maio - 2026</option>
                  <option value="Junho - 2026">Junho - 2026</option>
                  <option value="Julho - 2026">Julho - 2026</option>
                  <option value="Agosto - 2026">Agosto - 2026</option>
                  <option value="Setembro - 2026">Setembro - 2026</option>
                  <option value="Outubro - 2026">Outubro - 2026</option>
                  <option value="Novembro - 2026">Novembro - 2026</option>
                  <option value="Dezembro - 2026">Dezembro - 2026</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Responsável de Engenharia</label>
                <input
                  type="text"
                  value={responsavelTecnico}
                  onChange={(e) => setResponsavelTecnico(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-frost-500 bg-white"
                />
              </div>

              {/* Action trigger button */}
              <button
                type="button"
                onClick={() => setShowPrintPmoc(true)}
                className="w-full py-2.5 bg-frost-600 hover:bg-frost-500 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Visualizar PMOC
              </button>
            </div>

            {/* Checklists and active items list for month */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                Rotinas de Manutenção Efetuadas
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.limpezaFiltros}
                    onChange={() => handleCheckboxChange('limpezaFiltros')}
                    className="mt-0.5 rounded text-frost-600 focus:ring-frost-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Limpeza dos filtros de ar</span>
                    <p className="text-[10px] text-gray-500">Remoção de sujidades mecânicas nas evaporadoras.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.evaporadorHigienizado}
                    onChange={() => handleCheckboxChange('evaporadorHigienizado')}
                    className="mt-0.5 rounded text-frost-600 focus:ring-frost-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Higienização química spray</span>
                    <p className="text-[10px] text-gray-500">Higienização química bactericida da serpentina.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.reapertoEletrico}
                    onChange={() => handleCheckboxChange('reapertoEletrico')}
                    className="mt-0.5 rounded text-frost-600 focus:ring-frost-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Reaperto elétrico de bornes</span>
                    <p className="text-[10px] text-gray-500">Prevenção contra aquecimento de cabos de força.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.pressaoGas}
                    onChange={() => handleCheckboxChange('pressaoGas')}
                    className="mt-0.5 rounded text-frost-600 focus:ring-frost-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Medição da pressão de gás (PSI)</span>
                    <p className="text-[10px] text-gray-500">Verificação de vazamentos nas linhas frigoríficas.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.ventiladoresGiro}
                    onChange={() => handleCheckboxChange('ventiladoresGiro')}
                    className="mt-0.5 rounded text-frost-600 focus:ring-frost-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Giro livre de hélices</span>
                    <p className="text-[10px] text-gray-500">Identificação de vibrações anômalas ou desgastes.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.isolamentoTubos}
                    onChange={() => handleCheckboxChange('isolamentoTubos')}
                    className="mt-0.5 rounded text-frost-600 focus:ring-frost-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Integridade dos isolamentos</span>
                    <p className="text-[10px] text-gray-500">Evita perda de eficiência térmica e pingos.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.correnteMedida}
                    onChange={() => handleCheckboxChange('correnteMedida')}
                    className="mt-0.5 rounded text-frost-600 focus:ring-frost-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">Aferição de corrente do compressor</span>
                    <p className="text-[10px] text-gray-500">Comparação com o limite nominal do fabricante.</p>
                  </div>
                </label>
              </div>

              <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  <strong>Aviso legal:</strong> O PMOC é obrigatório por lei para estabelecimentos de uso público ou coletivo com carga instalada superior a 60.000 BTU/h. Garante ar livre de impurezas nocivas à saúde respiratória dos ocupantes.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL PRINT PREVIEW OVERLAY */}
      {showPrintPmoc && selectedClienteObj && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in no-print">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-slide-up flex flex-col h-[90vh]">
            <div className="bg-frost-900 text-white p-4 flex justify-between items-center shrink-0">
              <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-frost-200" />
                Previsão de Impressão de Laudo PMOC
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-frost-500 hover:bg-frost-600 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir (PDF)
                </button>
                <button
                  onClick={() => setShowPrintPmoc(false)}
                  className="p-1 hover:bg-frost-800 rounded-full transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PMOC DOCUMENT PRINTABLE BLOCK */}
            <div className="p-8 space-y-6 overflow-y-auto bg-white text-gray-900 text-sm print-view font-sans">
              
              <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4">
                <div>
                  <h1 className="text-3xl font-display font-black tracking-tight text-frost-900">CLIMA FRIO</h1>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Gestão Técnica de Ar Condicionado</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">LAUDO CONFORME PORTARIA MS N° 3.523/98 & LEI N° 13.589/18</p>
                </div>
                <div className="text-right border-r-4 border-frost-500 pr-4">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Mês de Referência</span>
                  <h2 className="text-lg font-bold font-mono text-gray-900 uppercase">{pmocMonth}</h2>
                  <span className="text-xs text-emerald-600 font-bold">Certificado de Regularidade Técnico</span>
                </div>
              </div>

              {/* Contratante Info */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 border border-slate-100 rounded-lg">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dados do Estabelecimento</span>
                  <p className="font-bold text-gray-950 text-base">{selectedClienteObj.nome}</p>
                  <p className="text-xs text-gray-700"><strong>Documento/CNPJ:</strong> {selectedClienteObj.documento}</p>
                  <p className="text-xs text-gray-700"><strong>Endereço:</strong> {selectedClienteObj.endereco}, {selectedClienteObj.cidade}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enquadramento Sanitário</span>
                  <p className="text-xs text-gray-700"><strong>Atendimento:</strong> Ar Condicionado Climatizado por Fluxo Forçado</p>
                  <p className="text-xs text-gray-700"><strong>Máquinas Ativas:</strong> {selectedClienteEquips.length} unidades sob vigilância</p>
                  <p className="text-xs text-gray-700"><strong>Responsabilidade Legal:</strong> Portaria 3.523 ANVISA</p>
                </div>
              </div>

              {/* Equips list */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-200 pb-1">Unidades Climatizadoras Inspecionadas</span>
                {selectedClienteEquips.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nenhum equipamento cadastrado para este cliente.</p>
                ) : (
                  <table className="min-w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gray-300 font-bold text-gray-700">
                        <th className="py-2">Localização/Sala</th>
                        <th className="py-2">Tipo / Marca</th>
                        <th className="py-2">Capacidade</th>
                        <th className="py-2">N° Série</th>
                        <th className="py-2 text-right">Manut. Legal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedClienteEquips.map((eq, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-semibold text-gray-800">{eq.localizacao || 'Recepção / Geral'}</td>
                          <td className="py-2">{eq.tipo} ({eq.marca})</td>
                          <td className="py-2">{eq.capacidade}</td>
                          <td className="py-2 font-mono text-gray-500">{eq.numeroSerie}</td>
                          <td className="py-2 text-right text-emerald-600 font-bold">✓ Conforme</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Routines checklist summary */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-200 pb-1">Checklist de Conformidade Física Executada</span>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${checklist.limpezaFiltros ? 'bg-emerald-500' : 'bg-gray-300'}`}>✓</span>
                      <span className={`${checklist.limpezaFiltros ? 'text-gray-900 font-semibold' : 'text-gray-400 line-through'}`}>Limpeza e Higienização de Filtros</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${checklist.evaporadorHigienizado ? 'bg-emerald-500' : 'bg-gray-300'}`}>✓</span>
                      <span className={`${checklist.evaporadorHigienizado ? 'text-gray-900 font-semibold' : 'text-gray-400 line-through'}`}>Aplicação de Bactericida em Serpentinas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${checklist.reapertoEletrico ? 'bg-emerald-500' : 'bg-gray-300'}`}>✓</span>
                      <span className={`${checklist.reapertoEletrico ? 'text-gray-900 font-semibold' : 'text-gray-400 line-through'}`}>Reapertos de Fiações Elétricas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${checklist.pressaoGas ? 'bg-emerald-500' : 'bg-gray-300'}`}>✓</span>
                      <span className={`${checklist.pressaoGas ? 'text-gray-900 font-semibold' : 'text-gray-400 line-through'}`}>Controle de Pressão de Fluido Frigorígeno</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${checklist.ventiladoresGiro ? 'bg-emerald-500' : 'bg-gray-300'}`}>✓</span>
                      <span className={`${checklist.ventiladoresGiro ? 'text-gray-900 font-semibold' : 'text-gray-400 line-through'}`}>Avaliação de Motores Ventiladores</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${checklist.isolamentoTubos ? 'bg-emerald-500' : 'bg-gray-300'}`}>✓</span>
                      <span className={`${checklist.isolamentoTubos ? 'text-gray-900 font-semibold' : 'text-gray-400 line-through'}`}>Verificação de Isolamento Térmico Blindado</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${checklist.correnteMedida ? 'bg-emerald-500' : 'bg-gray-300'}`}>✓</span>
                      <span className={`${checklist.correnteMedida ? 'text-gray-900 font-semibold' : 'text-gray-400 line-through'}`}>Aferição do Compressor por Alicate Amperímetro</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical responsibility signature block */}
              <div className="pt-16 border-t border-dashed border-gray-300 grid grid-cols-2 gap-12 text-center text-xs text-gray-500">
                <div className="space-y-1.5">
                  <div className="border-b border-gray-400 w-4/5 mx-auto h-4" />
                  <p className="font-bold text-gray-800">{responsavelTecnico}</p>
                  <p>Responsável Técnico Credenciado</p>
                </div>

                <div className="space-y-1.5">
                  <div className="border-b border-gray-400 w-4/5 mx-auto h-4" />
                  <p className="font-bold text-gray-800">Assinatura do Responsável do Local</p>
                  <p>{selectedClienteObj.nome}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple close button helper
const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
