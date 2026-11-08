import api, { getToken, setToken, removeToken } from './api';

export const authService = {
  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    if (response && response.accessToken) {
      setToken(response.accessToken);
      localStorage.setItem('vortex_refresh_token', response.refreshToken || '');
      localStorage.setItem('vortex_usuario', JSON.stringify(response.usuario));
      return response;
    }
    throw new Error('Falha ao autenticar. Verifique suas credenciais.');
  },

  async registrar(dados) {
    const response = await api.post('/auth/registrar', dados);
    if (response && response.accessToken) {
      setToken(response.accessToken);
      localStorage.setItem('vortex_refresh_token', response.refreshToken || '');
      localStorage.setItem('vortex_usuario', JSON.stringify(response.usuario));
      return response;
    }
    return response;
  },

  async nfcLogin(tokenNfc) {
    const response = await api.post('/auth/nfc-login', { tokenNfc });
    if (response && response.accessToken) {
      setToken(response.accessToken);
      localStorage.setItem('vortex_usuario', JSON.stringify(response.usuario));
      return response;
    }
    throw new Error('Chaveiro NFC não reconhecido ou não associado a uma conta.');
  },

  async getUsuarioAtual() {
    if (!getToken()) {
      return null;
    }
    try {
      const usuario = await api.get('/usuarios/me');
      localStorage.setItem('vortex_usuario', JSON.stringify(usuario));
      return usuario;
    } catch (err) {
      // Token expirado ou inválido
      this.logout();
      return null;
    }
  },

  async atualizarPerfil(dados) {
    const atualizado = await api.put('/usuarios/me', dados);
    localStorage.setItem('vortex_usuario', JSON.stringify(atualizado));
    return atualizado;
  },

  async listarMeusEnderecos() {
    return await api.get('/usuarios/me/enderecos');
  },

  async adicionarMeuEndereco(dados) {
    return await api.post('/usuarios/me/enderecos', dados);
  },

  async removerMeuEndereco(enderecoId) {
    return await api.delete(`/usuarios/me/enderecos/${enderecoId}`);
  },

  logout() {
    removeToken();
  },

  isAutenticado() {
    return Boolean(getToken());
  },
};

export default authService;
