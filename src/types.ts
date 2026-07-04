export interface Cliente {
  id: string;
  nome: string;
  documento: string; // CPF ou CNPJ
  cpf?: string; // CPF compatibility
  telefone: string;
  email: string;
  endereco: string;
  cep: string;
  cidade: string;
  notas?: string;
  observacoes?: string; // notes compatibility
  dataCriacao: string;
  dataCadastro?: string; // date compatibility
}

export interface Equipamento {
  id: string;
  clienteId: string;
  tipo: string; // Ex: Ar Condicionado Split, Cassete, Geladeira, etc.
  marca: string; // Ex: Samsung, LG, Carrier, Midea
  modelo: string;
  numeroSerie: string;
  capacidade: string; // Ex: 9000 BTU, 12000 BTU, 18000 BTU
  btus?: string; // Ex: 9000, 12000, 18000
  gas?: string; // Ex: R410A, R22, R32
  tensao?: string; // Ex: 220V, 110V, 380V
  localizacao?: string; // Ex: Sala de estar, Quarto
  dataInstalacao?: string;
  ultimaManutencao?: string;
  proximaManutencao?: string;
}

export type ServicoTipo = 'instalacao' | 'manutencao_preventiva' | 'manutencao_corretiva' | 'higienizacao' | 'visita_tecnica';

export interface Agendamento {
  id: string;
  clienteId: string;
  equipamentoId?: string;
  titulo: string;
  descricao: string;
  data: string; // YYYY-MM-DD
  horaInicio: string; // HH:MM
  horaFim: string; // HH:MM
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  tipoServico: ServicoTipo;
  tecnico: string;
}

export type OSStatus = 'orcamento' | 'aprovado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface PecaUtilizada {
  nome: string;
  quantidade: number;
  valorUnitario: number;
}

export interface OrdemServico {
  id: string; // Formato: OS-XXXX
  clienteId: string;
  equipamentoId: string;
  dataAbertura: string;
  dataFechamento?: string;
  status: OSStatus;
  descricaoProblema: string;
  descricaoServico?: string;
  pecas: PecaUtilizada[];
  valorMaoDeObra: number;
  valorTotal: number;
  tecnicoResponsavel: string;
  formaPagamento?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'faturado';
  fotos?: string[];
  assinatura?: string;
}

export interface TransacaoFinanceira {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD
  categoria: 'servico' | 'pecas' | 'ferramentas' | 'transporte' | 'marketing' | 'impostos' | 'outros';
  referenciaOSId?: string; // Vinculado a uma OS
}
