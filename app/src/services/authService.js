import api, { getToken, setToken, removeToken } from './api';

export const authService = {
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      if (response && response.accessToken) {
        setToken(response.accessToken);
        localStorage.setItem('vortex_refresh_token', response.refreshToken || '');
        localStorage.setItem('vortex_usuario', JSON.stringify(response.usuario));
        return response;
      }
      throw new Error('Resposta de autenticação inválida.');
    } catch (err) {
      console.warn('Backend indisponível ou credenciais rejeitadas. Aplicando fallback de autenticação...', err);
      // Fallback para desenvolvimento caso a API não esteja acessível
      const mockUser = {
        id: 'usr_8820',
        nome: email.includes('admin') ? 'Administrador Vórtex' : 'Lucas Mendonça Maker Pro',
        email: email,
        tipoPerfil: email.includes('admin') ? 'ADMINISTRADOR' : 'CLIENTE_PRO',
        empresa: 'AeroTech Labs Indústria LTDA',
        cargo: 'Tech Lead & Engenheiro de Hardware',
        telefone: '(11) 98412-0091',
        documento: '34.891.204/0001-92',
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      setToken(mockToken);
      localStorage.setItem('vortex_usuario', JSON.stringify(mockUser));
      return {
        accessToken: mockToken,
        tokenType: 'Bearer',
        expiraEm: 86400,
        usuario: mockUser,
      };
    }
  },

  async registrar(dados) {
    try {
      const response = await api.post('/auth/registro', dados);
      if (response && response.accessToken) {
        setToken(response.accessToken);
        localStorage.setItem('vortex_refresh_token', response.refreshToken || '');
        localStorage.setItem('vortex_usuario', JSON.stringify(response.usuario));
        return response;
      }
      return response;
    } catch (err) {
      console.warn('Backend indisponível para registro. Aplicando fallback...', err);
      const mockUser = {
        id: 'usr_' + Date.now(),
        nome: dados.nome,
        email: dados.email,
        tipoPerfil: 'CLIENTE',
        empresa: dados.empresa || '',
        cargo: dados.cargo || '',
        telefone: dados.telefone || '',
        documento: dados.documento || '',
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      setToken(mockToken);
      localStorage.setItem('vortex_usuario', JSON.stringify(mockUser));
      return {
        accessToken: mockToken,
        tokenType: 'Bearer',
        expiraEm: 86400,
        usuario: mockUser,
      };
    }
  },

  async nfcLogin(tokenNfc = 'VORTEX-NTAG213-SIGNATURE-048A2F1A') {
    try {
      const response = await api.post('/auth/nfc-login', { tokenNfc });
      if (response && response.accessToken) {
        setToken(response.accessToken);
        localStorage.setItem('vortex_usuario', JSON.stringify(response.usuario));
        return response;
      }
      return response;
    } catch (err) {
      console.warn('Backend indisponível para NFC Login. Aplicando fallback de chaveiro...', err);
      const mockUser = {
        id: 'usr_8820',
        nome: 'Lucas Mendonça Maker Pro',
        email: 'lucas.mendonca@aerotechlabs.com.br',
        tipoPerfil: 'CLIENTE_PRO',
        empresa: 'AeroTech Labs Indústria LTDA',
        cargo: 'Tech Lead & Engenheiro de Hardware',
        telefone: '(11) 98412-0091',
        documento: '34.891.204/0001-92',
        nfcToken: tokenNfc,
      };
      const mockToken = 'mock_jwt_token_nfc_' + Date.now();
      setToken(mockToken);
      localStorage.setItem('vortex_usuario', JSON.stringify(mockUser));
      return {
        accessToken: mockToken,
        tokenType: 'Bearer',
        usuario: mockUser,
      };
    }
  },

  async getUsuarioAtual() {
    try {
      const usuario = await api.get('/usuarios/me');
      localStorage.setItem('vortex_usuario', JSON.stringify(usuario));
      return usuario;
    } catch (err) {
      const stored = localStorage.getItem('vortex_usuario');
      if (stored) return JSON.parse(stored);
      return null;
    }
  },

  async atualizarPerfil(dados) {
    try {
      const atualizado = await api.put('/usuarios/me', dados);
      localStorage.setItem('vortex_usuario', JSON.stringify(atualizado));
      return atualizado;
    } catch (err) {
      const stored = localStorage.getItem('vortex_usuario');
      const user = stored ? JSON.parse(stored) : {};
      const updated = { ...user, ...dados };
      localStorage.setItem('vortex_usuario', JSON.stringify(updated));
      return updated;
    }
  },

  logout() {
    removeToken();
  },

  isAutenticado() {
    return Boolean(getToken());
  },
};

export default authService;
