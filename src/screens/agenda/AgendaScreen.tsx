import React, { useState } from 'react';
import { Cliente, Equipamento, Agendamento, ServicoTipo } from '../../models/types';
import { Calendar as CalendarIcon, Plus, User, Clock, CheckCircle2, AlertCircle, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AgendaTabProps {
  agendamentos: Agendamento[];
  clientes: Cliente[];
  equipamentos: Equipamento[];
  addAgendamento: (a: Omit<Agendamento, 'id'>) => void;
  updateAgendamento: (id: string, a: Partial<Agendamento>) => void;
  deleteAgendamento: (id: string) => void;
}

export default function AgendaScreen({
  agendamentos,
  clientes,
  equipamentos,
  addAgendamento,
  updateAgendamento,
  deleteAgendamento
}: AgendaTabProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null);

  // Form states
  const [clienteId, setClienteId] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [status, setStatus] = useState<'agendado' | 'em_andamento' | 'concluido' | 'cancelado'>('agendado');
  const [tipoServico, setTipoServico] = useState<ServicoTipo>('higienizacao');
  const [tecnico, setTecnico] = useState('');

  const TECNICOS_PRESET = ['Felipe Santos', 'Rodrigo Lima', 'Carlos Henrique', 'Douglas Souza'];

  // Helper labels & colors for Service Type
  const getServiceTypeInfo = (type: ServicoTipo) => {
    switch (type) {
      case 'instalacao':
        return { label: 'Instalação', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'manutencao_preventiva':
        return { label: 'Maint. Preventiva', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'manutencao_corretiva':
        return { label: 'Maint. Corretiva', color: 'bg-red-50 text-red-700 border-red-200' };
      case 'higienizacao':
        return { label: 'Higienização', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'visita_tecnica':
        return { label: 'Visita Técnica', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      case 'em_andamento':
        return 'bg-amber-100 text-amber-800 animate-pulse';
      case 'concluido':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenCreate = () => {
    setEditingAgendamento(null);
    setClienteId(clientes[0]?.id || '');
    setEquipamentoId('');
    setTitulo('');
    setDescricao('');
    setData(selectedDate);
    setHoraInicio('09:00');
    setHoraFim('10:30');
    setStatus('agendado');
    setTipoServico('higienizacao');
    setTecnico(TECNICOS_PRESET[0]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (ag: Agendamento) => {
    setEditingAgendamento(ag);
    setClienteId(ag.clienteId);
    setEquipamentoId(ag.equipamentoId || '');
    setTitulo(ag.titulo);
    setDescricao(ag.descricao);
    setData(ag.data);
    setHoraInicio(ag.horaInicio);
    setHoraFim(ag.horaFim);
    setStatus(ag.status);
    setTipoServico(ag.tipoServico);
    setTecnico(ag.tecnico);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !titulo || !data || !horaInicio || !tecnico) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      clienteId,
      equipamentoId: equipamentoId || undefined,
      titulo,
      descricao,
      data,
      horaInicio,
      horaFim,
      status,
      tipoServico,
      tecnico
    };

    if (editingAgendamento) {
      updateAgendamento(editingAgendamento.id, payload);
    } else {
      addAgendamento(payload);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: typeof status) => {
    updateAgendamento(id, { status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente remover este agendamento do calendário?')) {
      deleteAgendamento(id);
    }
  };

  // Filter agendamentos for selected date (sorted by start time)
  const sortedAgendamentos = [...agendamentos]
    .filter(a => a.data === selectedDate)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  // Calendar dates helper (displays 7 days starting from selected date minus 2 days)
  const getDayStrip = () => {
    const strip = [];
    const baseDate = new Date(selectedDate + 'T12:00:00');
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3);
      const dayNum = d.getDate();
      strip.push({ iso, weekday, dayNum });
    }
    return strip;
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const clientOfForm = clientes.find(c => c.id === clienteId);
  const clientEquipamentos = clientOfForm ? equipamentos.filter(e => e.clienteId === clientOfForm.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-frost-500" />
            Agenda de Visitas & Serviços
          </h2>
          <p className="text-sm text-gray-500">Agende and monitore os técnicos em campo para instalações e revisões mecânicas.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          disabled={clientes.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-frost-600 hover:bg-frost-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Agendar Visita
        </button>
      </div>

      {clientes.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">
          ⚠️ <strong>Aviso:</strong> Você precisa cadastrar um <strong>Cliente</strong> antes de agendar uma visita técnica.
        </div>
      )}

      {/* Date Navigator Slider */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            onClick={handlePrevDay}
            className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded text-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <span className="text-xs uppercase text-frost-500 font-bold tracking-wider">Visualizando Agenda</span>
            <h3 className="font-display font-bold text-lg text-gray-900">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded text-gray-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Mini Day Selector */}
        <div className="grid grid-cols-7 gap-2 max-w-xl mx-auto border-t border-gray-50 pt-3">
          {getDayStrip().map((day) => {
            const isSelected = day.iso === selectedDate;
            const dailyCounts = agendamentos.filter(a => a.data === day.iso && a.status !== 'cancelado').length;

            return (
              <button
                key={day.iso}
                onClick={() => setSelectedDate(day.iso)}
                className={`p-2 rounded-lg flex flex-col items-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-frost-600 text-white shadow-sm ring-2 ring-frost-100'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{day.weekday}</span>
                <span className="text-base font-bold font-mono mt-0.5">{day.dayNum}</span>
                {dailyCounts > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-frost-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Agenda List */}
      <div className="space-y-4">
        {sortedAgendamentos.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-400">
            <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-medium text-gray-700 text-sm">Sem agendamentos para este dia</p>
            <p className="text-xs text-gray-400 mt-1">Sua equipe está livre ou as visitas foram remanejadas.</p>
            <button
              onClick={handleOpenCreate}
              disabled={clientes.length === 0}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Agendar para Hoje
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAgendamentos.map((ag) => {
              const client = clientes.find(c => c.id === ag.clienteId);
              const equipment = equipamentos.find(e => e.id === ag.equipamentoId);
              const typeInfo = getServiceTypeInfo(ag.tipoServico);

              return (
                <div
                  key={ag.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs hover:border-frost-200 transition-all grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-slide-up"
                >
                  {/* Time Section */}
                  <div className="md:col-span-2 flex items-center md:flex-col justify-between md:justify-center md:border-r border-gray-100 pr-4 py-1 text-center">
                    <div className="flex items-center gap-1.5 text-gray-900 font-bold font-mono text-base md:text-lg">
                      <Clock className="w-4 h-4 text-frost-500 shrink-0" />
                      {ag.horaInicio}
                    </div>
                    <span className="text-xs text-gray-400">até {ag.horaFim}</span>
                  </div>

                  {/* Main Info */}
                  <div className="md:col-span-6 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(ag.status)}`}>
                        {ag.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{ag.titulo}</h4>
                    
                    <p className="text-xs text-gray-500 font-medium">
                      Cliente: <strong>{client?.nome || 'Não Encontrado'}</strong>
                      {client?.telefone && ` • ${client.telefone}`}
                    </p>

                    {equipment && (
                      <p className="text-xs text-frost-600 font-mono">
                        Aparelho: {equipment.tipo} ({equipment.marca} • {equipment.capacidade}) • Local: {equipment.localizacao}
                      </p>
                    )}

                    {ag.descricao && (
                      <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded border border-gray-100 mt-2">
                        {ag.descricao}
                      </p>
                    )}
                  </div>

                  {/* Technician & Actions */}
                  <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-between items-start md:items-end md:pl-4">
                    {/* Technician Name */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                      <User className="w-4 h-4 text-frost-500 shrink-0" />
                      <span>Téc: <strong>{ag.tecnico}</strong></span>
                    </div>

                    {/* Status Toggles / Control Panel */}
                    <div className="flex items-center gap-1.5 no-print w-full sm:w-auto md:w-full justify-end">
                      {ag.status !== 'concluido' && ag.status !== 'cancelado' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(ag.id, ag.status === 'agendado' ? 'em_andamento' : 'concluido')}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-frost-50 hover:bg-frost-100 text-frost-700 text-[11px] font-bold rounded-md border border-frost-200 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin-slow" />
                            {ag.status === 'agendado' ? 'Iniciar' : 'Concluir'}
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleOpenEdit(ag)}
                        className="px-2 py-1.5 text-gray-600 hover:text-frost-600 hover:bg-gray-50 border border-gray-100 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(ag.id)}
                        className="px-2 py-1.5 text-red-600 hover:bg-red-50 border border-transparent rounded text-[11px] font-semibold cursor-pointer"
                        title="Remover"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Appointment Creation / Editing Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-slide-up">
            <div className="bg-frost-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-frost-200" />
                {editingAgendamento ? 'Reagendar Visita Técnica' : 'Criar Novo Agendamento'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-frost-200 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Cliente / Local da Visita *</label>
                  <select
                    required
                    value={clienteId}
                    onChange={(e) => {
                      setClienteId(e.target.value);
                      setEquipamentoId(''); // Reset linked device on change
                    }}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Equipamento (Optional) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Equipamento Específico (Opcional)
                  </label>
                  <select
                    value={equipamentoId}
                    onChange={(e) => setEquipamentoId(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    <option value="">-- Toda a infraestrutura ou Geral --</option>
                    {clientEquipamentos.map(eq => (
                      <option key={eq.id} value={eq.id}>
                        {eq.tipo} ({eq.marca} • {eq.capacidade} - {eq.localizacao})
                      </option>
                    ))}
                  </select>
                  {clientEquipamentos.length === 0 && clienteId && (
                    <span className="text-[10px] text-gray-400 block mt-1 italic">
                      Este cliente não tem equipamentos cadastrados. Deixe em branco ou cadastre um na aba Equipamentos.
                    </span>
                  )}
                </div>

                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Título do Serviço / Tarefa *</label>
                  <input
                    type="text"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Instalação de Inverter, PMOC Mensal, Carga de Gás"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  />
                </div>

                {/* Tipo de Serviço */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Categoria de Serviço</label>
                  <select
                    value={tipoServico}
                    onChange={(e) => setTipoServico(e.target.value as ServicoTipo)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    <option value="higienizacao">Higienização / Limpeza</option>
                    <option value="instalacao">Instalação Completa</option>
                    <option value="manutencao_preventiva">Manutenção Preventiva</option>
                    <option value="manutencao_corretiva">Conserto (Manut. Corretiva)</option>
                    <option value="visita_tecnica">Visita Técnica de Orçamento</option>
                  </select>
                </div>

                {/* Técnico */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Técnico Responsável *</label>
                  <select
                    required
                    value={tecnico}
                    onChange={(e) => setTecnico(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    {TECNICOS_PRESET.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Data Agendada *</label>
                  <input
                    type="date"
                    required
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  />
                </div>

                {/* Horários */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Hora Início *</label>
                    <input
                      type="time"
                      required
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Hora Fim *</label>
                    <input
                      type="time"
                      required
                      value={horaFim}
                      onChange={(e) => setHoraFim(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Descrição / Notas Técnicas Adicionais</label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ferramentas específicas necessárias: Bomba de vácuo, manifold, recolhedora de gás..."
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none focus:outline-none"
                  />
                </div>

                {/* Status selector (only shown when editing) */}
                {editingAgendamento && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Status da Visita</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['agendado', 'em_andamento', 'concluido', 'cancelado'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatus(st)}
                          className={`py-1.5 text-xs font-bold rounded border transition-colors capitalize cursor-pointer ${
                            status === st
                              ? 'bg-frost-600 text-white border-frost-600'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
