import { Cliente, Equipamento, Agendamento, OrdemServico, TransacaoFinanceira } from './types';

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    nome: 'Clínica Odontológica Sorriso',
    documento: '45.123.897/0001-22',
    telefone: '(11) 98765-4321',
    email: 'contato@sorrisoclinica.com.br',
    endereco: 'Av. Paulista, 1200, Conj 42 - Bela Vista',
    cep: '01310-100',
    cidade: 'São Paulo - SP',
    notas: 'Clínica médica, ideal realizar serviços aos sábados ou fora do horário comercial (após 19:00).',
    dataCriacao: '2026-01-10'
  },
  {
    id: 'cli-2',
    nome: 'Carlos Eduardo Santos',
    documento: '321.456.987-10',
    telefone: '(11) 99122-3344',
    email: 'cadu.santos@gmail.com',
    endereco: 'Rua das Flores, 45, Bloco B, Apto 102 - Pinheiros',
    cep: '05400-000',
    cidade: 'São Paulo - SP',
    notas: 'Cliente residencial de longa data. Sempre higieniza os equipamentos anualmente antes do verão.',
    dataCriacao: '2026-02-15'
  },
  {
    id: 'cli-3',
    nome: 'Supermercado Central',
    documento: '12.890.345/0001-90',
    telefone: '(11) 3456-7890',
    email: 'manutencao@centralmercado.com.br',
    endereco: 'Rua Augusta, 2400 - Consolação',
    cep: '01418-100',
    cidade: 'São Paulo - SP',
    notas: 'Exige relatórios detalhados de PMOC. Contrato de manutenção mensal ativo.',
    dataCriacao: '2026-03-01'
  },
  {
    id: 'cli-4',
    nome: 'Ana Paula Rodrigues',
    documento: '289.123.456-08',
    telefone: '(11) 97788-9900',
    email: 'ana.paula@outlook.com',
    endereco: 'Rua Pamplona, 820 - Jardim Paulista',
    cep: '01405-001',
    cidade: 'São Paulo - SP',
    dataCriacao: '2026-05-20'
  }
];

export const INITIAL_EQUIPAMENTOS: Equipamento[] = [
  {
    id: 'eq-1',
    clienteId: 'cli-1',
    tipo: 'Ar Condicionado Split Hi-Wall',
    marca: 'LG',
    modelo: 'Dual Inverter Voice',
    numeroSerie: 'LG-982173-B',
    capacidade: '12.000 BTU',
    localizacao: 'Recepção Principal',
    dataInstalacao: '2026-01-12',
    ultimaManutencao: '2026-06-15'
  },
  {
    id: 'eq-2',
    clienteId: 'cli-1',
    tipo: 'Ar Condicionado Split Cassete',
    marca: 'Carrier',
    modelo: 'XPower Inverter',
    numeroSerie: 'CAR-349811-X',
    capacidade: '36.000 BTU',
    localizacao: 'Sala de Cirurgia A',
    dataInstalacao: '2026-01-15',
    ultimaManutencao: '2026-06-15'
  },
  {
    id: 'eq-3',
    clienteId: 'cli-2',
    tipo: 'Ar Condicionado Split Hi-Wall',
    marca: 'Samsung',
    modelo: 'WindFree Connect',
    numeroSerie: 'SAM-110293-W',
    capacidade: '9.000 BTU',
    localizacao: 'Suíte Master',
    dataInstalacao: '2026-02-20',
    ultimaManutencao: '2026-02-20'
  },
  {
    id: 'eq-4',
    clienteId: 'cli-3',
    tipo: 'Câmara Fria Comercial',
    marca: 'Elgin',
    modelo: 'Trio Compact',
    numeroSerie: 'ELG-C45091-M',
    capacidade: '5 HP (Refrigeração)',
    localizacao: 'Câmara de Carnes',
    dataInstalacao: '2026-03-05',
    ultimaManutencao: '2026-06-25'
  },
  {
    id: 'eq-5',
    clienteId: 'cli-3',
    tipo: 'Ar Condicionado Split Piso Teto',
    marca: 'Midea',
    modelo: 'Liva',
    numeroSerie: 'MID-772911-Y',
    capacidade: '48.000 BTU',
    localizacao: 'Área de Caixas',
    dataInstalacao: '2026-03-05',
    ultimaManutencao: '2026-05-10'
  }
];

export const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: 'age-1',
    clienteId: 'cli-1',
    equipamentoId: 'eq-1',
    titulo: 'Higienização periódica',
    descricao: 'Realizar limpeza química dos filtros, turbina e bandeja de condensado. Aplicar bactericida spray.',
    data: '2026-07-04',
    horaInicio: '09:00',
    horaFim: '10:30',
    status: 'agendado',
    tipoServico: 'higienizacao',
    tecnico: 'Felipe Santos'
  },
  {
    id: 'age-2',
    clienteId: 'cli-3',
    equipamentoId: 'eq-4',
    titulo: 'Manutenção preventiva mensal',
    descricao: 'Verificar pressão do gás refrigerante R404A, reaperto de conexões elétricas e limpeza do condensador.',
    data: '2026-07-04',
    horaInicio: '14:00',
    horaFim: '16:00',
    status: 'agendado',
    tipoServico: 'manutencao_preventiva',
    tecnico: 'Rodrigo Lima'
  },
  {
    id: 'age-3',
    clienteId: 'cli-2',
    equipamentoId: 'eq-3',
    titulo: 'Reinstalação de dreno',
    descricao: 'Corrigir gotejamento interno no quarto. Refazer caimento do tubo de dreno externo.',
    data: '2026-07-03',
    horaInicio: '10:00',
    horaFim: '11:30',
    status: 'concluido',
    tipoServico: 'manutencao_corretiva',
    tecnico: 'Felipe Santos'
  },
  {
    id: 'age-4',
    clienteId: 'cli-4',
    titulo: 'Visita técnica para orçamento',
    descricao: 'Avaliar local para futura infraestrutura de 3 splits hi-wall de 12.000 BTU no apartamento novo.',
    data: '2026-07-05',
    horaInicio: '11:00',
    horaFim: '12:00',
    status: 'agendado',
    tipoServico: 'visita_tecnica',
    tecnico: 'Rodrigo Lima'
  },
  {
    id: 'age-5',
    clienteId: 'cli-3',
    equipamentoId: 'eq-5',
    titulo: 'Higienização de Piso Teto',
    descricao: 'Higienização completa na serpentina do evaporador e revisão dos motores de ventilação.',
    data: '2026-07-03',
    horaInicio: '15:00',
    horaFim: '17:30',
    status: 'em_andamento',
    tipoServico: 'higienizacao',
    tecnico: 'Rodrigo Lima'
  }
];

export const INITIAL_ORDENS_SERVICO: OrdemServico[] = [
  {
    id: 'OS-2026-0001',
    clienteId: 'cli-2',
    equipamentoId: 'eq-3',
    dataAbertura: '2026-07-03',
    dataFechamento: '2026-07-03',
    status: 'concluido',
    descricaoProblema: 'Vazamento de água pela evaporadora (gotejamento interno).',
    descricaoServico: 'Desobstrução do dreno de água condensada e reinstalação da mangueira com caimento correto. Testado vazão de água com sucesso.',
    pecas: [
      { nome: 'Tubo Isolante Térmico Blindado 1/4', quantidade: 1, valorUnitario: 15.00 },
      { nome: 'Mangueira de dreno cristal', quantidade: 2, valorUnitario: 8.50 }
    ],
    valorMaoDeObra: 180.00,
    valorTotal: 212.00,
    tecnicoResponsavel: 'Felipe Santos',
    formaPagamento: 'pix'
  },
  {
    id: 'OS-2026-0002',
    clienteId: 'cli-1',
    equipamentoId: 'eq-2',
    dataAbertura: '2026-06-28',
    dataFechamento: '2026-06-29',
    status: 'concluido',
    descricaoProblema: 'Aparelho liga, mas não resfria o consultório. Código de erro E3 no painel.',
    descricaoServico: 'Identificado sensor de temperatura defeituoso. Substituição do sensor, carga de gás parcial e limpeza dos contatos elétricos.',
    pecas: [
      { nome: 'Sensor de temperatura 10K Carrier', quantidade: 1, valorUnitario: 45.00 },
      { nome: 'Carga de Gás refrigerante R410A (Kg)', quantidade: 0.8, valorUnitario: 120.00 }
    ],
    valorMaoDeObra: 250.00,
    valorTotal: 391.00,
    tecnicoResponsavel: 'Rodrigo Lima',
    formaPagamento: 'faturado'
  },
  {
    id: 'OS-2026-0003',
    clienteId: 'cli-3',
    equipamentoId: 'eq-4',
    dataAbertura: '2026-07-02',
    status: 'em_andamento',
    descricaoProblema: 'Ventilador do condensador externo fazendo barulho metálico excessivo.',
    descricaoServico: 'Substituição das buchas de rolamento do motor ventilador. Peça em trânsito para instalação.',
    pecas: [
      { nome: 'Motor Ventilador Elgin 5HP', quantidade: 1, valorUnitario: 480.00 }
    ],
    valorMaoDeObra: 350.00,
    valorTotal: 830.00,
    tecnicoResponsavel: 'Rodrigo Lima'
  },
  {
    id: 'OS-2026-0004',
    clienteId: 'cli-4',
    equipamentoId: '',
    dataAbertura: '2026-07-03',
    status: 'orcamento',
    descricaoProblema: 'Solicitação de orçamento para instalação de ar condicionado completo (infraestrutura pronta).',
    pecas: [
      { nome: 'Suporte de condensadora reforçado', quantidade: 1, valorUnitario: 65.00 },
      { nome: 'Fita vinílica e parafusos', quantidade: 1, valorUnitario: 25.00 }
    ],
    valorMaoDeObra: 450.00,
    valorTotal: 540.00,
    tecnicoResponsavel: 'Felipe Santos'
  }
];

export const INITIAL_TRANSACÕES: TransacaoFinanceira[] = [
  {
    id: 'fin-1',
    tipo: 'receita',
    descricao: 'OS-2026-0001 - Reinstalação de dreno (Carlos Eduardo)',
    valor: 212.00,
    data: '2026-07-03',
    categoria: 'servico',
    referenciaOSId: 'OS-2026-0001'
  },
  {
    id: 'fin-2',
    tipo: 'receita',
    descricao: 'OS-2026-0002 - Substituição de sensor (Clínica Sorriso)',
    valor: 391.00,
    data: '2026-06-29',
    categoria: 'servico',
    referenciaOSId: 'OS-2026-0002'
  },
  {
    id: 'fin-3',
    tipo: 'despesa',
    descricao: 'Compra de Ferramentas - Cortador de Tubo de Cobre Pro',
    valor: 145.00,
    data: '2026-06-28',
    categoria: 'ferramentas'
  },
  {
    id: 'fin-4',
    tipo: 'despesa',
    descricao: 'Gasolina da Fiorino (Visitas Técnicas)',
    valor: 220.00,
    data: '2026-07-01',
    categoria: 'transporte'
  },
  {
    id: 'fin-5',
    tipo: 'receita',
    descricao: 'Mensalidade Contrato PMOC - Supermercado Central',
    valor: 1500.00,
    data: '2026-06-30',
    categoria: 'servico'
  },
  {
    id: 'fin-6',
    tipo: 'despesa',
    descricao: 'Estoque de Peças - Sensores, capacitores e fita vinílica',
    valor: 350.00,
    data: '2026-06-25',
    categoria: 'pecas'
  },
  {
    id: 'fin-7',
    tipo: 'receita',
    descricao: 'Instalação de Split 9000 BTU - Dr. Rafael',
    valor: 650.00,
    data: '2026-06-24',
    categoria: 'servico'
  },
  {
    id: 'fin-8',
    tipo: 'despesa',
    descricao: 'Anúncios locais Instagram/Facebook Clima Frio',
    valor: 100.00,
    data: '2026-06-20',
    categoria: 'marketing'
  },
  {
    id: 'fin-9',
    tipo: 'receita',
    descricao: 'Higienização de 4 Splits - Residencial Pinheiros',
    valor: 800.00,
    data: '2026-07-02',
    categoria: 'servico'
  },
  {
    id: 'fin-10',
    tipo: 'despesa',
    descricao: 'Imposto Simples Nacional (Junho)',
    valor: 240.00,
    data: '2026-06-20',
    categoria: 'impostos'
  }
];
