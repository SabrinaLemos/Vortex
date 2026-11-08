import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/perfil';
  const { login, registrar, nfcLogin } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState('pj');

  // Interactive Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [nfcScanning, setNfcScanning] = useState(false);
  const [authNotification, setAuthNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (authMode === 'login') {
        const res = await login(email, password);
        setAuthNotification({
          type: 'success',
          title: `Bem-vindo, ${res.usuario?.nome || 'Cliente'}!`,
          message: 'Autenticação validada com sucesso. Redirecionando...',
        });
      } else {
        const res = await registrar({
          nome: name,
          email,
          senha: password,
          telefone: phone,
          tipoPessoa: accountType === 'pj' ? 'PJ' : 'PF',
        });
        setAuthNotification({
          type: 'success',
          title: 'Conta Criada com Sucesso!',
          message: `Cadastro confirmado para ${res.usuario?.nome || name}. Redirecionando...`,
        });
      }
      setTimeout(() => {
        navigate(redirectTarget);
      }, 1000);
    } catch (err) {
      setAuthNotification({
        type: 'error',
        title: 'Falha na Autenticação',
        message: err.message || 'Verifique seus dados de acesso e tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNfcAuth = async () => {
    setNfcScanning(true);
    try {
      const res = await nfcLogin('VORTEX-NTAG213-048A2F1A');
      setAuthNotification({
        type: 'success',
        title: 'Chaveiro Fox NFC Reconhecido!',
        message: `Token NTAG213 autenticado para ${res.usuario?.nome || 'Maker Pro'}. Entrando...`,
      });
      setTimeout(() => {
        navigate(redirectTarget);
      }, 1000);
    } catch (err) {
      setAuthNotification({
        type: 'error',
        title: 'Erro de Leitura NFC',
        message: 'Não foi possível autenticar o token físico.',
      });
    } finally {
      setNfcScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-24 pb-20">
      {/* Subtle Ambient Glow Canvas Decorators */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="absolute -top-16 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Navigation Trail / Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 font-label-md text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Início</span>
          </Link>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-on-surface-variant cursor-default">Área do Cliente</span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-primary font-bold">
            {authMode === 'login' ? 'Entrar na Conta' : 'Criar Nova Conta'}
          </span>
        </nav>

        {/* Notification Toast */}
        {authNotification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 flex items-center gap-3 animate-fadeIn">
            <span className="material-symbols-outlined text-[24px] text-emerald-600">verified</span>
            <div className="flex flex-col">
              <span className="font-label-md text-xs font-bold">{authNotification.title}</span>
              <span className="font-body-sm text-xs">{authNotification.message}</span>
            </div>
          </div>
        )}

        {/* Main Authentication Split Architecture (5 / 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT COLUMN: Brand Experience & Lab Ecosystem (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 bg-surface-container rounded-2xl shadow-sm relative overflow-hidden border border-surface-container-high/60">
            {/* Technical Grid Background Decorator */}
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#1b1c19_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 flex flex-col">
              {/* Geometric Mascot Badge */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative p-2.5 bg-surface-container-lowest rounded-2xl shadow-sm">
                  <img
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl"
                    alt="Polygonal origami fox mascot in vivid orange — modern industrial design emblem of Vórtex 3D Labs & Dev."
                    src="/assets/vortice-fox-mascot.png"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-container"></span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-code-snippet text-[11px] font-bold w-fit mb-1">
                    <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
                    <span>vortex-core // v3.4</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                    Vórtex Ecosystem
                  </span>
                </div>
              </div>

              {/* Headline & Narrative */}
              <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold mb-3 tracking-tight">
                Bem-vindo ao ecossistema <span className="text-primary-container">Vórtex</span>.
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-8 leading-relaxed">
                Acompanhe pedidos aditivos industriais em tempo de fatiamento real, consulte ordens de fabricação de software e sincronize chaves criptográficas NFC.
              </p>

              {/* Core Feature Pillars */}
              <div className="flex flex-col gap-3.5 mb-8">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface-container-lowest/80 shadow-xs border border-surface-container-high/40 transition-all hover:translate-x-1 duration-200">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-[22px]">precision_manufacturing</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-xs font-bold text-on-surface">Produção 3D &amp; Telemetria</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Acompanhamento contínuo de status, fila de impressão e tolerâncias de engenharia.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface-container-lowest/80 shadow-xs border border-surface-container-high/40 transition-all hover:translate-x-1 duration-200">
                  <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">terminal</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-xs font-bold text-on-surface">Consultoria Dev &amp; APIs</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Acesso direto a sprints, diagramas de arquitetura e documentações técnicas exclusivas.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface-container-lowest/80 shadow-xs border border-surface-container-high/40 transition-all hover:translate-x-1 duration-200">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">nfc</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-xs font-bold text-on-surface">Tags NFC &amp; Hardware Auth</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Gerenciador unificado de payloads, remapeamento de links dinâmicos e chaves públicas.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="relative z-10 pt-4 border-t border-surface-container-high/50 flex items-center justify-between text-on-surface-variant text-xs">
              <div className="flex items-center gap-1.5 font-code-snippet">
                <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
                <span>256-bit TLS &amp; Hard-Key</span>
              </div>
              <span className="font-label-md uppercase tracking-wider text-outline text-[10px]">Lab Guard v2</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Login / Register Panel (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-surface-container-lowest p-6 sm:p-10 rounded-2xl shadow-md border border-surface-container-high/60 relative">
            {/* Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-surface-container">
              <div className="flex items-center gap-2 p-1 bg-surface-container rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-5 py-2 rounded-lg font-label-lg text-xs font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Entrar na Conta
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-5 py-2 rounded-lg font-label-lg text-xs font-bold transition-all ${
                    authMode === 'register'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Criar Nova Conta
                </button>
              </div>

              {/* Profile Scope Notice */}
              <Link
                to="/admin"
                className="font-label-md text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Acesso Administrativo</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {authMode === 'register' && (
                <>
                  {/* Account Persona Selector */}
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <label
                      onClick={() => setAccountType('pj')}
                      className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                        accountType === 'pj'
                          ? 'bg-primary-container/10 border-primary-container'
                          : 'bg-surface-container-low border-surface-container-high/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">corporate_fare</span>
                        <span className="font-label-md text-xs font-bold">Empresa (B2B)</span>
                      </div>
                      <input
                        type="radio"
                        name="account_type"
                        checked={accountType === 'pj'}
                        onChange={() => setAccountType('pj')}
                        className="accent-primary-container"
                      />
                    </label>

                    <label
                      onClick={() => setAccountType('pf')}
                      className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                        accountType === 'pf'
                          ? 'bg-primary-container/10 border-primary-container'
                          : 'bg-surface-container-low border-surface-container-high/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
                        <span className="font-label-md text-xs font-bold">Maker / Cliente</span>
                      </div>
                      <input
                        type="radio"
                        name="account_type"
                        checked={accountType === 'pf'}
                        onChange={() => setAccountType('pf')}
                        className="accent-primary-container"
                      />
                    </label>
                  </div>

                  {/* Name Field */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">
                      {accountType === 'pj' ? 'Razão Social ou Nome do Responsável' : 'Nome Completo'}
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                        person
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Lucas Mendonça ou AeroTech Labs"
                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl font-body-md text-xs text-on-surface border border-surface-container-high/60 focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-bold text-on-surface">WhatsApp / Telefone</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                        call
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl font-body-md text-xs text-on-surface border border-surface-container-high/60 focus:outline-none focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-xs font-bold text-on-surface flex items-center justify-between">
                  <span>E-mail Corporativo ou Pessoal</span>
                  <span className="font-code-snippet text-[10px] text-outline">auth.identity</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@empresa.com"
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl font-body-md text-xs text-on-surface border border-surface-container-high/60 focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-xs font-bold text-on-surface">Chave de Acesso / Senha</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => alert('Link de recuperação enviado para o e-mail cadastrado!')}
                      className="font-label-md text-[11px] text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-10 bg-surface-container-low rounded-xl font-body-md text-xs text-on-surface border border-surface-container-high/60 focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Device Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary-container cursor-pointer"
                  />
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Lembrar deste dispositivo por 30 dias
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full mt-2 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-md disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Validando Credenciais...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Entrar na Plataforma' : 'Criar Conta Vórtex'}</span>
                    <span className="material-symbols-outlined text-[18px]">key</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="w-full bg-surface-container-high h-[1px]"></div>
              <span className="absolute px-3 bg-surface-container-lowest font-label-md text-[11px] uppercase text-outline">
                Ou continue com
              </span>
            </div>

            {/* Social & Hardware Integrations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  alert('Autenticação Google Workspace simulada!');
                  navigate('/perfil');
                }}
                className="h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs font-bold flex items-center justify-center gap-2.5 transition-all border border-surface-container-high/50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                </svg>
                <span>Google Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert('Autenticação GitHub Dev simulada!');
                  navigate('/perfil');
                }}
                className="h-11 px-4 rounded-xl bg-inverse-surface hover:bg-inverse-surface/90 text-inverse-on-surface font-label-md text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                <span>GitHub Dev</span>
              </button>
            </div>

            {/* Exclusive Vórtex Hardware NFC Touch Access */}
            <div className="relative p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">nfc</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-xs font-bold text-on-surface">
                      Acesso Rápido via Hardware NFC
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      Aproxime seu Chaveiro Fox NFC ou crachá cadastrado
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNfcAuth}
                  disabled={nfcScanning}
                  className="px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface text-primary border border-surface-container-high font-label-md text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                >
                  {nfcScanning ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      <span>Lendo Chip...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">sensors</span>
                      <span>Escanear NFC</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
