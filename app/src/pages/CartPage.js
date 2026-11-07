import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import carrinhoService from '../services/carrinhoService';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, cartCount, cartSubtotal, updateQuantity, removeFromCart, addToCart, clearCart } = useCart();

  const [shippingMethod, setShippingMethod] = useState('sedex');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [productionNotes, setProductionNotes] = useState('');

  // Shipping cost based on selection
  const shippingCosts = {
    sedex: 14.80,
    pac: 9.90,
    lab: 0.00,
  };

  const baseShipping = shippingCosts[shippingMethod] || 0;
  const isFreeShippingCoupon = appliedCoupon === 'FRETEFREE';
  const effectiveShipping = isFreeShippingCoupon ? 0 : baseShipping;

  const discountPercent = appliedCoupon === 'VORTEX10' ? 0.10 : 0;
  const discountAmount = cartSubtotal * discountPercent;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + effectiveShipping);

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await carrinhoService.aplicarCupom(code);
      setAppliedCoupon(res.codigo || code);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message || 'Cupom inválido ou expirado.');
    }
  };

  const handleQuickCoupon = async (code) => {
    setCouponInput(code);
    setCouponError('');
    try {
      const res = await carrinhoService.aplicarCupom(code);
      setAppliedCoupon(res.codigo || code);
    } catch (err) {
      setCouponError('Não foi possível aplicar o cupom rápido.');
    }
  };

  // Recommendations for Cross-sell (Filamento, Organizador, Suporte MagSafe)
  const recommendations = [
    MOCK_PRODUCTS.find((p) => p.sku === 'VRT-FIL-PLA') || MOCK_PRODUCTS[8],
    MOCK_PRODUCTS.find((p) => p.sku === 'VRT-CAB-HEX') || MOCK_PRODUCTS[7],
    MOCK_PRODUCTS.find((p) => p.sku === 'VRT-MGS-STD') || MOCK_PRODUCTS[5],
  ];

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased pt-24 pb-20">
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
        {/* Top Nav: Breadcrumb & Progress Stepper */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-surface-container-high/60 mb-8">
          {/* Breadcrumb */}
          <nav aria-label="Navegação estrutural" className="flex items-center gap-2">
            <Link to="/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Início</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <Link to="/catalogo" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Catálogo
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="font-label-md text-label-md text-primary font-bold">Meu Carrinho</span>
          </nav>

          {/* Stepper Component */}
          <div className="inline-flex items-center gap-2 sm:gap-4 bg-surface-container-low px-4 py-2 rounded-xl border border-surface-container-high/60">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary font-label-md text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="font-label-md text-label-md text-on-surface font-bold whitespace-nowrap">
                Carrinho
              </span>
            </div>
            <span className="w-4 h-0.5 bg-outline-variant"></span>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant font-label-md text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="hidden sm:inline font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                Checkout
              </span>
            </div>
            <span className="w-4 h-0.5 bg-outline-variant"></span>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant font-label-md text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="hidden sm:inline font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                Produção &amp; Envio
              </span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface font-code-snippet text-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
              <span>ESTAÇÃO DE CORTE &amp; CHECKOUT</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Carrinho de Compras <span className="font-light text-on-surface-variant">&amp; Ordem de Produção</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-code-snippet text-xs border border-surface-container-high/60">
              <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
              <span>Criptografia AES-256</span>
            </div>
            <span className="font-label-lg text-label-lg px-3 py-1.5 rounded-lg bg-primary-container/10 text-primary font-bold">
              {cartCount} {cartCount === 1 ? 'item no pedido' : 'itens no pedido'}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="p-16 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col items-center justify-center text-center gap-5 my-8">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[40px]">shopping_cart</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Seu carrinho de manufatura está vazio
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-md leading-relaxed">
              Explore nossas peças impressas em 3D, chaveiros com NFC integrado e utilitários de setup para iniciar uma ordem de fabricação.
            </p>
            <Link
              to="/catalogo"
              className="mt-2 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-container text-on-primary font-label-lg font-bold shadow-md hover:bg-primary transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
              Explorar Catálogo de Produtos
            </Link>
          </div>
        ) : (
          /* Main Bento Grid: Items (8 cols) + Summary (4 cols) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items Column (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Items List */}
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="cart-item group relative bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-surface-container-high/60 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      {/* Thumbnail */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-surface-container-low p-2 shrink-0 flex items-center justify-center overflow-hidden border border-surface-container-high/40">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/assets/prod-chaveiro-fox-nfc.png';
                          }}
                        />
                        {item.sku?.includes('NFC') && (
                          <div className="absolute top-1 left-1 bg-inverse-surface/85 backdrop-blur-sm text-surface-container-lowest px-1.5 py-0.5 rounded text-[10px] font-code-snippet flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[10px] text-primary-container">nfc</span>
                            <span>NTAG213</span>
                          </div>
                        )}
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex-1 flex flex-col justify-between w-full min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary font-label-md text-[11px] font-bold">
                                Ordem de Produção
                              </span>
                              <span className="font-code-snippet text-xs text-outline">
                                SKU: {item.sku || 'VRT-3D'}
                              </span>
                            </div>
                            <h2 className="font-headline-sm text-[18px] text-on-surface font-bold mt-1 tracking-tight">
                              {item.title}
                            </h2>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="font-label-md text-xs text-on-surface-variant block">Subtotal</span>
                            <span className="font-headline-sm text-lg text-primary font-bold">
                              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>

                        {/* Specs Chips */}
                        <div className="flex flex-wrap gap-2 mt-2 pt-1 text-on-surface-variant">
                          <span className="px-2.5 py-1 bg-surface-container-low rounded-lg font-body-sm text-xs flex items-center gap-1.5 border border-surface-container-high/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                            Cor: <strong>{item.selectedColor || 'Padrão'}</strong>
                          </span>
                          <span className="px-2.5 py-1 bg-surface-container-low rounded-lg font-body-sm text-xs flex items-center gap-1 border border-surface-container-high/40">
                            <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                            ~2h 45min impressão
                          </span>
                        </div>

                        {/* Bottom Actions: Quantity Stepper & Remove */}
                        <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-surface-container">
                          <div className="flex items-center gap-3">
                            <span className="font-label-md text-xs text-on-surface-variant">Quantidade:</span>
                            <div className="flex items-center rounded-xl bg-surface-container-low border border-surface-container-high/60 p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors font-bold text-sm"
                                title="Diminuir"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-bold text-sm font-code-snippet text-on-surface">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors font-bold text-sm"
                                title="Aumentar"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-on-surface-variant font-code-snippet">
                              R$ {item.price.toFixed(2).replace('.', ',')} / un
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                              title="Remover item"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Instructions for 3D Print Operator */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container-high/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                    <label htmlFor="lab-notes" className="font-label-lg text-label-lg font-bold text-on-surface">
                      Instruções Especiais de Fabricação para o Lab
                    </label>
                  </div>
                  <span className="font-code-snippet text-xs text-on-surface-variant">Opcional</span>
                </div>
                <textarea
                  id="lab-notes"
                  rows="2"
                  value={productionNotes}
                  onChange={(e) => setProductionNotes(e.target.value)}
                  placeholder="Ex: Por favor enviar o chaveiro em embalagem individual de presente ou ajustar link NFC..."
                  className="w-full p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-container transition-all resize-none"
                ></textarea>
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-1.5 font-label-md text-primary font-bold hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Continuar Comprando Peças
                </Link>
                <button
                  onClick={clearCart}
                  className="font-label-md text-xs text-on-surface-variant hover:text-error transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>

            {/* Order Summary Column (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-surface-container-high/60 flex flex-col gap-5">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                    Resumo do Pedido
                  </h2>
                  <span className="font-code-snippet text-xs text-primary font-bold">
                    LAB-VRT-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                </div>

                {/* Subtotals Breakdown */}
                <div className="flex flex-col gap-3 font-body-sm text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal de Peças ({cartCount} un)</span>
                    <span className="font-bold text-on-surface font-code-snippet">
                      R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Desconto Maker ({appliedCoupon})</span>
                      <span className="font-code-snippet">- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-on-surface-variant items-baseline">
                    <span>Frete Selecionado</span>
                    <span className="font-bold text-on-surface font-code-snippet">
                      {effectiveShipping === 0 ? (
                        <span className="text-emerald-600 font-bold">Grátis</span>
                      ) : (
                        `R$ ${effectiveShipping.toFixed(2).replace('.', ',')}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Shipping Method Selector */}
                <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
                  <span className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider">
                    Método de Envio / Retirada
                  </span>
                  <div className="flex flex-col gap-2">
                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'sedex' ? 'border-primary-container bg-primary-container/5 shadow-xs' : 'border-surface-container bg-surface-container-low hover:bg-surface-container'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shipping_sel"
                          checked={shippingMethod === 'sedex'}
                          onChange={() => setShippingMethod('sedex')}
                          className="accent-primary-container"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-md text-xs font-bold text-on-surface">Sedex Expresso (IoT)</span>
                          <span className="text-[11px] text-on-surface-variant">1 a 2 dias úteis</span>
                        </div>
                      </div>
                      <span className="font-code-snippet text-xs font-bold text-on-surface">
                        {isFreeShippingCoupon ? 'Grátis' : 'R$ 14,80'}
                      </span>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'pac' ? 'border-primary-container bg-primary-container/5 shadow-xs' : 'border-surface-container bg-surface-container-low hover:bg-surface-container'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shipping_sel"
                          checked={shippingMethod === 'pac'}
                          onChange={() => setShippingMethod('pac')}
                          className="accent-primary-container"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-md text-xs font-bold text-on-surface">PAC Econômico</span>
                          <span className="text-[11px] text-on-surface-variant">4 a 6 dias úteis</span>
                        </div>
                      </div>
                      <span className="font-code-snippet text-xs font-bold text-on-surface">
                        {isFreeShippingCoupon ? 'Grátis' : 'R$ 9,90'}
                      </span>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'lab' ? 'border-primary-container bg-primary-container/5 shadow-xs' : 'border-surface-container bg-surface-container-low hover:bg-surface-container'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shipping_sel"
                          checked={shippingMethod === 'lab'}
                          onChange={() => setShippingMethod('lab')}
                          className="accent-primary-container"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-md text-xs font-bold text-on-surface">Retirada no Lab Vórtex</span>
                          <span className="text-[11px] text-on-surface-variant">Pronto em 4h • Pinheiros/SP</span>
                        </div>
                      </div>
                      <span className="font-code-snippet text-xs font-bold text-emerald-600">Grátis</span>
                    </label>
                  </div>
                </div>

                {/* Coupon Block */}
                <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
                  <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">loyalty</span>
                    <span>Cupom de Desconto Maker</span>
                  </span>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Código do cupom..."
                      className="flex-1 px-3 py-2 bg-surface-container-low border border-surface-container-high/60 rounded-xl font-code-snippet text-xs uppercase text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded-xl font-label-md text-xs font-bold hover:bg-inverse-surface/90 transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                  {couponError && (
                    <span className="text-xs text-error font-medium">{couponError}</span>
                  )}
                  {appliedCoupon && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Cupom <strong>{appliedCoupon}</strong> ativo!
                    </span>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickCoupon('VORTEX10')}
                      className="px-2 py-1 rounded-md bg-surface-container text-on-surface-variant hover:text-primary font-code-snippet text-[11px]"
                    >
                      + VORTEX10 (-10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickCoupon('FRETEFREE')}
                      className="px-2 py-1 rounded-md bg-surface-container text-on-surface-variant hover:text-primary font-code-snippet text-[11px]"
                    >
                      + FRETEFREE
                    </button>
                  </div>
                </div>

                {/* Total Box */}
                <div className="bg-surface-container p-4 rounded-2xl flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline-sm text-lg font-bold text-on-surface">Total à vista</span>
                    <span className="font-headline-lg text-2xl font-extrabold text-primary">
                      R$ {grandTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-xs">
                    <span>ou até 3x de R$ {(grandTotal / 3).toFixed(2).replace('.', ',')} sem juros</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      PIX 5% OFF
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 px-6 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span>Avançar para Pagamento Seguro</span>
                </button>

                {/* Tech Guarantees */}
                <div className="flex flex-col gap-2.5 pt-2 text-on-surface-variant font-body-sm text-xs border-t border-surface-container">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">straighten</span>
                    <span><strong>Garantia Dimensional:</strong> Peças aferidas com paquímetro digital Mitutoyo.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">nfc</span>
                    <span><strong>Tag NFC Testada:</strong> Garantia vitalícia de integridade do chip e leitura telemétrica.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cross-Sell Recommendations */}
        <div className="mt-16 pt-10 bg-surface-container-low/60 rounded-2xl p-6 lg:p-8 border border-surface-container-high/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-snippet text-[11px] font-bold mb-1">
                <span>UPGRADES COMPATÍVEIS</span>
              </div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                Aproveite e Adicione ao Pedido <span className="font-normal text-on-surface-variant">(Sem custo extra de frete)</span>
              </h2>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">Recomendações do Algoritmo Fox</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high/60 flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="relative w-full h-44 rounded-lg bg-surface-container-low mb-3 overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={rec.imageUrl}
                      alt={rec.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-surface-container-highest font-code-snippet text-[11px] font-bold">
                      {rec.techLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    <span>{rec.categoryLabel}</span>
                  </div>
                  <Link to={`/produto/${rec.slug}`}>
                    <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1 hover:text-primary transition-colors line-clamp-1">
                      {rec.title}
                    </h3>
                  </Link>
                  <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {rec.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-container">
                  <div className="flex flex-col">
                    <span className="font-label-md text-[11px] text-on-surface-variant">Preço unitário</span>
                    <span className="font-headline-sm text-lg font-bold text-on-surface">
                      R$ {rec.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(rec, 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-inverse-surface hover:bg-inverse-surface/85 text-inverse-on-surface font-label-md text-xs font-bold transition-all shadow-xs hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary-container">add_shopping_cart</span>
                    <span>+ Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
