import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                alt="Vórtex Logo"
                className="h-9 w-9 object-contain"
                src="/assets/vortice-fox-mascot.png"
                onError={(e) => {
                  e.target.src = process.env.PUBLIC_URL + '/assets/vortice-fox-mascot.png';
                }}
              />
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                Vór<span className="text-primary-container">tex</span>
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Fusão ágil entre fabricação digital aditiva (3D Printing) e arquitetura de software de alta performance. Da modelagem matemática aos ecossistemas conectados com NFC.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-code-snippet text-code-snippet">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span>NFC Core Active</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Crafted with Vortex Precision
              </span>
            </div>
          </div>

          {/* Categorias 3D */}
          <div className="flex flex-col gap-3">
            <span className="font-label-lg text-label-lg text-on-surface font-bold uppercase tracking-wider">
              Categorias 3D
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/catalogo?cat=brindes"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Brindes Corporativos
              </Link>
              <Link
                to="/catalogo?cat=decoracao"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Decoração &amp; Design
              </Link>
              <Link
                to="/catalogo?cat=figures"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Figures &amp; Colecionáveis
              </Link>
              <Link
                to="/catalogo?cat=utilitarios"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Utilitários &amp; Suportes
              </Link>
              <Link
                to="/personalizados"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Projetos Personalizados
              </Link>
            </div>
          </div>

          {/* Consultoria Dev */}
          <div className="flex flex-col gap-3">
            <span className="font-label-lg text-label-lg text-on-surface font-bold uppercase tracking-wider">
              Consultoria Dev
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/b2b#arquitetura"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Arquitetura Web &amp; APIs
              </Link>
              <Link
                to="/b2b#hardware"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Integração Hardware/NFC
              </Link>
              <Link
                to="/b2b#prototipagem"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Prototipagem Ágil
              </Link>
              <a
                href="/#feedbacks-nfc"
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Sistemas de Feedback NFC
              </a>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:text-primary-container transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>Painel do Proprietário</span>
              </Link>
            </div>
          </div>

          {/* Conexão & Lab */}
          <div className="flex flex-col gap-3">
            <span className="font-label-lg text-label-lg text-on-surface font-bold uppercase tracking-wider">
              Conexão &amp; Lab
            </span>
            <div className="flex flex-col gap-2.5">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Laboratório de Criação e Engenharia
              </p>
              <a
                className="font-body-sm text-body-sm text-on-surface font-semibold hover:text-primary-container transition-colors"
                href="mailto:contato@vortex.tech"
              >
                contato@vortex.tech
              </a>
              <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3 mt-2">
                <span className="material-symbols-outlined text-primary-container text-[24px]">nfc</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Chaveiro NFC Tech
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Toque para avaliar instantaneamente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-surface-container-high/60">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 Vórtex. Todos os direitos reservados. Impressão 3D e Engenharia de Software.
          </p>
          <div className="flex items-center gap-6">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="#termos"
            >
              Termos de Uso
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="#privacidade"
            >
              Privacidade
            </a>
            <Link
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors"
              to="/admin"
            >
              Acesso Restrito
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
