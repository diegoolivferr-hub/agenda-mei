import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import DashboardHome from '@/app/components/DashboardHome';
import AgendaCompromissos from '@/app/components/AgendaCompromissos';
import GestaoServicos from '@/app/components/GestaoServicos';
import Clientes from '@/app/components/Clientes';
import AlertasPrazos from '@/app/components/AlertasPrazos';
import Relatorios from '@/app/components/Relatorios';
import Perfil from '@/app/components/Perfil';
import type { User } from '@/app/App';

export type MenuItem = 'home' | 'agenda' | 'servicos' | 'clientes' | 'alertas' | 'relatorios' | 'configuracoes';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

export default function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('home');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        user={user}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={onLogout}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        {activeMenu === 'home' && <DashboardHome user={user} onMenuChange={setActiveMenu} />}
        {activeMenu === 'agenda' && <AgendaCompromissos user={user} />}
        {activeMenu === 'servicos' && <GestaoServicos user={user} />}
        {activeMenu === 'clientes' && <Clientes user={user} />}
        {activeMenu === 'alertas' && <AlertasPrazos user={user} />}
        {activeMenu === 'relatorios' && <Relatorios user={user} />}
        {activeMenu === 'configuracoes' && <Perfil user={user} onUpdateUser={onUpdateUser} />}
      </div>
    </div>
  );
}