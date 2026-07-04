import { useState, useEffect } from 'react';
import { Cliente, Equipamento, Agendamento, OrdemServico, TransacaoFinanceira } from '../models/types';
import { INITIAL_CLIENTES, INITIAL_EQUIPAMENTOS, INITIAL_AGENDAMENTOS, INITIAL_ORDENS_SERVICO, INITIAL_TRANSACÕES } from '../models/mockData';

// Safe localStorage loaders
const loadFromStorage = <T>(key: string, initial: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initial;
  } catch (e) {
    console.error('Error loading key: ' + key, e);
    return initial;
  }
};

const saveToStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving key: ' + key, e);
  }
};

export const useClimaFrioStore = () => {
  const [clientes, setClientes] = useState<Cliente[]>(() => loadFromStorage('cf_clientes', INITIAL_CLIENTES));
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(() => loadFromStorage('cf_equipamentos', INITIAL_EQUIPAMENTOS));
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => loadFromStorage('cf_agendamentos', INITIAL_AGENDAMENTOS));
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>(() => loadFromStorage('cf_ordens_servico', INITIAL_ORDENS_SERVICO));
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>(() => loadFromStorage('cf_transacoes', INITIAL_TRANSACÕES));

  // Sync state to localStorage on changes
  useEffect(() => { saveToStorage('cf_clientes', clientes); }, [clientes]);
  useEffect(() => { saveToStorage('cf_equipamentos', equipamentos); }, [equipamentos]);
  useEffect(() => { saveToStorage('cf_agendamentos', agendamentos); }, [agendamentos]);
  useEffect(() => { saveToStorage('cf_ordens_servico', ordensServico); }, [ordensServico]);
  useEffect(() => { saveToStorage('cf_transacoes', transacoes); }, [transacoes]);

  // CLIENTS ACTIONS
  const addCliente = (cliente: Omit<Cliente, 'id' | 'dataCriacao'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newCliente: Cliente = {
      ...cliente,
      id: `cli-${Date.now()}`,
      dataCriacao: today,
      dataCadastro: today,
      cpf: cliente.documento,
      observacoes: cliente.notas
    };
    setClientes(prev => [newCliente, ...prev]);
    return newCliente;
  };

  const updateCliente = (id: string, updated: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => {
      if (c.id === id) {
        const next = { ...c, ...updated };
        if (updated.documento !== undefined) next.cpf = updated.documento;
        if (updated.notas !== undefined) next.observacoes = updated.notas;
        return next;
      }
      return c;
    }));
  };

  const deleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    // Cascade delete or clean references optional, but better to keep references clean
    setEquipamentos(prev => prev.filter(e => e.clienteId !== id));
  };

  // EQUIPMENTS ACTIONS
  const addEquipamento = (eq: Omit<Equipamento, 'id'>) => {
    const newEq: Equipamento = {
      ...eq,
      id: `eq-${Date.now()}`,
      btus: eq.btus || eq.capacidade?.replace(/[^0-9]/g, '') || '12000',
      gas: eq.gas || 'R410A',
      tensao: eq.tensao || '220V',
      proximaManutencao: eq.proximaManutencao || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 6 months later
    };
    setEquipamentos(prev => [newEq, ...prev]);
    return newEq;
  };

  const updateEquipamento = (id: string, updated: Partial<Equipamento>) => {
    setEquipamentos(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteEquipamento = (id: string) => {
    setEquipamentos(prev => prev.filter(e => e.id !== id));
  };

  // AGENDA ACTIONS
  const addAgendamento = (ag: Omit<Agendamento, 'id'>) => {
    const newAg: Agendamento = {
      ...ag,
      id: `age-${Date.now()}`
    };
    setAgendamentos(prev => [newAg, ...prev]);
    return newAg;
  };

  const updateAgendamento = (id: string, updated: Partial<Agendamento>) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const deleteAgendamento = (id: string) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
  };

  // OS ACTIONS
  const addOrdemServico = (os: Omit<OrdemServico, 'id' | 'dataAbertura'>) => {
    const year = new Date().getFullYear();
    const count = ordensServico.length + 1;
    const formattedId = `OS-${year}-${String(count).padStart(4, '0')}`;
    const newOS: OrdemServico = {
      ...os,
      id: formattedId,
      dataAbertura: new Date().toISOString().split('T')[0]
    };
    setOrdensServico(prev => [newOS, ...prev]);

    // If OS is created with status "concluido", automatically add a financial transaction
    if (newOS.status === 'concluido') {
      const client = clientes.find(c => c.id === os.clienteId);
      addTransacao({
        tipo: 'receita',
        descricao: `${formattedId} - ${os.descricaoProblema.slice(0, 30)}... (${client?.nome || 'Cliente'})`,
        valor: os.valorTotal,
        data: new Date().toISOString().split('T')[0],
        categoria: 'servico',
        referenciaOSId: formattedId
      });
    }

    return newOS;
  };

  const updateOrdemServico = (id: string, updated: Partial<OrdemServico>) => {
    let wasConcluido = false;
    let becameConcluido = false;
    let oldOS: OrdemServico | undefined;

    setOrdensServico(prev => {
      return prev.map(os => {
        if (os.id === id) {
          oldOS = os;
          wasConcluido = os.status === 'concluido';
          becameConcluido = updated.status === 'concluido' && !wasConcluido;
          
          const updatedOS: OrdemServico = {
            ...os,
            ...updated,
            dataFechamento: updated.status === 'concluido' && !os.dataFechamento
              ? new Date().toISOString().split('T')[0]
              : os.dataFechamento
          };
          return updatedOS;
        }
        return os;
      });
    });

    // Handle financial entry sync when OS state completes
    if (becameConcluido && oldOS) {
      const client = clientes.find(c => c.id === (updated.clienteId || oldOS?.clienteId));
      const val = updated.valorTotal !== undefined ? updated.valorTotal : oldOS.valorTotal;
      const desc = updated.descricaoProblema !== undefined ? updated.descricaoProblema : oldOS.descricaoProblema;

      // Check if transaction already exists for this OS
      const exists = transacoes.some(t => t.referenciaOSId === id);
      if (!exists) {
        addTransacao({
          tipo: 'receita',
          descricao: `${id} - ${desc.slice(0, 30)}... (${client?.nome || 'Cliente'})`,
          valor: val,
          data: new Date().toISOString().split('T')[0],
          categoria: 'servico',
          referenciaOSId: id
        });
      }
    }
  };

  const deleteOrdemServico = (id: string) => {
    setOrdensServico(prev => prev.filter(o => o.id !== id));
    // Remove financial transaction linked to it
    setTransacoes(prev => prev.filter(t => t.referenciaOSId !== id));
  };

  // FINANCE ACTIONS
  const addTransacao = (tr: Omit<TransacaoFinanceira, 'id'>) => {
    const newTr: TransacaoFinanceira = {
      ...tr,
      id: `fin-${Date.now()}`
    };
    setTransacoes(prev => [newTr, ...prev]);
    return newTr;
  };

  const updateTransacao = (id: string, updated: Partial<TransacaoFinanceira>) => {
    setTransacoes(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTransacao = (id: string) => {
    setTransacoes(prev => prev.filter(t => t.id !== id));
  };

  // Reset to initial mock data (useful button for testing)
  const resetToFactoryDefault = () => {
    if (window.confirm('Deseja realmente resetar todos os dados para os valores padrão de fábrica? Isso apagará suas alterações.')) {
      setClientes(INITIAL_CLIENTES);
      setEquipamentos(INITIAL_EQUIPAMENTOS);
      setAgendamentos(INITIAL_AGENDAMENTOS);
      setOrdensServico(INITIAL_ORDENS_SERVICO);
      setTransacoes(INITIAL_TRANSACÕES);
    }
  };

  return {
    clientes,
    equipamentos,
    agendamentos,
    ordensServico,
    transacoes,
    addCliente,
    updateCliente,
    deleteCliente,
    addEquipamento,
    updateEquipamento,
    deleteEquipamento,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    addOrdemServico,
    updateOrdemServico,
    deleteOrdemServico,
    addTransacao,
    updateTransacao,
    deleteTransacao,
    resetToFactoryDefault
  };
};

export type ClimaFrioStore = ReturnType<typeof useClimaFrioStore>;
export type StoreContextType = ReturnType<typeof useClimaFrioStore>;
