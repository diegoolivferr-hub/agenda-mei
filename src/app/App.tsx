import { useState } from 'react';
import Login from '@/app/components/Login';
import Cadastro from '@/app/components/Cadastro';
import Dashboard from '@/app/components/Dashboard';

export interface User {
  id: string;
  nome: string;
  cnpj: string;
  areaAtuacao: string;
  login: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  fotoPerfil?: string;
  nomeEmpresa?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'cadastro' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleCadastro = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onCriarConta={() => setCurrentView('cadastro')} 
        />
      )}
      
      {currentView === 'cadastro' && (
        <Cadastro 
          onCadastro={handleCadastro} 
          onVoltar={() => setCurrentView('login')} 
        />
      )}
      
      {currentView === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
}