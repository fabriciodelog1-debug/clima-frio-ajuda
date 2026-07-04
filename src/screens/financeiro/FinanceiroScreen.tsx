import React, { useState } from 'react';
import { TransacaoFinanceira } from '../../models/types';
import { TrendingUp, Plus, Search, Trash2, Calendar, FileSpreadsheet, ArrowUpRight, ArrowDownRight, Tag, X, RefreshCw } from 'lucide-react';

interface FinanceiroTabProps {
  transacoes: TransacaoFinanceira[];
  addTransacao: (t: Omit<TransacaoFinanceira, 'id'>) => void;
  deleteTransacao: (id: string) => void;
  resetToFactoryDefault: () => void;
}

export default function FinanceiroTab({
  transacoes,
  addTransacao,
  deleteTransacao,
  resetToFactoryDefault
}: FinanceiroTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0]);
  const [categoria, setCategoria] = useState<TransacaoFinanceira['categoria']>('servico');

  const CATEGORIAS_PRESET: Array<{ val: TransacaoFinanceira['categoria']; label: string }> = [
    { val: 'servico', label: 'Mão de Obra / Visita' },
    { val: 'pecas', label: 'Peças e Materiais' },
    { val: 'ferramentas', label: 'Ferramentas de Trabalho' },
    { val: 'transporte', label: 'Transporte e Gasolina' },
    { val: 'marketing', label: 'Publicidade e Marketing' },
    { val: 'impostos', label: 'Impostos e Contabilidade' },
    { val: 'outros', label: 'Outras despesas/receitas' }
  ];

  const handleOpenCreate = () => {
    setDescricao('');
    setValor(0);
    setData(new Date().toISOString().split('T')[0]);
    setTipo('receita');
    setCategoria('servico');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || valor <= 0) {
      alert('Preencha a descrição e um valor válido acima de zero.');
      return;
    }

    addTransacao({
      tipo,
      descricao,
      valor,
      data,
      categoria
    });
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, desc: string) => {
    if (window.confirm(`Excluir a transação "${desc}" permanentemente?`)) {
      deleteTransacao(id);
    }
  };

  // Math helpers
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((sum, item) => sum + item.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, item) => sum + item.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const filteredTransacoes = transacoes.filter(t => {
    const matchesSearch = t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || t.categoria.includes(searchTerm);
    const matchesType = typeFilter === '' || t.tipo === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate percentage of category use for dynamic visual progress bars
  const getCategorySpendMap = () => {
    const spendMap: Record<string, number> = {};
    transacoes.forEach(t => {
      if (!spendMap[t.categoria]) spendMap[t.categoria] = 0;
      spendMap[t.categoria] += t.valor;
    });
    return spendMap;
  };

  const catSpends = getCategorySpendMap();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-frost-500" />
            Controle Financeiro & Fluxo de Caixa
          </h2>
          <p className="text-sm text-gray-500">Acompanhe seus rendimentos operacionais de Ordens de Serviço faturadas e controle despesas de campo.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetToFactoryDefault}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Resetar Banco de Dados"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resetar Dados
          </button>
          
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-frost-600 hover:bg-frost-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Lançar Movimentação
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Receitas */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="block text-xs uppercase text-gray-400 font-bold">Faturamento (Receitas)</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 block mt-1">
              {totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-[10px] text-gray-400">Ganhos com manutenções e contratos</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="block text-xs uppercase text-gray-400 font-bold">Overhead (Despesas)</span>
            <span className="text-2xl font-bold font-mono text-red-600 block mt-1">
              {totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-[10px] text-gray-400">Insumos, gasolina, peças e taxas</span>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Lucro líquido */}
        <div className={`border rounded-xl p-5 shadow-xs flex items-center justify-between ${
          saldoLiquido >= 0 ? 'bg-frost-50 border-frost-200' : 'bg-red-50 border-red-200'
        }`}>
          <div>
            <span className="block text-xs uppercase text-frost-700 font-bold">Resultado Líquido</span>
            <span className={`text-2xl font-bold font-mono block mt-1 ${
              saldoLiquido >= 0 ? 'text-frost-900' : 'text-red-900'
            }`}>
              {saldoLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-[10px] text-frost-600 font-medium">Margem líquida de caixa</span>
          </div>
          <div className={`p-3 rounded-lg ${
            saldoLiquido >= 0 ? 'bg-frost-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs space-y-4">
            
            {/* Search filter row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar transações por nome ou categoria..."
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-40 px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
              >
                <option value="">Tipo: Todos</option>
                <option value="receita">Receitas (+)</option>
                <option value="despesa">Despesas (-)</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredTransacoes.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Nenhum registro de transação encontrado para os filtros.</p>
              ) : (
                filteredTransacoes.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded ${
                        t.tipo === 'receita' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {t.tipo === 'receita' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">{t.descricao}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                            {t.categoria.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-0.5 font-mono">
                            <Calendar className="w-3 h-3" />
                            {t.data}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold text-xs ${
                        t.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {t.tipo === 'receita' ? '+' : '-'} {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <button
                        onClick={() => handleDelete(t.id, t.descricao)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                        title="Remover transação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Right side charts/category breakdown widgets */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-gray-950 text-sm">Resumo de Gastos por Categoria</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Veja a distribuição volumétrica total de recursos movimentados no sistema por setor operacional.
            </p>

            <div className="space-y-3 pt-2">
              {CATEGORIAS_PRESET.map((cPreset) => {
                const totalAmt = catSpends[cPreset.val] || 0;
                const totalMovements = totalReceitas + totalDespesas;
                const pct = totalMovements > 0 ? (totalAmt / totalMovements) * 100 : 0;

                return (
                  <div key={cPreset.val} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-700 font-medium">
                      <span>{cPreset.label}</span>
                      <span className="font-mono font-semibold">{totalAmt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-frost-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Launch manual transaction modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="bg-frost-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-frost-200" />
                Registrar Movimento Financeiro
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-frost-200 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Type selector (Receita vs Despesa) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tipo de Movimento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTipo('receita');
                      setCategoria('servico');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      tipo === 'receita'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-50'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Receita / Entrada (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTipo('despesa');
                      setCategoria('transporte');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      tipo === 'despesa'
                        ? 'bg-red-50 text-red-800 border-red-300 ring-2 ring-red-50'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Despesa / Saída (-)
                  </button>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Histórico / Descrição *</label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder={tipo === 'receita' ? 'Ex: Higienização Split Clínicasorriso' : 'Ex: Compra de Cilindro de Gás R410'}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                />
              </div>

              {/* Valor */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Valor do Lançamento (R$) *</label>
                <input
                  type="number"
                  min={0.01}
                  step="any"
                  required
                  value={valor}
                  onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 150.00"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Setor / Categoria</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as TransacaoFinanceira['categoria'])}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white capitalize"
                >
                  {CATEGORIAS_PRESET.map(c => (
                    <option key={c.val} value={c.val}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Data Competência</label>
                <input
                  type="date"
                  required
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-frost-600 hover:bg-frost-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
