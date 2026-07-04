import React, { useState, useEffect, useRef } from 'react';
import { Cliente, Equipamento, OrdemServico, PecaUtilizada, OSStatus } from '../../models/types';
import { FileText, Plus, Search, Edit2, Trash2, Calendar, DollarSign, User, FileSpreadsheet, Printer, X, PlusCircle, MinusCircle, Eye, MessageSquare } from 'lucide-react';

const SignaturePad = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault(); // prevent scrolling
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col items-center gap-1 mx-auto">
      <div className="border border-gray-300 bg-slate-50 rounded-lg overflow-hidden relative group">
        <canvas
          ref={canvasRef}
          width={250}
          height={75}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair block bg-slate-50 touch-none"
        />
        <button
          type="button"
          onClick={clearCanvas}
          className="absolute right-1 bottom-1 text-[9px] bg-white/95 text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 hover:bg-white no-print opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Limpar
        </button>
      </div>
    </div>
  );
};

interface OrdensServicoTabProps {
  mode?: 'ordens' | 'orcamentos';
  ordensServico: OrdemServico[];
  clientes: Cliente[];
  equipamentos: Equipamento[];
  addOrdemServico: (o: Omit<OrdemServico, 'id' | 'dataAbertura'>) => void;
  updateOrdemServico: (id: string, o: Partial<OrdemServico>) => void;
  deleteOrdemServico: (id: string) => void;
}

export default function OrdensServicoTab({
  mode = 'ordens',
  ordensServico,
  clientes,
  equipamentos,
  addOrdemServico,
  updateOrdemServico,
  deleteOrdemServico
}: OrdensServicoTabProps) {
  // Dynamic Company Settings loading
  const [companySettings, setCompanySettings] = useState(() => {
    try {
      const stored = localStorage.getItem('cf_company_settings');
      return stored ? JSON.parse(stored) : {
        nomeEmpresa: 'CLIMA FRIO',
        cnpj: '14.590.231/0001-90',
        telefone: '(11) 98888-7777',
        email: 'climafriorp@atendimento.com.br',
        endereco: 'Rua das Climatizações, 420 - Centro',
        cidade: 'São Paulo - SP',
        creaNumero: 'CREA-SP 5070293144'
      };
    } catch {
      return {
        nomeEmpresa: 'CLIMA FRIO',
        cnpj: '14.590.231/0001-90',
        telefone: '(11) 98888-7777',
        email: 'climafriorp@atendimento.com.br',
        endereco: 'Rua das Climatizações, 420 - Centro',
        cidade: 'São Paulo - SP',
        creaNumero: 'CREA-SP 5070293144'
      };
    }
  });

  useEffect(() => {
    const handleSettingsUpdate = () => {
      try {
        const stored = localStorage.getItem('cf_company_settings');
        if (stored) setCompanySettings(JSON.parse(stored));
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener('cf_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('cf_settings_updated', handleSettingsUpdate);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOS, setEditingOS] = useState<OrdemServico | null>(null);
  const [activeReceiptOS, setActiveReceiptOS] = useState<OrdemServico | null>(null);

  const isOrcamentosMode = mode === 'orcamentos';

  // Form states
  const [clienteId, setClienteId] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [status, setStatus] = useState<OSStatus>('orcamento');
  const [descricaoProblema, setDescricaoProblema] = useState('');
  const [descricaoServico, setDescricaoServico] = useState('');
  const [pecas, setPecas] = useState<PecaUtilizada[]>([]);
  const [valorMaoDeObra, setValorMaoDeObra] = useState<number>(0);
  const [tecnicoResponsavel, setTecnicoResponsavel] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<OrdemServico['formaPagamento']>('pix');
  const [fotos, setFotos] = useState<string[]>([]);

  // Helpers for temporary part adding
  const [tempPecaNome, setTempPecaNome] = useState('');
  const [tempPecaQtd, setTempPecaQtd] = useState<number>(1);
  const [tempPecaValor, setTempPecaValor] = useState<number>(0);

  const TECNICOS_PRESET = ['Felipe Santos', 'Rodrigo Lima', 'Carlos Henrique', 'Douglas Souza'];

  const getStatusStyle = (st: OSStatus) => {
    switch (st) {
      case 'orcamento':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'aprovado':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'em_andamento':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'concluido':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelado':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getStatusLabel = (st: OSStatus) => {
    switch (st) {
      case 'orcamento': return 'Orçamento';
      case 'aprovado': return 'Aprovado';
      case 'em_andamento': return 'Em Execução';
      case 'concluido': return 'Concluída';
      case 'cancelado': return 'Cancelada';
    }
  };

  // Calculate live sum
  const calculatePartsTotal = (pList: PecaUtilizada[]) => {
    return pList.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0);
  };

  const liveGrandTotal = calculatePartsTotal(pecas) + valorMaoDeObra;

  const handleOpenCreate = () => {
    setEditingOS(null);
    setClienteId(clientes[0]?.id || '');
    setEquipamentoId('');
    setStatus(isOrcamentosMode ? 'orcamento' : 'aprovado');
    setDescricaoProblema('');
    setDescricaoServico('');
    setPecas([]);
    setValorMaoDeObra(0);
    setTecnicoResponsavel(TECNICOS_PRESET[0]);
    setFormaPagamento('pix');
    setFotos([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (os: OrdemServico, ev: React.MouseEvent) => {
    ev.stopPropagation();
    setEditingOS(os);
    setClienteId(os.clienteId);
    setEquipamentoId(os.equipamentoId);
    setStatus(os.status);
    setDescricaoProblema(os.descricaoProblema);
    setDescricaoServico(os.descricaoServico || '');
    setPecas(os.pecas);
    setValorMaoDeObra(os.valorMaoDeObra);
    setTecnicoResponsavel(os.tecnicoResponsavel);
    setFormaPagamento(os.formaPagamento || 'pix');
    setFotos(os.fotos || []);
    setIsFormOpen(true);
  };

  const handleAddPeca = () => {
    if (!tempPecaNome) {
      alert('Informe o nome da peça/material.');
      return;
    }
    const newPeca: PecaUtilizada = {
      nome: tempPecaNome,
      quantidade: tempPecaQtd,
      valorUnitario: tempPecaValor
    };
    setPecas([...pecas, newPeca]);
    setTempPecaNome('');
    setTempPecaQtd(1);
    setTempPecaValor(0);
  };

  const handleRemovePeca = (index: number) => {
    setPecas(pecas.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !descricaoProblema || !tecnicoResponsavel) {
      alert('Preencha os dados obrigatórios.');
      return;
    }

    const payload = {
      clienteId,
      equipamentoId,
      status,
      descricaoProblema,
      descricaoServico: descricaoServico || undefined,
      pecas,
      valorMaoDeObra,
      valorTotal: liveGrandTotal,
      tecnicoResponsavel,
      formaPagamento: status === 'concluido' ? formaPagamento : undefined,
      fotos
    };

    if (editingOS) {
      updateOrdemServico(editingOS.id, payload);
    } else {
      addOrdemServico(payload);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (window.confirm(`Tem certeza que deseja apagar a ${id}? Se estiver concluída, a receita correspondente também será apagada do financeiro.`)) {
      deleteOrdemServico(id);
    }
  };

  const filteredOS = ordensServico.filter(os => {
    // Mode filters:
    // If we are in 'orcamentos' mode, we only want status === 'orcamento'.
    // If we are in 'ordens' mode, we want everything EXCEPT status === 'orcamento'.
    if (isOrcamentosMode && os.status !== 'orcamento') {
      return false;
    }
    if (!isOrcamentosMode && os.status === 'orcamento') {
      return false;
    }

    const client = clientes.find(c => c.id === os.clienteId);
    const matchesSearch =
      os.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client && client.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      os.descricaoProblema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.tecnicoResponsavel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || os.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedClient = clientes.find(c => c.id === clienteId);
  const availableEquipments = selectedClient ? equipamentos.filter(e => e.clienteId === selectedClient.id) : [];

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-frost-500" />
            {isOrcamentosMode ? 'Orçamentos de Climatização' : 'Ordens de Serviço (OS)'}
          </h2>
          <p className="text-sm text-gray-500">
            {isOrcamentosMode
              ? 'Elabore propostas, estime custos de peças e mão de obra, e converta orçamentos em OS.'
              : 'Gerencie laudos, acompanhe manutenções em andamento e fature os serviços concluídos.'}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          disabled={clientes.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-frost-600 hover:bg-frost-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isOrcamentosMode ? 'Novo Orçamento' : 'Abrir Nova OS'}
        </button>
      </div>

      {clientes.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">
          ⚠️ <strong>Aviso:</strong> Cadastre um <strong>Cliente</strong> antes de abrir ordens de serviço.
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`relative ${isOrcamentosMode ? 'md:col-span-3' : 'md:col-span-2'}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isOrcamentosMode ? "Buscar por número de orçamento, nome do cliente, proposta ou técnico..." : "Buscar por número de OS, nome do cliente, problema ou técnico..."}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-frost-500"
          />
        </div>

        {!isOrcamentosMode && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-frost-500"
          >
            <option value="">Todos os Status</option>
            <option value="aprovado">Aprovado</option>
            <option value="em_andamento">Em Execução</option>
            <option value="concluido">Concluída</option>
            <option value="cancelado">Cancelada</option>
          </select>
        )}
      </div>

      {/* OS Grid List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOS.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-700">
              {isOrcamentosMode ? 'Nenhum orçamento encontrado' : 'Nenhuma Ordem de Serviço encontrada'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {isOrcamentosMode
                ? 'Comece criando um orçamento detalhado de climatização para o seu cliente.'
                : 'Registre a abertura de novas ordens de serviço para gerenciar os atendimentos em andamento.'}
            </p>
          </div>
        ) : (
          filteredOS.map((os) => {
            const client = clientes.find(c => c.id === os.clienteId);
            const machine = equipamentos.find(m => m.id === os.equipamentoId);

            return (
              <div
                key={os.id}
                onClick={() => setActiveReceiptOS(os)}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs hover:border-frost-200 hover:shadow-sm transition-all cursor-pointer flex flex-col md:flex-row justify-between gap-4 items-start md:items-center animate-slide-up"
              >
                {/* Identifier & Client */}
                <div className="space-y-1 md:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 text-sm md:text-base">{os.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(os.status)}`}>
                      {getStatusLabel(os.status)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-tight mt-1">{client?.nome || 'Cliente não encontrado'}</h3>
                  <p className="text-xs text-gray-500 font-mono truncate">{client?.telefone}</p>
                </div>

                {/* Equipment & Problem brief */}
                <div className="space-y-1 md:w-1/3 text-xs text-gray-600">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold">Aparelho & Problema</span>
                  <span className="font-medium text-frost-600 truncate block">
                    {machine ? `${machine.tipo} (${machine.marca} ${machine.capacidade})` : 'Sem aparelho vinculado'}
                  </span>
                  <p className="truncate text-gray-600 italic">"{os.descricaoProblema}"</p>
                </div>

                {/* Total & Responsibility */}
                <div className="flex flex-wrap md:flex-nowrap justify-between md:justify-end items-center gap-6 w-full md:w-1/3">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Valor Total</span>
                    <span className="font-mono font-bold text-base md:text-lg text-gray-950">
                      {os.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 no-print">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReceiptOS(os);
                      }}
                      className="p-1.5 text-gray-400 hover:text-frost-600 hover:bg-gray-50 rounded border border-gray-100"
                      title="Visualizar Detalhes / Ficha de Impressão"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleOpenEdit(os, e)}
                      className="p-1.5 text-gray-400 hover:text-frost-600 hover:bg-gray-50 rounded border border-gray-100"
                      title="Editar OS"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(os.id, e)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent"
                      title="Excluir OS"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit OS Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8 overflow-hidden animate-slide-up">
            <div className="bg-frost-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-frost-200" />
                {editingOS ? `Editar Ordem de Serviço ${editingOS.id}` : 'Registrar Abertura de Ordem de Serviço'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-frost-200 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Col 1: Client & Equipment */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
                    1. Dados do Cliente & Equipamento
                  </h4>

                  {/* Cliente */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Cliente Solicitante *</label>
                    <select
                      required
                      value={clienteId}
                      onChange={(e) => {
                        setClienteId(e.target.value);
                        setEquipamentoId(''); // Reset appliance link on client swap
                      }}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>

                  {/* Equipamento */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Equipamento para Reparo *</label>
                    <select
                      required
                      value={equipamentoId}
                      onChange={(e) => setEquipamentoId(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                      <option value="">-- Selecione o aparelho --</option>
                      {availableEquipments.map(eq => (
                        <option key={eq.id} value={eq.id}>
                          {eq.tipo} ({eq.marca} • {eq.capacidade} - {eq.localizacao})
                        </option>
                      ))}
                    </select>
                    {availableEquipments.length === 0 && clienteId && (
                      <span className="text-[10px] text-amber-600 block mt-1 italic">
                        ⚠️ Este cliente não possui aparelhos cadastrados. Cadastre na aba Equipamentos para poder vinculá-lo aqui.
                      </span>
                    )}
                  </div>

                  {/* Técnico Responsável */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Técnico Responsável *</label>
                    <select
                      required
                      value={tecnicoResponsavel}
                      onChange={(e) => setTecnicoResponsavel(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                      {TECNICOS_PRESET.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Col 2: Diagnosis & Status */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
                    2. Diagnóstico & Situação
                  </h4>

                   {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 font-bold text-frost-600">Status Operacional</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as OSStatus)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-semibold text-gray-800"
                    >
                      {isOrcamentosMode ? (
                        <>
                          <option value="orcamento">Orçamento preliminar</option>
                          <option value="aprovado">Aprovar Orçamento (Mover para OS)</option>
                          <option value="cancelado">Cancelado</option>
                        </>
                      ) : (
                        <>
                          <option value="aprovado">Aprovado pelo Cliente</option>
                          <option value="em_andamento">Em Execução Técnico</option>
                          <option value="concluido">Concluída & Faturada</option>
                          <option value="cancelado">Cancelada</option>
                          <option value="orcamento">Mover de volta para Orçamento</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Descrição Problema */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Reclamação do Cliente / Problema Relatado *</label>
                    <textarea
                      required
                      value={descricaoProblema}
                      onChange={(e) => setDescricaoProblema(e.target.value)}
                      placeholder="Ex: Ar liga mas não gela. Apitando de 5 em 5 minutos."
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>

                  {/* Descrição Serviço realizado */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Parecer Técnico / Serviço Executado</label>
                    <textarea
                      value={descricaoServico}
                      onChange={(e) => setDescricaoServico(e.target.value)}
                      placeholder="Ex: Identificado capacitor estufado na condensadora. Efetuada a troca e limpeza dos filtros."
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>

                  {/* Foto Upload Simulation */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Fotos do Atendimento / Equipamento</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Cole a URL de uma foto do equipamento ou clique nos atalhos"
                        id="foto-url-input"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-frost-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              setFotos([...fotos, val]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('foto-url-input') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            setFotos([...fotos, input.value.trim()]);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-frost-600 hover:bg-frost-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Anexar
                      </button>
                    </div>

                    {/* Pre-set simulated buttons for realistic HVAC repair photos */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setFotos([...fotos, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'])}
                        className="text-[10px] text-frost-700 bg-frost-50 hover:bg-frost-100 rounded px-2.5 py-1.5 font-semibold border border-frost-100 transition-colors"
                      >
                        + Foto Ar Split/Evaporadora
                      </button>
                      <button
                        type="button"
                        onClick={() => setFotos([...fotos, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'])}
                        className="text-[10px] text-frost-700 bg-frost-50 hover:bg-frost-100 rounded px-2.5 py-1.5 font-semibold border border-frost-100 transition-colors"
                      >
                        + Foto Diagnóstico/Técnico
                      </button>
                      <button
                        type="button"
                        onClick={() => setFotos([...fotos, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60'])}
                        className="text-[10px] text-frost-700 bg-frost-50 hover:bg-frost-100 rounded px-2.5 py-1.5 font-semibold border border-frost-100 transition-colors"
                      >
                        + Foto Manômetro/Insumos
                      </button>
                    </div>

                    {/* Photo Thumbnails */}
                    {fotos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {fotos.map((f, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                            <img src={f} className="w-full h-full object-cover" alt="Atendimento" />
                            <button
                              type="button"
                              onClick={() => setFotos(fotos.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                              title="Remover foto"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Parts & Materials Section */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
                  3. Peças Utilizadas & Peças de Reposição
                </h4>

                {/* Grid for adding a part */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 items-end">
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nome da Peça/Material</label>
                    <input
                      type="text"
                      value={tempPecaNome}
                      onChange={(e) => setTempPecaNome(e.target.value)}
                      placeholder="Ex: Capacitor de Partida 45Mfd 450V"
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Quantidade</label>
                    <input
                      type="number"
                      min={1}
                      value={tempPecaQtd}
                      onChange={(e) => setTempPecaQtd(parseInt(e.target.value) || 1)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Preço Unitário (R$)</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={tempPecaValor}
                      onChange={(e) => setTempPecaValor(parseFloat(e.target.value) || 0)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={handleAddPeca}
                      className="w-full flex items-center justify-center p-2.5 bg-frost-600 hover:bg-frost-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Listed parts */}
                {pecas.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nenhuma peça adicionada para esta ordem de serviço.</p>
                ) : (
                  <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-100 text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2.5 text-left font-semibold text-gray-600 uppercase">Peça / Material</th>
                          <th className="px-4 py-2.5 text-center font-semibold text-gray-600 uppercase">Qtd</th>
                          <th className="px-4 py-2.5 text-right font-semibold text-gray-600 uppercase">Unitário</th>
                          <th className="px-4 py-2.5 text-right font-semibold text-gray-600 uppercase">Subtotal</th>
                          <th className="px-4 py-2.5 text-center font-semibold text-gray-600 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {pecas.map((peca, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2.5 text-gray-800 font-medium">{peca.nome}</td>
                            <td className="px-4 py-2.5 text-center font-mono">{peca.quantidade}</td>
                            <td className="px-4 py-2.5 text-right font-mono">
                              {peca.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono font-semibold">
                              {(peca.quantidade * peca.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePeca(idx)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pricing, Labor & Payment Row */}
              <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Labor Value */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mão de Obra / Serviço (R$)</label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xs font-bold font-mono">R$</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      required
                      value={valorMaoDeObra}
                      onChange={(e) => setValorMaoDeObra(parseFloat(e.target.value) || 0)}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-frost-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment form */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Forma de Pagamento {status === 'concluido' && '*'}
                  </label>
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value as OrdemServico['formaPagamento'])}
                    disabled={status !== 'concluido'}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="pix">PIX Instantâneo</option>
                    <option value="dinheiro">Dinheiro em Espécie</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="faturado">Boleto Faturado (Contrato)</option>
                  </select>
                </div>

                {/* Grand Total Live Math */}
                <div className="bg-frost-50 border border-frost-100 p-4 rounded-xl flex justify-between items-center md:h-16">
                  <div>
                    <span className="block text-[10px] text-frost-600 uppercase font-bold">Total Calculado</span>
                    <span className="text-xs text-gray-400">Peças + Mão de Obra</span>
                  </div>
                  <span className="text-xl font-bold font-mono text-frost-900 leading-none">
                    {liveGrandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
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
                  Salvar Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Sheet View Overlay Modal */}
      {activeReceiptOS && (() => {
        const client = clientes.find(c => c.id === activeReceiptOS.clienteId);
        const rawPhone = client?.telefone ? client.telefone.replace(/\D/g, '') : '';
        const clientPhone = rawPhone.length <= 11 ? '55' + rawPhone : rawPhone;
        const whatsappMsg = `Olá, ${client?.nome}! Segue o link de acompanhamento/laudo da Ordem de Serviço ${activeReceiptOS.id} da empresa ${companySettings.nomeEmpresa}.\n\n*Serviço:* ${activeReceiptOS.descricaoProblema}\n*Valor Total:* ${activeReceiptOS.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n*Status:* ${getStatusLabel(activeReceiptOS.status)}\n*Técnico Responsável:* ${activeReceiptOS.tecnicoResponsavel}\n\nAgradecemos a sua preferência!`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${clientPhone}&text=${encodeURIComponent(whatsappMsg)}`;

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in no-print">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 overflow-hidden animate-slide-up flex flex-col h-[90vh]">
              <div className="bg-frost-900 text-white p-4 flex justify-between items-center shrink-0">
                <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                  <Printer className="w-5 h-5 text-frost-200" />
                  Ficha de Impressão de OS
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                    title="Enviar Laudo para o WhatsApp do cliente"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Enviar WhatsApp
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-frost-500 hover:bg-frost-600 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimir Ficha (PDF)
                  </button>
                  <button
                    onClick={() => setActiveReceiptOS(null)}
                    className="text-white hover:text-frost-200 p-1 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Print Sheet Area */}
              <div className="p-8 space-y-6 overflow-y-auto bg-white text-gray-900 text-sm print-view font-sans">
                
                {/* Header Invoice Brand */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-gray-900 pb-4">
                  <div>
                    <h1 className="text-3xl font-display font-black tracking-tight text-frost-900 uppercase">{companySettings.nomeEmpresa}</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Ar Condicionado & Refrigeração Comercial</p>
                    <p className="text-xs text-gray-600 mt-1">CNPJ: {companySettings.cnpj} | Tel: {companySettings.telefone}</p>
                    <p className="text-xs text-gray-600">{companySettings.endereco} • {companySettings.cidade}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{companySettings.creaNumero}</p>
                  </div>
                  <div className="text-left sm:text-right border-l-4 sm:border-l-0 sm:border-r-4 border-frost-500 pl-4 sm:pl-0 sm:pr-4">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Documento Auxiliar</span>
                    <h2 className="text-xl font-bold font-mono text-gray-950">{activeReceiptOS.id}</h2>
                    <span className="text-xs text-gray-500">Status: <strong>{getStatusLabel(activeReceiptOS.status).toUpperCase()}</strong></span>
                    <p className="text-xs text-gray-500 mt-0.5">Emissão: {activeReceiptOS.dataAbertura}</p>
                    {activeReceiptOS.dataFechamento && (
                      <p className="text-xs text-gray-500">Conclusão: {activeReceiptOS.dataFechamento}</p>
                    )}
                  </div>
                </div>

                {/* Client & Device Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {/* Client Info */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Dados do Contratante</h3>
                    {(() => {
                      if (!client) return <p className="text-xs text-gray-400">Cliente não localizado.</p>;
                      return (
                        <>
                          <p className="font-bold text-gray-950 text-base">{client.nome}</p>
                          <p className="text-xs text-gray-700"><strong>Doc:</strong> {client.documento || 'Não Informado'}</p>
                          <p className="text-xs text-gray-700"><strong>Tel:</strong> {client.telefone}</p>
                          <p className="text-xs text-gray-700"><strong>Endereço:</strong> {client.endereco}, {client.cidade}</p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Device Info */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Equipamento Avaliado</h3>
                    {(() => {
                      const eq = equipamentos.find(item => item.id === activeReceiptOS.equipamentoId);
                      if (!eq) return <p className="text-xs text-gray-400 italic">Nenhum aparelho específico vinculado.</p>;
                      return (
                        <>
                          <p className="font-bold text-gray-950 text-base">{eq.tipo}</p>
                          <p className="text-xs text-gray-700"><strong>Marca / Modelo:</strong> {eq.marca} • {eq.modelo}</p>
                          <p className="text-xs text-gray-700"><strong>Capacidade:</strong> {eq.capacidade}</p>
                          <p className="text-xs text-gray-700"><strong>Série:</strong> <span className="font-mono">{eq.numeroSerie}</span> • <strong>Local:</strong> {eq.localizacao || 'Recepção'}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Service Details Section */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider border-b border-gray-200 pb-1">Descrição Técnico-Operacional</h3>
                  <div className="space-y-2">
                    <div className="bg-amber-50/50 p-3 rounded border border-amber-100">
                      <strong className="block text-xs text-amber-900 uppercase">Defeito Relatado / Ocorrência:</strong>
                      <p className="text-sm text-gray-800 leading-relaxed italic mt-1">"{activeReceiptOS.descricaoProblema}"</p>
                    </div>

                    {activeReceiptOS.descricaoServico && (
                      <div className="bg-emerald-50/50 p-3 rounded border border-emerald-100">
                        <strong className="block text-xs text-emerald-900 uppercase">Laudo Técnico / Serviço Realizado:</strong>
                        <p className="text-sm text-gray-800 leading-relaxed mt-1">{activeReceiptOS.descricaoServico}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parts & labor items */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider border-b border-gray-200 pb-1 text-left">Peças, Componentes e Insumos Utilizados</h3>
                  {activeReceiptOS.pecas.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Nenhum material de reposição faturado nesta OS.</p>
                  ) : (
                    <table className="min-w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-gray-300 font-bold text-gray-700">
                          <th className="py-2">Item / Descrição</th>
                          <th className="py-2 text-center">Quant.</th>
                          <th className="py-2 text-right">Valor Unit.</th>
                          <th className="py-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {activeReceiptOS.pecas.map((peca, idx) => (
                          <tr key={idx}>
                            <td className="py-2 text-gray-800 font-medium">{peca.nome}</td>
                            <td className="py-2 text-center font-mono">{peca.quantidade}</td>
                            <td className="py-2 text-right font-mono">{peca.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="py-2 text-right font-mono font-semibold">{(peca.quantidade * peca.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Summary totals */}
                <div className="border-t border-gray-300 pt-4 flex flex-col items-end space-y-1.5 text-right font-mono text-sm">
                  <div>
                    <span className="text-gray-500">Mão de Obra / Visita:</span>{' '}
                    <span className="font-bold text-gray-800">{activeReceiptOS.valorMaoDeObra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Subtotal Peças:</span>{' '}
                    <span className="font-bold text-gray-800">{calculatePartsTotal(activeReceiptOS.pecas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="border-t-2 border-gray-900 pt-1.5 text-base font-bold text-frost-900">
                    <span>Valor Total:</span>{' '}
                    <span>{activeReceiptOS.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  {activeReceiptOS.formaPagamento && (
                    <div className="text-xs text-gray-500 font-sans mt-2">
                      Faturamento via: <strong>{activeReceiptOS.formaPagamento.toUpperCase().replace('_', ' ')}</strong>
                    </div>
                  )}
                </div>

                {/* Photos Section */}
                {activeReceiptOS.fotos && activeReceiptOS.fotos.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider text-left">Registro Fotográfico de Campo</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {activeReceiptOS.fotos.map((foto, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 aspect-video">
                          <img src={foto} className="w-full h-full object-cover" alt={`Evidência ${idx + 1}`} referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature Blocks */}
                <div className="grid grid-cols-2 gap-12 pt-12 border-t border-dashed border-gray-200 text-center text-xs text-gray-600 items-end">
                  <div className="space-y-1 flex flex-col items-center">
                    <div className="border-b border-gray-400 w-4/5 mx-auto h-12 flex items-center justify-center font-mono italic text-slate-400 text-[10px]">
                      {companySettings.creaNumero}
                    </div>
                    <p className="font-bold text-gray-800 mt-2">{activeReceiptOS.tecnicoResponsavel}</p>
                    <p>Técnico de Climatização</p>
                  </div>
                  
                  <div className="space-y-1 flex flex-col items-center">
                    {/* Interactive signature canvas */}
                    <SignaturePad />
                    <div className="border-t border-gray-400 w-4/5 mx-auto mt-2" />
                    <p className="font-bold text-gray-800">Assinatura do Cliente</p>
                    <p>De acordo com o Laudo e Valores</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
