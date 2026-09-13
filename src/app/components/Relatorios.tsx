import { useState } from 'react';
import { FileText, Download, Calendar, DollarSign, TrendingUp, Users, Briefcase } from 'lucide-react';
import type { User } from '@/app/App';

interface RelatoriosProps {
  user: User;
}

export default function Relatorios({ user }: RelatoriosProps) {
  const [periodoInicio, setPeriodoInicio] = useState('2026-01-01');
  const [periodoFim, setPeriodoFim] = useState('2026-01-31');
  const [tipoRelatorio, setTipoRelatorio] = useState<'servicos' | 'financeiro' | 'clientes'>('servicos');

  const dadosServicos = [
    { servico: 'Corte de Cabelo', quantidade: 45, faturamento: 2250 },
    { servico: 'Manutenção Elétrica', quantidade: 12, faturamento: 1800 },
    { servico: 'Consultoria', quantidade: 8, faturamento: 1600 },
    { servico: 'Limpeza', quantidade: 20, faturamento: 2400 },
    { servico: 'Manicure', quantidade: 35, faturamento: 2100 },
  ];

  const dadosFinanceiros = {
    receitaTotal: 10150,
    despesas: 2500,
    lucroLiquido: 7650,
    impostos: 508.75, // DAS
    ticketMedio: 84.58,
  };

  const dadosClientes = {
    totalClientes: 48,
    novosClientes: 12,
    clientesAtivos: 42,
    taxaRetorno: 87,
    clientesMaisFrequentes: [
      { nome: 'Ana Costa', agendamentos: 22 },
      { nome: 'Julia Mendes', agendamentos: 18 },
      { nome: 'Maria Santos', agendamentos: 15 },
    ],
  };

  const handleExportarPDF = () => {
    alert('Funcionalidade de exportação em desenvolvimento. Em um sistema real, geraria um PDF com os dados do relatório.');
  };

  const handleExportarExcel = () => {
    alert('Funcionalidade de exportação em desenvolvimento. Em um sistema real, geraria um arquivo Excel com os dados do relatório.');
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Relatórios</h1>
        <p className="text-gray-600">Visualize e analise seus dados por período</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-4 gap-4">
          {/* Tipo de Relatório */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Relatório</label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="servicos">Serviços</option>
              <option value="financeiro">Financeiro</option>
              <option value="clientes">Clientes</option>
            </select>
          </div>

          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
            <input
              type="date"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
            <input
              type="date"
              value={periodoFim}
              onChange={(e) => setPeriodoFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Botões de Exportação */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleExportarPDF}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
              title="Exportar PDF"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleExportarExcel}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
              title="Exportar Excel"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Período: {new Date(periodoInicio).toLocaleDateString('pt-BR')} até {new Date(periodoFim).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Relatório de Serviços */}
      {tipoRelatorio === 'servicos' && (
        <>
          {/* Resumo */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total de Serviços</p>
              <p className="text-3xl font-bold text-gray-800">120</p>
              <p className="text-sm text-emerald-600 mt-2">↑ 15% vs. mês anterior</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Faturamento Total</p>
              <p className="text-3xl font-bold text-gray-800">R$ {dadosFinanceiros.receitaTotal.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-emerald-600 mt-2">↑ 8% vs. mês anterior</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Ticket Médio</p>
              <p className="text-3xl font-bold text-gray-800">R$ {dadosFinanceiros.ticketMedio.toFixed(2)}</p>
              <p className="text-sm text-red-600 mt-2">↓ 2% vs. mês anterior</p>
            </div>
          </div>

          {/* Tabela de Serviços */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Serviços por Categoria</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Serviço</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Quantidade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Faturamento</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ticket Médio</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Participação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dadosServicos.map((item, index) => {
                  const ticketMedio = item.faturamento / item.quantidade;
                  const participacao = (item.faturamento / dadosFinanceiros.receitaTotal) * 100;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.servico}</td>
                      <td className="px-6 py-4 text-gray-700">{item.quantidade}</td>
                      <td className="px-6 py-4 text-gray-700">R$ {item.faturamento.toLocaleString('pt-BR')}</td>
                      <td className="px-6 py-4 text-gray-700">R$ {ticketMedio.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${participacao}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{participacao.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Relatório Financeiro */}
      {tipoRelatorio === 'financeiro' && (
        <>
          {/* Cards Financeiros */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Receita Total</p>
              <p className="text-2xl font-bold text-emerald-600">
                R$ {dadosFinanceiros.receitaTotal.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Despesas</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {dadosFinanceiros.despesas.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Lucro Líquido</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {dadosFinanceiros.lucroLiquido.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">DAS (Impostos)</p>
              <p className="text-2xl font-bold text-amber-600">
                R$ {dadosFinanceiros.impostos.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Detalhamento */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo Financeiro do Período</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <span className="font-medium text-gray-800">Receita Bruta</span>
                <span className="text-xl font-bold text-emerald-600">
                  R$ {dadosFinanceiros.receitaTotal.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">(-) Despesas Operacionais</span>
                <span className="text-xl font-bold text-red-600">
                  R$ {dadosFinanceiros.despesas.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">(-) DAS e Impostos</span>
                <span className="text-xl font-bold text-amber-600">
                  R$ {dadosFinanceiros.impostos.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-t-2 border-blue-600 mt-4">
                <span className="font-bold text-gray-800">Lucro Líquido</span>
                <span className="text-2xl font-bold text-blue-600">
                  R$ {dadosFinanceiros.lucroLiquido.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>📌 Lembrete Fiscal:</strong> Como MEI, você deve pagar o DAS mensalmente até o dia 20 de cada mês.
                O valor do DAS para 2026 varia conforme sua atividade (Comércio, Indústria ou Serviços).
              </p>
            </div>
          </div>
        </>
      )}

      {/* Relatório de Clientes */}
      {tipoRelatorio === 'clientes' && (
        <>
          {/* Estatísticas de Clientes */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Total de Clientes</p>
              <p className="text-3xl font-bold text-gray-800">{dadosClientes.totalClientes}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Novos Clientes</p>
              <p className="text-3xl font-bold text-blue-600">{dadosClientes.novosClientes}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Clientes Ativos</p>
              <p className="text-3xl font-bold text-green-600">{dadosClientes.clientesAtivos}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Taxa de Retorno</p>
              <p className="text-3xl font-bold text-purple-600">{dadosClientes.taxaRetorno}%</p>
            </div>
          </div>

          {/* Top Clientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Clientes Mais Frequentes</h2>
            
            <div className="space-y-3">
              {dadosClientes.clientesMaisFrequentes.map((cliente, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-emerald-600">
                        {cliente.nome.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.agendamentos} agendamentos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${(cliente.agendamentos / 25) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
