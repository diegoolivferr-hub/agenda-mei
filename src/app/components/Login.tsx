import { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import type { User as UserType } from '@/app/App';

interface LoginProps {
  onLogin: (user: UserType) => void;
  onCriarConta: () => void;
}

export default function Login({ onLogin, onCriarConta }: LoginProps) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!login || !senha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    // Verificar se existe usuário cadastrado
    const savedUser = localStorage.getItem('agendaMeiUser');
    const savedPassword = localStorage.getItem('agendaMeiPassword');

    if (savedUser && savedPassword) {
      // Validar credenciais
      const user = JSON.parse(savedUser);
      if (user.login === login && savedPassword === senha) {
        onLogin(user);
      } else {
        setErro('Login ou senha incorretos');
      }
    } else {
      // Primeiro acesso - usar dados mock
      const mockUser: UserType = {
        id: '1',
        nome: 'João Silva',
        cnpj: '12.345.678/0001-90',
        areaAtuacao: 'Serviços de TI',
        login: login,
        email: 'joao.silva@email.com',
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123 - São Paulo/SP',
        nomeEmpresa: 'João Silva - Serviços Diversos MEI'
      };

      // Salvar usuário e senha para próximo login
      localStorage.setItem('agendaMeiUser', JSON.stringify(mockUser));
      localStorage.setItem('agendaMeiPassword', senha);

      onLogin(mockUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Agenda-MEI</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão para Microempreendedores</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Login */}
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
              Login
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
                placeholder="Digite seu login"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
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
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {erro}
            </div>
          )}

          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Entrar
          </button>
        </form>

        {/* Link Criar Conta */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <button
              onClick={onCriarConta}
              className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              Criar conta
            </button>
          </p>
        </div>

        {/* Dica de demonstração */}
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-xs text-emerald-800 text-center">
            💡 <strong>Dica:</strong> Digite qualquer login e senha para acessar a demonstração
          </p>
        </div>
      </div>
    </div>
  );
}