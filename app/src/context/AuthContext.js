import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { getToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);

  const carregarUsuario = useCallback(async () => {
    const currentToken = getToken();
    if (!currentToken) {
      setUser(null);
      setTokenState(null);
      setLoading(false);
      return null;
    }

    try {
      const usuario = await authService.getUsuarioAtual();
      setUser(usuario);
      setTokenState(currentToken);
      return usuario;
    } catch (err) {
      console.warn('Sessão expirada ou inválida:', err);
      setUser(null);
      setTokenState(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
  }, [carregarUsuario]);

  const login = async (email, senha) => {
    const res = await authService.login(email, senha);
    setTokenState(res.accessToken);
    setUser(res.usuario);
    return res;
  };

  const registrar = async (dados) => {
    const res = await authService.registrar(dados);
    if (res && res.accessToken) {
      setTokenState(res.accessToken);
      setUser(res.usuario);
    }
    return res;
  };

  const nfcLogin = async (tokenNfc) => {
    const res = await authService.nfcLogin(tokenNfc);
    setTokenState(res.accessToken);
    setUser(res.usuario);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setTokenState(null);
  };

  const refreshUser = async () => {
    return await carregarUsuario();
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        registrar,
        nfcLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
