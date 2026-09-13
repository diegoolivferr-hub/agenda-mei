import { Home, Calendar, Briefcase, Bell, FileText, LogOut, User, Settings, Users } from 'lucide-react';
import type { User as UserType } from '@/app/App';
import type { MenuItem } from '@/app/components/Dashboard';

interface SidebarProps {
  user: UserType;
  activeMenu: MenuItem;
  onMenuChange: (menu: MenuItem) => void;
  onLogout: () => void;
}

export default function Sidebar({ user, activeMenu, onMenuChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'home' as MenuItem, label: 'Dashboard', icon: Home },
    { id: 'agenda' as MenuItem, label: 'Agenda', icon: Calendar },
    { id: 'servicos' as MenuItem, label: 'Serviços', icon: Briefcase },
    { id: 'clientes' as MenuItem, label: 'Clientes', icon: Users },
    { id: 'alertas' as MenuItem, label: 'Alertas e Prazos', icon: Bell },
    { id: 'relatorios' as MenuItem, label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="w-64 bg-emerald-800 text-white flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 bg-emerald-900">
        <h1 className="text-2xl font-bold mb-1">Agenda-MEI</h1>
        <p className="text-emerald-300 text-sm">Sistema de Gestão</p>
      </div>

      {/* Informações do Usuário */}
      <button
        onClick={() => onMenuChange('configuracoes')}
        className="p-6 bg-emerald-900/50 border-b border-emerald-700 hover:bg-emerald-900/70 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {user.fotoPerfil ? (
            <img
              src={user.fotoPerfil}
              alt={user.nome}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
            />
          ) : (
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.nome}</p>
            <p className="text-emerald-300 text-sm">MEI</p>
            {user.nomeEmpresa && (
              <p className="text-emerald-400 text-xs truncate">{user.nomeEmpresa}</p>
            )}
          </div>
        </div>
      </button>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Botão de Perfil e Logout */}
      <div className="p-4 border-t border-emerald-700 space-y-2">
        <button
          onClick={() => onMenuChange('configuracoes')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeMenu === 'configuracoes'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-emerald-100 hover:bg-emerald-700'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}