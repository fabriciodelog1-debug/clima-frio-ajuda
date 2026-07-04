import React, { useState } from 'react';
import { Cliente, Equipamento } from '../../models/types';
import { HardDrive, Plus, Search, Edit2, Trash2, Calendar, User, Hash, Tag, Layers, X } from 'lucide-react';

interface EquipamentosTabProps {
  equipamentos: Equipamento[];
  clientes: Cliente[];
  addEquipamento: (e: Omit<Equipamento, 'id'>) => void;
  updateEquipamento: (id: string, e: Partial<Equipamento>) => void;
  deleteEquipamento: (id: string) => void;
}

export default function EquipamentosScreen({
  equipamentos,
  clientes,
  addEquipamento,
  updateEquipamento,
  deleteEquipamento
}: EquipamentosTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientFilter, setSelectedClientFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null);

  // Form states
  const [clienteId, setClienteId] = useState('');
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [btus, setBtus] = useState('');
  const [gas, setGas] = useState('');
  const [tensao, setTensao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [dataInstalacao, setDataInstalacao] = useState('');
  const [ultimaManutencao, setUltimaManutencao] = useState('');
  const [proximaManutencao, setProximaManutencao] = useState('');

  // Preset choices for HVAC ease of use
  const TIPOS_PRESET = [
    'Ar Condicionado Split Hi-Wall',
    'Ar Condicionado Split Cassete',
    'Ar Condicionado Split Piso Teto',
    'Ar Condicionado Janela (ACJ)',
    'Ar Condicionado Multi-Split',
    'Chiller / Fan Coil',
    'Câmara Fria Comercial',
    'Geladeira / Freezer Comercial',
    'Cortina de Ar'
  ];

  const MARCAS_PRESET = [
    'LG', 'Samsung', 'Carrier', 'Midea', 'Daikin', 'Springer', 'Consul', 'Fujitsu', 'Elgin', 'Gree', 'Trane'
  ];

  const CAPACIDADES_PRESET = [
    '7.500 BTU', '9.000 BTU', '12.000 BTU', '18.000 BTU', '22.000 BTU', '24.000 BTU', '30.000 BTU', '36.000 BTU', '48.000 BTU', '60.000 BTU', '5 HP (Refrigeração)', '10 HP'
  ];

  const handleOpenCreate = () => {
    setEditingEquipamento(null);
    setClienteId(clientes[0]?.id || '');
    setTipo(TIPOS_PRESET[0]);
    setMarca(MARCAS_PRESET[0]);
    setModelo('');
    setNumeroSerie('');
    setCapacidade(CAPACIDADES_PRESET[2]); // Default 12.000 BTU
    setBtus('12000');
    setGas('R410A');
    setTensao('220V');
    setLocalizacao('');
    setDataInstalacao(new Date().toISOString().split('T')[0]);
    setUltimaManutencao(new Date().toISOString().split('T')[0]);
    // Set proximaManutencao to 6 months in the future
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    setProximaManutencao(sixMonthsLater.toISOString().split('T')[0]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e: Equipamento) => {
    setEditingEquipamento(e);
    setClienteId(e.clienteId);
    setTipo(e.tipo);
    setMarca(e.marca);
    setModelo(e.modelo);
    setNumeroSerie(e.numeroSerie);
    setCapacidade(e.capacidade);
    setBtus(e.btus || e.capacidade?.replace(/[^0-9]/g, '') || '12000');
    setGas(e.gas || 'R410A');
    setTensao(e.tensao || '220V');
    setLocalizacao(e.localizacao || '');
    setDataInstalacao(e.dataInstalacao || '');
    setUltimaManutencao(e.ultimaManutencao || '');
    setProximaManutencao(e.proximaManutencao || '');
    setIsFormOpen(true);
  };

  const handleSave = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!clienteId || !tipo || !marca || !modelo) {
      alert('Por favor, preencha todos os campos obrigatórios (Cliente, Tipo, Marca e Modelo).');
      return;
    }

    const payload = {
      clienteId,
      tipo,
      marca,
      modelo,
      numeroSerie: numeroSerie || 'S/N',
      capacidade,
      btus: btus || capacidade?.replace(/[^0-9]/g, '') || '12000',
      gas: gas || 'R410A',
      tensao: tensao || '220V',
      localizacao,
      dataInstalacao,
      ultimaManutencao,
      proximaManutencao
    };

    if (editingEquipamento) {
      updateEquipamento(editingEquipamento.id, payload);
    } else {
      addEquipamento(payload);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, model: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o equipamento "${model}"?`)) {
      deleteEquipamento(id);
    }
  };

  const filteredEquipamentos = equipamentos.filter(eq => {
    const matchesSearch =
      eq.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq.localizacao && eq.localizacao.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClient = selectedClientFilter === '' || eq.clienteId === selectedClientFilter;

    return matchesSearch && matchesClient;
  });

  return (
    <div className="space-y-6">
      {/* Tab Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-frost-500" />
            Aparelhos & Equipamentos
          </h2>
          <p className="text-sm text-gray-500">Controle e rastreie aparelhos de ar-condicionado por marcas, BTUs, localização e histórico.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          disabled={clientes.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-frost-600 hover:bg-frost-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Equipamento
        </button>
      </div>

      {clientes.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">
          ⚠️ <strong>Aviso:</strong> Você precisa cadastrar pelo menos um <strong>Cliente</strong> antes de poder registrar equipamentos. Vá até a aba Clientes e crie um cadastro.
        </div>
      )}

      {/* Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Text Search */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por modelo, marca, série ou localização..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
          />
        </div>

        {/* Client Selector Filter */}
        <select
          value={selectedClientFilter}
          onChange={(e) => setSelectedClientFilter(e.target.value)}
          className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-frost-500"
        >
          <option value="">Todos os Clientes</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {/* Equipment List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipamentos.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-500">
            <HardDrive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-700">Nenhum equipamento cadastrado</p>
            <p className="text-sm text-gray-400 mt-1">Registre as máquinas de refrigeração para gerenciar visitas preventivas e corretivas.</p>
          </div>
        ) : (
          filteredEquipamentos.map((eq) => {
            const owner = clientes.find(c => c.id === eq.clienteId);

            return (
              <div
                key={eq.id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs hover:shadow-sm hover:border-frost-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold bg-frost-50 text-frost-600 uppercase tracking-wide">
                      {eq.capacidade}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(eq)}
                        className="p-1 text-gray-400 hover:text-frost-600 hover:bg-gray-50 rounded"
                        title="Editar Equipamento"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(eq.id, eq.modelo)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Excluir Equipamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Machine Details */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-950 text-base font-display">{eq.marca} • {eq.modelo}</h3>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                      {eq.tipo}
                    </p>
                  </div>

                  {/* Owner Label */}
                  <div className="mt-4 p-2.5 bg-gray-50 rounded-lg text-xs flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-frost-500 shrink-0" />
                    <span className="text-gray-700 font-medium truncate">
                      Cliente: <strong>{owner?.nome || 'Não Encontrado'}</strong>
                    </span>
                  </div>

                  {/* Location & Serial */}
                  <div className="mt-4 grid grid-cols-2 gap-y-2.5 gap-x-4 border-t border-gray-100 pt-3 text-xs text-gray-600">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Localização</span>
                      <span className="font-medium text-gray-800">{eq.localizacao || 'Recepção / Geral'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Nº de Série</span>
                      <span className="font-mono text-gray-800 font-medium truncate block max-w-[120px]">{eq.numeroSerie}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Gás & Tensão</span>
                      <span className="font-medium text-gray-800">{eq.gas || 'R410A'} • {eq.tensao || '220V'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-amber-600 uppercase font-bold">Próx. PMOC</span>
                      <span className="font-medium text-amber-700 font-semibold">{eq.proximaManutencao || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Dates footer */}
                <div className="mt-5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    Instalado: {eq.dataInstalacao || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1 justify-end font-semibold text-frost-600">
                    <Calendar className="w-3 h-3" />
                    Última OS: {eq.ultimaManutencao || 'N/A'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Equipment creation/editing modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-slide-up">
            <div className="bg-frost-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-frost-200" />
                {editingEquipamento ? 'Editar Máquina de Climatização' : 'Registrar Novo Equipamento'}
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
                {/* Cliente Link */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Proprietário / Cliente *</label>
                  <select
                    required
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-frost-500"
                  >
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Equipamento */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Tipo de Equipamento *</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-frost-500"
                  >
                    {TIPOS_PRESET.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Marca / Fabricante *</label>
                  <select
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-frost-500"
                  >
                    {MARCAS_PRESET.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Modelo Comercial *</label>
                  <input
                    type="text"
                    required
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: WindFree Connect Inverter"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Capacidade */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Capacidade de Resfriamento *</label>
                  <select
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-frost-500"
                  >
                    {CAPACIDADES_PRESET.map(cap => (
                      <option key={cap} value={cap}>{cap}</option>
                    ))}
                  </select>
                </div>

                {/* Número de Série */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Número de Série (S/N)</label>
                  <input
                    type="text"
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    placeholder="Ex: SAM-12039-X"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Localização */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Localização na Planta</label>
                  <input
                    type="text"
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    placeholder="Ex: Sala de Reuniões, Quarto Casal"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Data de Instalação */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Data de Instalação</label>
                  <input
                    type="date"
                    value={dataInstalacao}
                    onChange={(e) => setDataInstalacao(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  />
                </div>

                {/* Última Manutenção */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Última Revisão Preventiva</label>
                  <input
                    type="date"
                    value={ultimaManutencao}
                    onChange={(e) => setUltimaManutencao(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  />
                </div>

                {/* Gás Refrigerante */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Gás Refrigerante</label>
                  <select
                    value={gas}
                    onChange={(e) => setGas(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    <option value="R410A">R410A</option>
                    <option value="R22">R22</option>
                    <option value="R32">R32</option>
                    <option value="R407C">R407C</option>
                    <option value="R134a">R134a</option>
                  </select>
                </div>

                {/* Tensão Elétrica */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Tensão Elétrica</label>
                  <select
                    value={tensao}
                    onChange={(e) => setTensao(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    <option value="220V">220V</option>
                    <option value="110V">110V</option>
                    <option value="380V">380V</option>
                  </select>
                </div>

                {/* Próxima Manutenção */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Próxima Manutenção (PMOC)</label>
                  <input
                    type="date"
                    value={proximaManutencao}
                    onChange={(e) => setProximaManutencao(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  />
                </div>

                {/* BTUs */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">BTUs (Apenas Números)</label>
                  <input
                    type="text"
                    value={btus}
                    onChange={(e) => setBtus(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ex: 12000"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
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
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
