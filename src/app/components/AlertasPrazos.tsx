import { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, DollarSign, AlertTriangle, CheckCircle, Edit2, Trash2, X } from 'lucide-react';
import type { User } from '@/app/App';

interface Prazo {
  id: string;
  tipo: string;
  descricao: string;
  dataVencimento: string;
  valor?: string;
  status: 'pendente' | 'pago';
}

interface AlertasPrazosProps {
  user: User;
}

export default function AlertasPrazos({ user }: AlertasPrazosProps) {
  const [prazos, setPrazos] = useState<Prazo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPrazo, setEditingPrazo] = useState<Prazo | null>(null);
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState<'pendente' | 'pago'>('pendente');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'pago'>('todos');

  // Carregar prazos do localStorage
  useEffect(() => {
    const savedPrazos = localStorage.getItem('agendaMeiPrazos');
    if (savedPrazos) {
      setPrazos(JSON.parse(savedPrazos));
    } else {
      // Prazos de exemplo
      const prazosExemplo: Prazo[] = [
        {
          id: '1',
          tipo: 'DAS',
          descricao: 'Documento de Arrecadação do Simples Nacional - Janeiro/2026',
          dataVencimento: '2026-02-20',
          valor: 'R$ 71,00',
          status: 'pendente'
        },
        {
          id: '2',
          tipo: 'Aluguel',
          descricao: 'Aluguel do escritório - Janeiro/2026',
          dataVencimento: '2026-02-05',
          valor: 'R$ 800,00',
          status: 'pendente'
        },
        {
          id: '3',
          tipo: 'Fornecedor',
          descricao: 'Pagamento de material de escritório',
          dataVencimento: '2026-02-10',
          valor: 'R$ 150,00',
          status: 'pendente'
        }
      ];
      setPrazos(prazosExemplo);
      localStorage.setItem('agendaMeiPrazos', JSON.stringify(prazosExemplo));
    }
  }, []);

  // Salvar prazos no localStorage sempre que houver mudanças
  useEffect(() => {
    if (prazos.length > 0) {
      localStorage.setItem('agendaMeiPrazos', JSON.stringify(prazos));
    }
  }, [prazos]);

  const handleOpenModal = (prazo?: Prazo) => {
    if (prazo) {
      setEditingPrazo(prazo);
      setTipo(prazo.tipo);
      setDescricao(prazo.descricao);
      setDataVencimento(prazo.dataVencimento);
      setValor(prazo.valor || '');
      setStatus(prazo.status);
    } else {
      setEditingPrazo(null);
      setTipo('');
      setDescricao('');
      setDataVencimento('');
      setValor('');
      setStatus('pendente');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPrazo(null);
    setTipo('');
    setDescricao('');
    setDataVencimento('');
    setValor('');
    setStatus('pendente');
  };

  const handleSave = () => {
    if (!tipo || !descricao || !dataVencimento) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (editingPrazo) {
      // Atualizar prazo existente
      setPrazos(prazos.map(p => 
        p.id === editingPrazo.id 
          ? { ...p, tipo, descricao, dataVencimento, valor, status }
          : p
      ));
    } else {
      // Adicionar novo prazo
      const novoPrazo: Prazo = {
        id: Date.now().toString(),
        tipo,
        descricao,
        dataVencimento,
        valor,
        status
      };
      setPrazos([...prazos, novoPrazo]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este prazo?')) {
      setPrazos(prazos.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setPrazos(prazos.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'pendente' ? 'pago' : 'pendente' }
        : p
    ));
  };

  // Função para calcular dias até o vencimento
  const getDiasAteVencimento = (dataVencimento: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataVencimento + 'T00:00:00');
    const diferenca = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diferenca;
  };

  // Função para obter a cor do alerta
  const getAlertColor = (dias: number, status: string) => {
    if (status === 'pago') return 'text-green-600 bg-green-50 border-green-200';
    if (dias < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (dias === 0) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (dias <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  // Função para obter o texto do alerta
  const getAlertText = (dias: number, status: string) => {
    if (status === 'pago') return 'Pago';
    if (dias < 0) return `Vencido há ${Math.abs(dias)} dia(s)`;
    if (dias === 0) return 'Vence hoje!';
    if (dias === 1) return 'Vence amanhã';
    return `Vence em ${dias} dia(s)`;
  };

  // Filtrar prazos
  const prazosFiltrados = prazos.filter(p => {
    if (filtroStatus === 'todos') return true;
    return p.status === filtroStatus;
  }).sort((a, b) => {
    const diasA = getDiasAteVencimento(a.dataVencimento);
    const diasB = getDiasAteVencimento(b.dataVencimento);
    return diasA - diasB;
  });

  // Contar prazos por categoria
  const prazosVencendoHoje = prazos.filter(p => p.status === 'pendente' && getDiasAteVencimento(p.dataVencimento) === 0).length;
  const prazosVencendo7Dias = prazos.filter(p => p.status === 'pendente' && getDiasAteVencimento(p.dataVencimento) > 0 && getDiasAteVencimento(p.dataVencimento) <= 7).length;
  const prazosVencidos = prazos.filter(p => p.status === 'pendente' && getDiasAteVencimento(p.dataVencimento) < 0).length;
  const prazosPagos = prazos.filter(p => p.status === 'pago').length;

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Alertas e Prazos</h1>
        <p className="text-gray-600">Gerencie seus prazos fiscais e financeiros</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Vencendo Hoje</p>
              <p className="text-3xl font-bold">{prazosVencendoHoje}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Próximos 7 Dias</p>
              <p className="text-3xl font-bold">{prazosVencendo7Dias}</p>
            </div>
            <Calendar className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">Vencidos</p>
              <p className="text-3xl font-bold">{prazosVencidos}</p>
            </div>
            <Bell className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Pagos</p>
              <p className="text-3xl font-bold">{prazosPagos}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'todos' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos ({prazos.length})
          </button>
          <button
            onClick={() => setFiltroStatus('pendente')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'pendente' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendentes ({prazos.filter(p => p.status === 'pendente').length})
          </button>
          <button
            onClick={() => setFiltroStatus('pago')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'pago' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pagos ({prazosPagos})
          </button>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Prazo
        </button>
      </div>

      {/* Lista de Prazos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {prazosFiltrados.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum prazo encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              Clique em "Adicionar Prazo" para começar
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {prazosFiltrados.map((prazo) => {
              const dias = getDiasAteVencimento(prazo.dataVencimento);
              const alertColor = getAlertColor(dias, prazo.status);
              const alertText = getAlertText(dias, prazo.status);

              return (
                <div
                  key={prazo.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {prazo.tipo}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${alertColor}`}>
                          {alertText}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {prazo.descricao}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(prazo.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {prazo.valor && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{prazo.valor}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(prazo.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          prazo.status === 'pago'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={prazo.status === 'pago' ? 'Marcar como pendente' : 'Marcar como pago'}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(prazo)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prazo.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar Prazo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPrazo ? 'Editar Prazo' : 'Adicionar Prazo'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Tipo */}
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo do Prazo *
                </label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="DAS">DAS</option>
                  <option value="Aluguel">Aluguel</option>
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Imposto">Imposto</option>
                  <option value="Conta">Conta</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Descreva o prazo..."
                />
              </div>

              {/* Data de Vencimento e Valor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Vencimento *
                  </label>
                  <input
                    id="dataVencimento"
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor
                  </label>
                  <input
                    id="valor"
                    type="text"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'pendente' | 'pago')}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4 sticky bottom-0 bg-white">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                {editingPrazo ? 'Salvar Alterações' : 'Adicionar Prazo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
