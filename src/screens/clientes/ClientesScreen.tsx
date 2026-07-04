import React, { useState } from 'react';
import { Cliente, Equipamento } from '../../models/types';
import { Users, Plus, Search, Edit2, Trash2, Phone, Mail, MapPin, ClipboardList, X } from 'lucide-react';

interface ClientesTabProps {
  clientes: Cliente[];
  equipamentos: Equipamento[];
  addCliente: (c: Omit<Cliente, 'id' | 'dataCriacao'>) => void;
  updateCliente: (id: string, c: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
}

export default function ClientesScreen({
  clientes,
  equipamentos,
  addCliente,
  updateCliente,
  deleteCliente
}: ClientesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [notas, setNotas] = useState('');

  // Handle open form for create
  const handleOpenCreate = () => {
    setEditingCliente(null);
    setNome('');
    setDocumento('');
    setTelefone('');
    setEmail('');
    setEndereco('');
    setCep('');
    setCidade('São Paulo - SP');
    setNotas('');
    setIsFormOpen(true);
  };

  // Handle open form for edit
  const handleOpenEdit = (c: Cliente, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening detail panel
    setEditingCliente(c);
    setNome(c.nome);
    setDocumento(c.documento);
    setTelefone(c.telefone);
    setEmail(c.email);
    setEndereco(c.endereco);
    setCep(c.cep);
    setCidade(c.cidade);
    setNotas(c.notas || '');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !telefone) {
      alert('Nome e Telefone são campos obrigatórios.');
      return;
    }

    const payload = { nome, documento, telefone, email, endereco, cep, city: cidade, cidade, notas };

    if (editingCliente) {
      updateCliente(editingCliente.id, payload);
    } else {
      addCliente(payload);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${name}"? Todos os equipamentos vinculados a ele também serão excluídos!`)) {
      deleteCliente(id);
      if (selectedCliente?.id === id) {
        setSelectedCliente(null);
      }
    }
  };

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documento.includes(searchTerm) ||
    c.telefone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Tab Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-frost-500" />
            Clientes Registrados
          </h2>
          <p className="text-sm text-gray-500">Gerencie a carteira de clientes, endereços e históricos de serviços.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-frost-600 hover:bg-frost-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por nome, documento, e-mail ou telefone..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List Pane */}
        <div className="lg:col-span-2 space-y-3">
          {filteredClientes.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-700">Nenhum cliente encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Experimente buscar por outros termos ou cadastre um novo cliente.</p>
            </div>
          ) : (
            filteredClientes.map((c) => {
              const clientEqs = equipamentos.filter(eq => eq.clienteId === c.id);
              const isSelected = selectedCliente?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCliente(isSelected ? null : c)}
                  className={`bg-white border transition-all duration-200 rounded-xl p-4 cursor-pointer hover:border-frost-200 hover:shadow-sm ${
                    isSelected ? 'border-frost-500 ring-2 ring-frost-50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 text-base">{c.nome}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-mono">
                        <span>CNPJ/CPF: {c.documento || 'Não informado'}</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-frost-500" />
                          {clientEqs.length} {clientEqs.length === 1 ? 'equipamento' : 'equipamentos'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 no-print">
                      <button
                        onClick={(e) => handleOpenEdit(c, e)}
                        className="p-1.5 text-gray-400 hover:text-frost-600 hover:bg-gray-50 rounded"
                        title="Editar Cliente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(c.id, c.nome, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Excluir Cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{c.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{c.email || 'Sem e-mail'}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{c.endereco}, {c.cidade}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Info Detail Panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-frost-900 to-slate-900 text-white rounded-xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-lg mb-2">Painel de Informações</h3>
            <p className="text-xs text-frost-100 leading-relaxed mb-4">
              Selecione um cliente para visualizar todos os aparelhos de ar condicionado instalados, contratos vigentes e notas operacionais de campo.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <span className="block text-2xl font-bold font-mono">{clientes.length}</span>
                <span className="text-[10px] text-frost-200 uppercase tracking-wider font-semibold">Total Clientes</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="block text-2xl font-bold font-mono">{equipamentos.length}</span>
                <span className="text-[10px] text-frost-200 uppercase tracking-wider font-semibold">Total Equipamentos</span>
              </div>
            </div>
          </div>

          {selectedCliente ? (
            <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4 animate-slide-up">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] text-frost-500 font-mono uppercase tracking-wider font-bold">Ficha do Cliente</span>
                  <h4 className="font-bold text-gray-900 text-base leading-tight">{selectedCliente.nome}</h4>
                </div>
                <button
                  onClick={() => setSelectedCliente(null)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Card */}
              <div className="space-y-2.5 text-xs text-gray-700">
                <p className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-frost-500 shrink-0 mt-0.5" />
                  <span><strong>Telefone:</strong> {selectedCliente.telefone}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-frost-500 shrink-0 mt-0.5" />
                  <span className="break-all"><strong>E-mail:</strong> {selectedCliente.email || 'Nenhum cadastrado'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-frost-500 shrink-0 mt-0.5" />
                  <span><strong>Endereço:</strong><br />{selectedCliente.endereco}<br />{selectedCliente.cidade} - CEP {selectedCliente.cep}</span>
                </p>
              </div>

              {/* Equipment summary list */}
              <div className="pt-3 border-t border-gray-100">
                <h5 className="font-semibold text-gray-900 text-xs mb-2 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-frost-500" />
                  Aparelhos Vinculados
                </h5>
                {equipamentos.filter(e => e.clienteId === selectedCliente.id).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nenhum equipamento cadastrado para este cliente.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {equipamentos
                      .filter(e => e.clienteId === selectedCliente.id)
                      .map(e => (
                        <div key={e.id} className="bg-gray-50 rounded p-2 text-xs border border-gray-100">
                          <p className="font-semibold text-gray-800">{e.tipo}</p>
                          <p className="text-gray-500 font-mono text-[10px]">{e.marca} • {e.capacidade} • Modelo {e.modelo}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedCliente.notas && (
                <div className="pt-3 border-t border-gray-100">
                  <h5 className="font-semibold text-gray-900 text-xs mb-1">Notas de Atendimento:</h5>
                  <p className="text-xs text-gray-600 bg-amber-50 border border-amber-100 p-2.5 rounded leading-relaxed">
                    {selectedCliente.notas}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs">Clique em qualquer cliente na lista para ver os detalhes completos de contato e equipamentos vinculados.</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over or Modal for Creating / Editing Client */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up">
            <div className="bg-frost-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-frost-200" />
                {editingCliente ? 'Editar Cadastro de Cliente' : 'Cadastrar Novo Cliente'}
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
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Nome Completo / Razão Social *</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João da Silva ou Clínicasorriso Ltda"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Documento */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="Ex: 000.000.000-00 ou 00.000.000/0001-00"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* E-mail */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">E-mail para Orçamentos/Notas</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: cliente@email.com"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Endereço (Rua, Número, Complemento, Bairro) *</label>
                  <input
                    type="text"
                    required
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Ex: Rua das Flores, 123 - Apt 45 - Pinheiros"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* CEP */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">CEP</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="Ex: 01234-567"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Cidade - Estado */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Cidade - UF</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: São Paulo - SP"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
                  />
                </div>

                {/* Notas */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Notas de Atendimento (Instruções Especiais de Acesso)</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ex: Entrar pelo portão de serviços na rua lateral. Falar com porteiro Roberto."
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500 resize-none"
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
