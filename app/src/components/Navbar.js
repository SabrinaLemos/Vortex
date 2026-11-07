import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, notification } = useCart();

  const [navSearch, setNavSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (navSearch.trim()) {
      navigate('/catalogo?q=' + encodeURIComponent(navSearch.trim()));
      setNavSearch('');
    } else {
      navigate('/catalogo');
    }
  };

  const handleSectionScroll = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  };

  const navLinks = [
    { label: 'Início', path: '/', isRoute: true },
    { label: 'Produtos', path: '/catalogo', isRoute: true },
    { label: 'Personalizados', path: '/personalizados', isRoute: true },
    { label: 'Consultoria Dev', path: '/b2b', isRoute: true },
    { label: 'Sobre Nós', sectionId: 'sobre-nos', isRoute: false },
    { label: 'Feedbacks NFC', sectionId: 'feedbacks-nfc', isRoute: false },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-bright/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4 lg:gap-6">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 shrink-0 group"
          >
            <img
              alt="Vórtex Logo"
              className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
              src="/assets/vortice-fox-mascot.png"
              onError={(e) => {
                e.target.src = process.env.PUBLIC_URL + '/assets/vortex-fox-mascot.png';
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-lg sm:text-xl text-on-surface font-bold tracking-tight">
                Vór<span className="text-primary-container">tex</span>
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                3D Labs &amp; Dev
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Visible from md / lg screens with responsive gap) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
            {navLinks.map((link) => {
              if (link.isRoute) {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-label-lg text-sm transition-colors py-1 ${
                      active
                        ? 'text-primary-container font-bold border-b-2 border-primary-container'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              } else {
                return (
                  <button
                    key={link.sectionId}
                    type="button"
                    onClick={() => handleSectionScroll(link.sectionId)}
                    className="font-label-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors py-1"
                  >
                    {link.label}
                  </button>
                );
              }
            })}
          </nav>

          {/* Action Buttons, Search, Cart & User */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Search Input (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">
                search
              </span>
              <input
                className="w-40 xl:w-56 pl-9 pr-4 py-2 bg-surface-container rounded-lg font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all border border-surface-container"
                placeholder="Buscar peças, código..."
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </form>

            {/* Cart Button */}
            <Link
              to="/carrinho"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Carrinho de compras"
              className="relative p-2 rounded-lg text-on-surface hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-center"
              title="Ver Carrinho"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary-container text-on-primary rounded-full font-label-md text-[10px] flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login Button (Desktop) */}
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-inverse-surface hover:bg-inverse-surface/90 text-inverse-on-surface rounded-lg font-label-lg text-xs font-semibold transition-transform hover:-translate-y-0.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Entrar</span>
            </Link>

            {/* Profile Avatar Icon */}
            <Link
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
              title="Meu Perfil"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </Link>

            {/* Mobile / Tablet Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
              aria-label="Menu de Navegação"
              title="Menu de Navegação"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* ================= MOBILE / TABLET SLIDE-DOWN DRAWER ================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface-bright/98 border-t border-surface-container px-6 py-6 shadow-xl animate-fadeIn">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-5">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-container"
                placeholder="Buscar peças, modelos 3D, código..."
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-sm font-semibold transition-all ${
                  isActive('/')
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>Início</span>
              </Link>

              <Link
                to="/catalogo"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-sm font-semibold transition-all ${
                  isActive('/catalogo')
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
                <span>Produtos (Catálogo)</span>
              </Link>

              <Link
                to="/personalizados"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-sm font-semibold transition-all ${
                  isActive('/personalizados')
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">layers</span>
                <span className="flex-1">Projetos Personalizados (Custom CAD)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary-container/20 text-primary-container font-bold">
                  Upload CAD
                </span>
              </Link>

              <Link
                to="/b2b"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-sm font-semibold transition-all ${
                  isActive('/b2b')
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">business</span>
                <span>Consultoria Dev &amp; B2B</span>
              </Link>

              <button
                type="button"
                onClick={() => handleSectionScroll('sobre-nos')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-sm font-semibold text-on-surface hover:bg-surface-container text-left transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">info</span>
                <span>Sobre Nós</span>
              </button>

              <button
                type="button"
                onClick={() => handleSectionScroll('feedbacks-nfc')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-sm font-semibold text-on-surface hover:bg-surface-container text-left transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">reviews</span>
                <span>Feedbacks NFC</span>
              </button>

              <div className="pt-3 mt-2 border-t border-surface-container flex flex-col gap-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-sm font-semibold text-primary hover:bg-surface-container transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  <span>Painel do Proprietário (Labs &amp; Dev)</span>
                </Link>

                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 px-4 bg-inverse-surface text-inverse-on-surface rounded-xl font-label-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    <span>Entrar na Conta</span>
                  </Link>

                  <Link
                    to="/carrinho"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 px-4 bg-primary-container text-on-primary rounded-xl font-label-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    <span>Carrinho ({cartCount})</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Floating Cart Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-4 animate-bounce border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[20px]">check_circle</span>
            <span className="font-label-md text-xs font-semibold">{notification}</span>
          </div>
          <Link
            to="/carrinho"
            className="px-3 py-1 rounded-lg bg-primary-container text-on-primary font-label-md text-xs font-bold hover:bg-primary transition-colors whitespace-nowrap"
          >
            Ver Carrinho
          </Link>
        </div>
      )}
    </>
  );
}
