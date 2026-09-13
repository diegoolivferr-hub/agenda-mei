import { useState } from 'react';
import { UserPlus, ArrowLeft, User, FileText, Lock, Briefcase } from 'lucide-react';
import type { User as UserType } from '@/app/App';

interface CadastroProps {
  onCadastro: (user: UserType) => void;
  onVoltar: () => void;
}

export default function Cadastro({ onCadastro, onVoltar }: CadastroProps) {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    // Validações
    if (!nome || !cnpj || !areaAtuacao || !login || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Criar novo usuário MEI
    const newUser: UserType = {
      id: Date.now().toString(),
      nome,
      cnpj,
      areaAtuacao,
      login
    };

    // Salvar no localStorage
    localStorage.setItem('agendaMeiUser', JSON.stringify(newUser));
    localStorage.setItem('agendaMeiPassword', senha);

    setSucesso(true);
    setTimeout(() => {
      onCadastro(newUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Cadastro Inicial do MEI</h1>
          <p className="text-gray-600 mt-2">Configure sua conta para começar a usar o sistema</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do MEI */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do MEI *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Digite seu nome completo"
              />
            </div>
          </div>

          {/* CNPJ e Área de Atuação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="cnpj"
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="00.000.000/0001-00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="areaAtuacao" className="block text-sm font-medium text-gray-700 mb-2">
                Área de Atuação *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="areaAtuacao"
                  type="text"
                  value={areaAtuacao}
                  onChange={(e) => setAreaAtuacao(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ex: Serviços de TI, Consultoria, etc."
                />
              </div>
            </div>
          </div>

          {/* Login */}
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
              Login *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Escolha um nome de usuário"
              />
            </div>
          </div>

          {/* Senha e Confirmar Senha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Repita a senha"
                />
              </div>
            </div>
          </div>

          {/* Mensagens */}
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              �� Cadastro realizado com sucesso! Redirecionando...
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onVoltar}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              type="submit"
              disabled={sucesso}
              className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}