import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, Plus, Edit, Trash2, Search, Clock, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';
import type { User } from '@/app/App';
import type { Cliente } from '@/app/components/Clientes';

interface Servico {
  id: number;
  descricao: string;
  preco: number;
  disponivel: boolean;
  categoria: string;
}

interface Compromisso {
  id: number;
  clienteId: number;
  clienteNome?: string;
  servicoId: number;
  servicoNome?: string;
  data: string;
  hora: string;
  status: 'agendado' | 'cumprido' | 'naoCumprido';
  justificativa?: string;
}

interface AgendaCompromissosProps {
  user: User;
}

export default function AgendaCompromissos({ user }: AgendaCompromissosProps) {
  const [visualizacao, setVisualizacao] = useState<'lista' | 'calendario'>('lista');
  const [busca, setBusca] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarJustificativa, setMostrarJustificativa] = useState(false);
  const [editando, setEditando] = useState<Compromisso | null>(null);
  const [compromissoAtual, setCompromissoAtual] = useState<Compromisso | null>(null);
  
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [mostrarNovoCliente, setMostrarNovoCliente] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    // Carregar clientes
    const savedClientes = localStorage.getItem('agendaMeiClientes');
    if (savedClientes) {
      setClientes(JSON.parse(savedClientes));
    }

    // Carregar serviços
    const savedServicos = localStorage.getItem('agendaMeiServicos');
    if (savedServicos) {
      setServicos(JSON.parse(savedServicos));
    }

    // Carregar compromissos
    const savedCompromissos = localStorage.getItem('agendaMeiCompromissos');
    if (savedCompromissos) {
      setCompromissos(JSON.parse(savedCompromissos));
    } else {
      // Dados iniciais de exemplo
      const compromissosIniciais = [
        { id: 1, clienteId: 1, clienteNome: 'Maria Santos', servicoId: 1, servicoNome: 'Corte de Cabelo', data: '2026-01-30', hora: '14:00', status: 'agendado' as const },
        { id: 2, clienteId: 2, clienteNome: 'Pedro Oliveira', servicoId: 2, servicoNome: 'Manutenção Elétrica', data: '2026-01-31', hora: '09:30', status: 'agendado' as const },
        { id: 3, clienteId: 3, clienteNome: 'Ana Costa', servicoId: 3, servicoNome: 'Consultoria', data: '2026-02-01', hora: '16:00', status: 'agendado' as const },
      ];
      setCompromissos(compromissosIniciais);
      localStorage.setItem('agendaMeiCompromissos', JSON.stringify(compromissosIniciais));
    }
  }, []);

  // Salvar compromissos no localStorage
  useEffect(() => {
    if (compromissos.length > 0) {
      localStorage.setItem('agendaMeiCompromissos', JSON.stringify(compromissos));
    }
  }, [compromissos]);

  const compromissosFiltrados = compromissos.filter(c => {
    const clienteNome = clientes.find(cli => cli.id === c.clienteId)?.nome || c.clienteNome || '';
    const servicoNome = servicos.find(s => s.id === c.servicoId)?.descricao || c.servicoNome || '';
    return clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
           servicoNome.toLowerCase().includes(busca.toLowerCase());
  });

  const handleNovoCompromisso = () => {
    setEditando(null);
    setMostrarModal(true);
  };

  const handleEditarCompromisso = (compromisso: Compromisso) => {
    setEditando(compromisso);
    setMostrarModal(true);
  };

  const handleExcluirCompromisso = (id: number) => {
    if (confirm('Deseja realmente excluir este compromisso?')) {
      setCompromissos(compromissos.filter(c => c.id !== id));
    }
  };

  const handleSalvarCompromisso = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const clienteId = parseInt(formData.get('clienteId') as string);
    const servicoId = parseInt(formData.get('servicoId') as string);
    
    const cliente = clientes.find(c => c.id === clienteId);
    const servico = servicos.find(s => s.id === servicoId);
    
    const novoCompromisso: Compromisso = {
      id: editando?.id || Date.now(),
      clienteId: clienteId,
      clienteNome: cliente?.nome,
      servicoId: servicoId,
      servicoNome: servico?.descricao,
      data: formData.get('data') as string,
      hora: formData.get('hora') as string,
      status: editando?.status || 'agendado',
      justificativa: editando?.justificativa,
    };

    if (editando) {
      setCompromissos(compromissos.map(c => c.id === editando.id ? novoCompromisso : c));
    } else {
      setCompromissos([...compromissos, novoCompromisso]);
    }

    setMostrarModal(false);
    setEditando(null);
  };

  const handleSalvarNovoCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novoCliente: Cliente = {
      id: Date.now(),
      nome: formData.get('nomeCliente') as string,
      telefone: formData.get('telefoneCliente') as string,
      email: formData.get('emailCliente') as string || undefined,
      observacoes: '',
    };

    const novosClientes = [...clientes, novoCliente];
    setClientes(novosClientes);
    localStorage.setItem('agendaMeiClientes', JSON.stringify(novosClientes));
    
    setMostrarNovoCliente(false);
  };

  const handleAlterarStatus = (compromisso: Compromisso, novoStatus: 'cumprido' | 'naoCumprido') => {
    if (novoStatus === 'naoCumprido') {
      setCompromissoAtual(compromisso);
      setMostrarJustificativa(true);
    } else {
      setCompromissos(compromissos.map(c => 
        c.id === compromisso.id 
          ? { ...c, status: novoStatus, justificativa: undefined } 
          : c
      ));
    }
  };

  const handleSalvarJustificativa = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const justificativa = formData.get('justificativa') as string;

    if (compromissoAtual) {
      setCompromissos(compromissos.map(c => 
        c.id === compromissoAtual.id 
          ? { ...c, status: 'naoCumprido', justificativa } 
          : c
      ));
    }

    setMostrarJustificativa(false);
    setCompromissoAtual(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cumprido': return 'bg-green-100 text-green-800 border-green-200';
      case 'naoCumprido': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'cumprido': return 'Cumprido';
      case 'naoCumprido': return 'Não Cumprido';
      default: return status;
    }
  };

  const getClienteNome = (clienteId: number, clienteNome?: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || clienteNome || 'Cliente não encontrado';
  };

  const getServicoNome = (servicoId: number, servicoNome?: string) => {
    const servico = servicos.find(s => s.id === servicoId);
    return servico?.descricao || servicoNome || 'Serviço não encontrado';
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Agenda de Compromissos</h1>
        <p className="text-gray-600">Gerencie seus agendamentos e compromissos</p>
      </div>

      {/* Barra de Ações */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Busca */}
          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por cliente ou serviço..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Botões de Visualização */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVisualizacao('lista')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                visualizacao === 'lista'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
              Lista
            </button>
            <button
              onClick={() => setVisualizacao('calendario')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                visualizacao === 'calendario'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendário
            </button>
          </div>

          {/* Botão Novo */}
          <button
            onClick={handleNovoCompromisso}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Novo Compromisso
          </button>
        </div>
      </div>

      {/* Lista de Compromissos */}
      {visualizacao === 'lista' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Serviço</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Hora</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {compromissosFiltrados.map((compromisso) => (
                <tr key={compromisso.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-800">
                        {getClienteNome(compromisso.clienteId, compromisso.clienteNome)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {getServicoNome(compromisso.servicoId, compromisso.servicoNome)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(compromisso.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      {compromisso.hora}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(compromisso.status)}`}>
                        {getStatusLabel(compromisso.status)}
                      </span>
                      {compromisso.status === 'agendado' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleAlterarStatus(compromisso, 'cumprido')}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100 transition-colors flex items-center gap-1"
                            title="Marcar como cumprido"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Cumprido
                          </button>
                          <button
                            onClick={() => handleAlterarStatus(compromisso, 'naoCumprido')}
                            className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100 transition-colors flex items-center gap-1"
                            title="Marcar como não cumprido"
                          >
                            <XCircle className="w-3 h-3" />
                            Não Cumprido
                          </button>
                        </div>
                      )}
                      {compromisso.justificativa && (
                        <span className="text-xs text-gray-600 italic">
                          {compromisso.justificativa}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditarCompromisso(compromisso)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExcluirCompromisso(compromisso.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {compromissosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum compromisso encontrado</p>
            </div>
          )}
        </div>
      )}

      {/* Visualização Calendário */}
      {visualizacao === 'calendario' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <CalendarIcon className="w-24 h-24 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Visualização em Calendário</h3>
            <p className="text-gray-600 mb-6">
              Os compromissos aparecem abaixo organizados por data.
            </p>
            <div className="max-w-3xl mx-auto">
              {Object.entries(
                compromissosFiltrados.reduce((acc, c) => {
                  if (!acc[c.data]) acc[c.data] = [];
                  acc[c.data].push(c);
                  return acc;
                }, {} as Record<string, Compromisso[]>)
              ).map(([data, comps]) => (
                <div key={data} className="mb-6 text-left">
                  <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
                    {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="space-y-2">
                    {comps.map(c => (
                      <div key={c.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 text-center">
                          <span className="font-bold text-emerald-600">{c.hora}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {getClienteNome(c.clienteId, c.clienteNome)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getServicoNome(c.servicoId, c.servicoNome)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(c.status)}`}>
                          {getStatusLabel(c.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editando ? 'Editar Compromisso' : 'Novo Compromisso'}
            </h2>
            <form onSubmit={handleSalvarCompromisso}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="clienteId"
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={editando?.clienteId}
                    >
                      <option value="">Selecione um cliente</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setMostrarNovoCliente(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      title="Novo Cliente"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviço *
                  </label>
                  <select
                    name="servicoId"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    defaultValue={editando?.servicoId}
                  >
                    <option value="">Selecione um serviço</option>
                    {servicos.filter(s => s.disponivel).map(servico => (
                      <option key={servico.id} value={servico.id}>
                        {servico.descricao} - R$ {servico.preco.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data *
                    </label>
                    <input
                      type="date"
                      name="data"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={editando?.data}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora *
                    </label>
                    <input
                      type="time"
                      name="hora"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={editando?.hora}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setEditando(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Novo Cliente */}
      {mostrarNovoCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Novo Cliente</h2>
            <form onSubmit={handleSalvarNovoCliente}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nomeCliente"
                    required
                    placeholder="Digite o nome do cliente"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="telefoneCliente"
                    required
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="emailCliente"
                    placeholder="email@exemplo.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMostrarNovoCliente(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Justificativa */}
      {mostrarJustificativa && compromissoAtual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Compromisso Não Cumprido</h2>
            <p className="text-gray-600 mb-6">
              Por favor, informe o motivo pelo qual o compromisso não foi cumprido:
            </p>
            <form onSubmit={handleSalvarJustificativa}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justificativa *
                </label>
                <textarea
                  name="justificativa"
                  required
                  rows={4}
                  placeholder="Descreva o motivo..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarJustificativa(false);
                    setCompromissoAtual(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Salvar Justificativa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
