import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Search, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import type { User } from '@/app/App';

interface Servico {
  id: number;
  descricao: string;
  preco: number;
  disponivel: boolean;
  categoria: string;
  observacoes?: string;
}

interface GestaoServicosProps {
  user: User;
}

export default function GestaoServicos({ user }: GestaoServicosProps) {
  const [busca, setBusca] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Servico | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);

  // Carregar serviços do localStorage
  useEffect(() => {
    const savedServicos = localStorage.getItem('agendaMeiServicos');
    if (savedServicos) {
      setServicos(JSON.parse(savedServicos));
    } else {
      // Dados iniciais de exemplo
      const servicosIniciais = [
        { id: 1, descricao: 'Corte de Cabelo', preco: 50, disponivel: true, categoria: 'Beleza' },
        { id: 2, descricao: 'Manutenção Elétrica', preco: 150, disponivel: true, categoria: 'Manutenção' },
        { id: 3, descricao: 'Consultoria Contábil', preco: 200, disponivel: true, categoria: 'Consultoria' },
        { id: 4, descricao: 'Limpeza Residencial', preco: 120, disponivel: true, categoria: 'Limpeza' },
        { id: 5, descricao: 'Manicure e Pedicure', preco: 60, disponivel: true, categoria: 'Beleza' },
        { id: 6, descricao: 'Design Gráfico', preco: 300, disponivel: false, categoria: 'Design' },
      ];
      setServicos(servicosIniciais);
      localStorage.setItem('agendaMeiServicos', JSON.stringify(servicosIniciais));
    }
  }, []);

  // Salvar serviços no localStorage
  useEffect(() => {
    if (servicos.length > 0) {
      localStorage.setItem('agendaMeiServicos', JSON.stringify(servicos));
    }
  }, [servicos]);

  const servicosFiltrados = servicos.filter(s =>
    s.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    s.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  const handleNovoServico = () => {
    setEditando(null);
    setMostrarModal(true);
  };

  const handleEditarServico = (servico: Servico) => {
    setEditando(servico);
    setMostrarModal(true);
  };

  const handleExcluirServico = (id: number) => {
    if (confirm('Deseja realmente excluir este serviço?')) {
      setServicos(servicos.filter(s => s.id !== id));
    }
  };

  const handleToggleDisponibilidade = (id: number) => {
    setServicos(servicos.map(s =>
      s.id === id ? { ...s, disponivel: !s.disponivel } : s
    ));
  };

  const handleSalvarServico = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novoServico: Servico = {
      id: editando?.id || Date.now(),
      descricao: formData.get('descricao') as string,
      categoria: formData.get('categoria') as string,
      preco: parseFloat(formData.get('preco') as string),
      disponivel: formData.get('disponivel') === 'on',
      observacoes: formData.get('observacoes') as string || undefined,
    };

    if (editando) {
      setServicos(servicos.map(s => s.id === editando.id ? novoServico : s));
    } else {
      setServicos([...servicos, novoServico]);
    }

    setMostrarModal(false);
    setEditando(null);
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão de Serviços</h1>
        <p className="text-gray-600">Cadastre e gerencie os serviços oferecidos</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total de Serviços</p>
              <p className="text-3xl font-bold text-gray-800">{servicos.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Serviços Ativos</p>
              <p className="text-3xl font-bold text-emerald-600">{servicos.filter(s => s.disponivel).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ToggleRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Preço Médio</p>
              <p className="text-3xl font-bold text-blue-600">
                R$ {servicos.length > 0 ? (servicos.reduce((acc, s) => acc + s.preco, 0) / servicos.length).toFixed(0) : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
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
              placeholder="Buscar por descrição ou categoria..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Botão Novo */}
          <button
            onClick={handleNovoServico}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Novo Serviço
          </button>
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-2 gap-6">
        {servicosFiltrados.map((servico) => (
          <div
            key={servico.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
              servico.disponivel ? 'border-l-4 border-emerald-500' : 'border-l-4 border-gray-300 opacity-75'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{servico.descricao}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {servico.categoria}
                    </span>
                  </div>
                  {servico.observacoes && (
                    <p className="text-gray-600 text-sm mb-3">{servico.observacoes}</p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-600">
                      R$ {servico.preco.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Toggle Disponibilidade */}
                <button
                  onClick={() => handleToggleDisponibilidade(servico.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    servico.disponivel
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={servico.disponivel ? 'Desativar' : 'Ativar'}
                >
                  {servico.disponivel ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  servico.disponivel
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {servico.disponivel ? '✓ Disponível' : '✗ Indisponível'}
                </span>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditarServico(servico)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleExcluirServico(servico.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {servicosFiltrados.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum serviço encontrado</p>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editando ? 'Editar Serviço' : 'Novo Serviço'}
            </h2>
            <form onSubmit={handleSalvarServico}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome/Descrição do Serviço *
                  </label>
                  <input
                    type="text"
                    name="descricao"
                    required
                    placeholder="Ex: Corte de Cabelo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    defaultValue={editando?.descricao}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      name="categoria"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={editando?.categoria}
                    >
                      <option value="Beleza">Beleza</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Consultoria">Consultoria</option>
                      <option value="Limpeza">Limpeza</option>
                      <option value="Design">Design</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor (R$) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="preco"
                        required
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={editando?.preco}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    name="observacoes"
                    rows={2}
                    placeholder="Informações adicionais sobre o serviço..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    defaultValue={editando?.observacoes || ''}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="disponivel"
                    name="disponivel"
                    defaultChecked={editando?.disponivel ?? true}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="disponivel" className="text-sm font-medium text-gray-700">
                    Serviço ativo e disponível para agendamento
                  </label>
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
