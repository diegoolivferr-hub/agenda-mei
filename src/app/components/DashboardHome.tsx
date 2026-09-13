import { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Briefcase, Users, ArrowRight, Bell } from 'lucide-react';
import type { User } from '@/app/App';
import type { MenuItem } from '@/app/components/Dashboard';

interface DashboardHomeProps {
  user: User;
  onMenuChange: (menu: MenuItem) => void;
}

export default function DashboardHome({ user, onMenuChange }: DashboardHomeProps) {
  const [prazosProximos, setPrazosProximos] = useState<any[]>([]);
  const [compromissosProximos, setCompromissosProximos] = useState<any[]>([]);
  const [compromissosHoje, setCompromissosHoje] = useState(0);
  const [compromissosSemana, setCompromissosSemana] = useState(0);
  const [totalServicos, setTotalServicos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);

  useEffect(() => {
    // Carregar prazos do localStorage
    const savedPrazos = localStorage.getItem('agendaMeiPrazos');
    if (savedPrazos) {
      const prazos = JSON.parse(savedPrazos);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      // Filtrar prazos pendentes nos próximos 7 dias
      const proximos = prazos
        .filter((p: any) => p.status === 'pendente')
        .map((p: any) => {
          const vencimento = new Date(p.dataVencimento + 'T00:00:00');
          const dias = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          return { ...p, diasAteVencimento: dias };
        })
        .filter((p: any) => p.diasAteVencimento >= 0 && p.diasAteVencimento <= 7)
        .sort((a: any, b: any) => a.diasAteVencimento - b.diasAteVencimento)
        .slice(0, 3);
      
      setPrazosProximos(proximos);
    }

    // Carregar compromissos do localStorage
    const savedCompromissos = localStorage.getItem('agendaMeiCompromissos');
    if (savedCompromissos) {
      const compromissos = JSON.parse(savedCompromissos);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const hojeDateStr = hoje.toISOString().split('T')[0];
      
      // Calcular data de uma semana adiante
      const umaSemana = new Date(hoje);
      umaSemana.setDate(umaSemana.getDate() + 7);
      const umaSemanaDateStr = umaSemana.toISOString().split('T')[0];
      
      // Compromissos de hoje
      const compHoje = compromissos.filter((c: any) => c.data === hojeDateStr && c.status === 'agendado').length;
      setCompromissosHoje(compHoje);
      
      // Compromissos da semana
      const compSemana = compromissos.filter((c: any) => c.data >= hojeDateStr && c.data <= umaSemanaDateStr && c.status === 'agendado').length;
      setCompromissosSemana(compSemana);
      
      // Próximos compromissos para exibição
      const proximos = compromissos
        .filter((c: any) => c.data >= hojeDateStr)
        .sort((a: any, b: any) => {
          if (a.data === b.data) {
            return a.hora.localeCompare(b.hora);
          }
          return a.data.localeCompare(b.data);
        })
        .slice(0, 3);
      
      setCompromissosProximos(proximos);
    }

    // Carregar serviços do localStorage
    const savedServicos = localStorage.getItem('agendaMeiServicos');
    if (savedServicos) {
      const servicos = JSON.parse(savedServicos);
      setTotalServicos(servicos.filter((s: any) => s.disponivel).length);
    }

    // Carregar clientes do localStorage
    const savedClientes = localStorage.getItem('agendaMeiClientes');
    if (savedClientes) {
      const clientes = JSON.parse(savedClientes);
      setTotalClientes(clientes.length);
    }
  }, []);

  const estatisticas = [
    { label: 'Compromissos Hoje', valor: compromissosHoje.toString(), icon: Calendar, cor: 'bg-blue-500', action: () => onMenuChange('agenda') },
    { label: 'Compromissos na Semana', valor: compromissosSemana.toString(), icon: Calendar, cor: 'bg-purple-500', action: () => onMenuChange('agenda') },
    { label: 'Serviços Ativos', valor: totalServicos.toString(), icon: Briefcase, cor: 'bg-emerald-500', action: () => onMenuChange('servicos') },
    { label: 'Clientes Cadastrados', valor: totalClientes.toString(), icon: Users, cor: 'bg-orange-500', action: () => onMenuChange('clientes') },
  ];

  const getDiasText = (dias: number) => {
    if (dias === 0) return 'Vence hoje!';
    if (dias === 1) return 'Vence amanhã';
    return `${dias} dia(s)`;
  };

  const getClienteNome = (clienteId: number, clienteNome?: string) => {
    const savedClientes = localStorage.getItem('agendaMeiClientes');
    if (savedClientes) {
      const clientes = JSON.parse(savedClientes);
      const cliente = clientes.find((c: any) => c.id === clienteId);
      return cliente?.nome || clienteNome || 'Cliente não encontrado';
    }
    return clienteNome || 'Cliente não encontrado';
  };

  const getServicoNome = (servicoId: number, servicoNome?: string) => {
    const savedServicos = localStorage.getItem('agendaMeiServicos');
    if (savedServicos) {
      const servicos = JSON.parse(savedServicos);
      const servico = servicos.find((s: any) => s.id === servicoId);
      return servico?.descricao || servicoNome || 'Serviço não encontrado';
    }
    return servicoNome || 'Serviço não encontrado';
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bem-vindo, {user.nome.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">Aqui está um resumo das suas atividades</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={stat.action}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.cor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {stat.valor}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Próximos Compromissos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Próximos Compromissos</h2>
            </div>
            <button
              onClick={() => onMenuChange('agenda')}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            {compromissosProximos.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum compromisso próximo</p>
                <button
                  onClick={() => onMenuChange('agenda')}
                  className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Adicionar compromisso
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {compromissosProximos.map((compromisso) => (
                  <div key={compromisso.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {getClienteNome(compromisso.clienteId, compromisso.clienteNome)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getServicoNome(compromisso.servicoId, compromisso.servicoNome)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{compromisso.hora}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(compromisso.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alertas de Prazos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Prazos Próximos</h2>
            </div>
            <button
              onClick={() => onMenuChange('alertas')}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            {prazosProximos.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum prazo próximo</p>
                <button
                  onClick={() => onMenuChange('alertas')}
                  className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Gerenciar prazos
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {prazosProximos.map((prazo) => (
                  <div
                    key={prazo.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      prazo.diasAteVencimento === 0
                        ? 'bg-red-50 border-red-500'
                        : prazo.diasAteVencimento <= 3
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            prazo.diasAteVencimento === 0
                              ? 'bg-red-200 text-red-800'
                              : prazo.diasAteVencimento <= 3
                              ? 'bg-orange-200 text-orange-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {prazo.tipo}
                          </span>
                          <span className="text-xs text-gray-600">
                            {getDiasText(prazo.diasAteVencimento)}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800">{prazo.descricao}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(prazo.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Resumo Geral</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Serviços Cadastrados</p>
              <p className="text-3xl font-bold text-emerald-600">{totalServicos}</p>
              <button
                onClick={() => onMenuChange('servicos')}
                className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Gerenciar serviços
              </button>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Clientes Cadastrados</p>
              <p className="text-3xl font-bold text-orange-600">{totalClientes}</p>
              <button
                onClick={() => onMenuChange('clientes')}
                className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Ver clientes
              </button>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Prazos Pendentes</p>
              <p className="text-3xl font-bold text-amber-600">{prazosProximos.length}</p>
              <button
                onClick={() => onMenuChange('alertas')}
                className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Ver prazos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
