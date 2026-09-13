import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Phone, User as UserIcon, Mail } from 'lucide-react';
import type { User } from '@/app/App';

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  observacoes?: string;
}

interface ClientesProps {
  user: User;
}

export default function Clientes({ user }: ClientesProps) {
  const [busca, setBusca] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Carregar clientes do localStorage
  useEffect(() => {
    const savedClientes = localStorage.getItem('agendaMeiClientes');
    if (savedClientes) {
      setClientes(JSON.parse(savedClientes));
    } else {
      // Dados iniciais de exemplo
      const clientesIniciais = [
        { id: 1, nome: 'Maria Santos', telefone: '(11) 98765-4321', email: 'maria@email.com', observacoes: 'Cliente preferencial' },
        { id: 2, nome: 'Pedro Oliveira', telefone: '(11) 97654-3210', email: 'pedro@email.com', observacoes: '' },
        { id: 3, nome: 'Ana Costa', telefone: '(11) 96543-2109', email: '', observacoes: 'Pagamento à vista' },
        { id: 4, nome: 'Carlos Silva', telefone: '(11) 95432-1098', email: 'carlos@email.com', observacoes: '' },
        { id: 5, nome: 'Julia Mendes', telefone: '(11) 94321-0987', email: '', observacoes: 'Atende apenas aos sábados' },
      ];
      setClientes(clientesIniciais);
      localStorage.setItem('agendaMeiClientes', JSON.stringify(clientesIniciais));
    }
  }, []);

  // Salvar clientes no localStorage
  useEffect(() => {
    if (clientes.length > 0) {
      localStorage.setItem('agendaMeiClientes', JSON.stringify(clientes));
    }
  }, [clientes]);

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca)
  );

  const handleNovoCliente = () => {
    setEditando(null);
    setMostrarModal(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setEditando(cliente);
    setMostrarModal(true);
  };

  const handleExcluirCliente = (id: number) => {
    if (confirm('Deseja realmente excluir este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const handleSalvarCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novoCliente: Cliente = {
      id: editando?.id || Date.now(),
      nome: formData.get('nome') as string,
      telefone: formData.get('telefone') as string,
      email: formData.get('email') as string || undefined,
      observacoes: formData.get('observacoes') as string || undefined,
    };

    if (editando) {
      setClientes(clientes.map(c => c.id === editando.id ? novoCliente : c));
    } else {
      setClientes([...clientes, novoCliente]);
    }

    setMostrarModal(false);
    setEditando(null);
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão de Clientes</h1>
        <p className="text-gray-600">Cadastre e gerencie seus clientes</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total de Clientes</p>
              <p className="text-3xl font-bold text-gray-800">{clientes.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Com E-mail</p>
              <p className="text-3xl font-bold text-blue-600">
                {clientes.filter(c => c.email).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Com Observações</p>
              <p className="text-3xl font-bold text-purple-600">
                {clientes.filter(c => c.observacoes).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
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
              placeholder="Buscar por nome ou telefone..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Botão Novo */}
          <button
            onClick={handleNovoCliente}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nome</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Telefone</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">E-mail</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Observações</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-medium text-gray-800">{cliente.nome}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    {cliente.telefone}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {cliente.email || <span className="text-gray-400">-</span>}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {cliente.observacoes ? (
                    <span className="text-sm">{cliente.observacoes.substring(0, 40)}{cliente.observacoes.length > 40 ? '...' : ''}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditarCliente(cliente)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExcluirCliente(cliente.id)}
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

        {clientesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editando ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <form onSubmit={handleSalvarCliente}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    required
                    placeholder="Digite o nome do cliente"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    defaultValue={editando?.nome}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      required
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={editando?.telefone}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={editando?.email || ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    name="observacoes"
                    rows={3}
                    placeholder="Informações adicionais sobre o cliente..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    defaultValue={editando?.observacoes || ''}
                  />
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
    </div>
  );
}
