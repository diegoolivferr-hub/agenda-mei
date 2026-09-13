import { useState } from 'react';
import { User as UserIcon, Camera, Save, Building2, Mail, Phone, MapPin, FileText, Shield } from 'lucide-react';
import type { User } from '@/app/App';

interface PerfilProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export default function Perfil({ user, onUpdateUser }: PerfilProps) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [sucesso, setSucesso] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(user.fotoPerfil || '');

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewFoto(base64String);
        setFormData({ ...formData, fotoPerfil: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = () => {
    onUpdateUser(formData);
    setEditando(false);
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  };

  const handleCancelar = () => {
    setFormData(user);
    setPreviewFoto(user.fotoPerfil || '');
    setEditando(false);
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e configurações da conta</p>
      </div>

      {/* Mensagem de Sucesso */}
      {sucesso && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
            ✓
          </div>
          <span className="font-medium">Perfil atualizado com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Foto de Perfil */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Foto de Perfil</h2>
            
            <div className="flex flex-col items-center">
              {/* Preview da Foto */}
              <div className="relative mb-4">
                {previewFoto ? (
                  <img
                    src={previewFoto}
                    alt="Foto de perfil"
                    className="w-40 h-40 rounded-full object-cover border-4 border-emerald-500"
                  />
                ) : (
                  <div className="w-40 h-40 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-500">
                    <UserIcon className="w-20 h-20 text-emerald-600" />
                  </div>
                )}
                
                {editando && (
                  <label
                    htmlFor="foto-upload"
                    className="absolute bottom-0 right-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg"
                  >
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      id="foto-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1">{formData.nome}</h3>
              <p className="text-emerald-600 font-medium mb-1">MEI</p>
              {formData.nomeEmpresa && (
                <p className="text-gray-600 text-sm">{formData.nomeEmpresa}</p>
              )}
            </div>

            {editando && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>Dica:</strong> Clique no ícone da câmera para fazer upload de uma nova foto
                </p>
              </div>
            )}
          </div>

          {/* Card de Informações Adicionais */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="font-bold text-gray-800 mb-4">Informações do Cadastro</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span>CNPJ: {formData.cnpj}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>Área: {formData.areaAtuacao}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Login: {formData.login}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Dados */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>
              
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  Editar Perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelar}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSalvar}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Salvar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    disabled={!editando}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg ${
                      editando
                        ? 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Nome da Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa <span className="text-emerald-600">(Recomendado)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.nomeEmpresa || ''}
                    onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                    disabled={!editando}
                    placeholder="Ex: João Silva - Serviços de Beleza MEI"
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg ${
                      editando
                        ? 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editando}
                    placeholder="seuemail@exemplo.com"
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg ${
                      editando
                        ? 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.telefone || ''}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    disabled={!editando}
                    placeholder="(00) 00000-0000"
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg ${
                      editando
                        ? 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.endereco || ''}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    disabled={!editando}
                    placeholder="Rua, número - Cidade/Estado"
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg ${
                      editando
                        ? 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dicas para MEI */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mt-6">
            <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Dicas para MEI
            </h3>
            <ul className="space-y-2 text-sm text-emerald-700">
              <li>• Mantenha seus dados atualizados para facilitar o contato com clientes</li>
              <li>• O nome da empresa aparecerá nos relatórios e documentos</li>
              <li>• Não esqueça de pagar o DAS mensalmente até o dia 20</li>
              <li>• Atualize sua foto de perfil para dar mais confiança aos clientes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}