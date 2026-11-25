/* ============================================================
   MiMenú · Lógica de página de restaurante
   Lee window.RESTAURANTE definido en el HTML del restaurante
   ============================================================ */

(function () {
  'use strict';

  const R = window.RESTAURANTE;
  if (!R) {
    document.body.innerHTML = '<p style="color:red;padding:20px;font-family:sans-serif">Error: falta la configuración del restaurante (window.RESTAURANTE).</p>';
    return;
  }

  /* ── Estado ─────────────────────────────────────────────── */
  const state = {
    carrito: [],
    seccionActiva: R.categorias[0]?.id ?? '',
    carritoAbierto: false,
    checkoutAbierto: false,
    tipoEntrega: 'llevar',
  };

  /* ── Utilidades ─────────────────────────────────────────── */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const fmt = p => `${R.moneda} ${Number(p).toFixed(2)}`;
  const totalItems = () => state.carrito.reduce((s, i) => s + i.cantidad, 0);
  const totalPrecio = () => state.carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);

  function findProd(id) {
    for (const c of R.categorias) {
      const p = c.productos.find(p => p.id === id);
      if (p) return p;
    }
    return null;
  }

  function emojiProd(p) {
    if (p.emoji) return p.emoji;
    const n = p.nombre.toLowerCase();
    if (n.includes('carne') || n.includes('asada')) return '🥩';
    if (n.includes('pechuga') || n.includes('muslo') || n.includes('pollo')) return '🍗';
    if (n.includes('cerdo')) return '🥩';
    if (n.includes('chía') || n.includes('chia') || n.includes('tamarindo')) return '🧃';
    if (n.includes('leche')) return '🥛';
    if (n.includes('bebida') || n.includes('agua') || n.includes('jugo')) return '🥤';
    if (n.includes('empanada')) return '🫓';
    if (n.includes('taco')) return '🌮';
    if (n.includes('quesillo') || n.includes('queso')) return '🧀';
    if (n.includes('tortilla')) return '🫓';
    if (n.includes('enchilada')) return '🌯';
    if (n.includes('tajada') || n.includes('maduro')) return '🍌';
    if (n.includes('torta') || n.includes('papa')) return '🥔';
    if (n.includes('gallopinto') || n.includes('arroz')) return '🍚';
    return '🍽️';
  }

  /* ── Render principal ───────────────────────────────────── */
  function renderPage() {
    document.title = `${R.nombre} · MiMenú`;

    document.body.innerHTML = `

      <!-- ENCABEZADO DEL RESTAURANTE -->
      <header class="rest-header">
        ${R.cover ? `<img class="rest-header__cover" src="${escHtml(R.cover)}" alt="">` : ''}
        <div class="rest-header__overlay"></div>
        <div class="rest-header__info">
          <h1 class="rest-header__name">${escHtml(R.nombre)}</h1>
          ${R.descripcion ? `<p class="rest-header__desc">${escHtml(R.descripcion)}</p>` : ''}
          <div class="rest-header__meta">
            <span class="badge ${R.abierto ? 'badge--open' : 'badge--closed'}">
              ${R.abierto ? '● Abierto' : '● Cerrado'}
            </span>
            <span class="rest-header__schedule">🕐 ${escHtml(R.horario)}</span>
          </div>
        </div>
      </header>

      <!-- PESTAÑAS DE CATEGORÍAS -->
      <div class="tabs-wrap" id="tabs-wrap">
        <div class="tabs" id="tabs">
          ${R.categorias.map(c => `
            <div class="tab ${c.id === state.seccionActiva ? 'active' : ''}" data-tab="${c.id}">
              ${escHtml(c.nombre)}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- LISTA DE PRODUCTOS -->
      <main id="main-content">
        ${R.categorias.map(c => `
          <section class="categoria-bloque" id="cat-${c.id}" data-section="${c.id}">
            <h2 class="categoria-titulo">${escHtml(c.nombre)}</h2>
            ${c.productos.map(p => renderProducto(p)).join('')}
          </section>
        `).join('')}
        <div style="height:110px"></div>
      </main>

      <!-- BOTÓN FLOTANTE DEL CARRITO -->
      <button class="cart-fab" id="cart-fab" aria-label="Ver carrito">
        <div class="cart-fab__left">
          <span class="cart-fab__icon">🛒</span>
          <span class="cart-fab__count" id="cart-count">0 artículos</span>
        </div>
        <span id="cart-total-fab">${R.moneda} 0.00</span>
      </button>

      <!-- DRAWER DEL CARRITO -->
      <div class="cart-overlay" id="cart-overlay"></div>
      <div class="cart-drawer" id="cart-drawer" role="dialog" aria-label="Tu pedido">
        <div class="cart-drawer__handle"></div>
        <div class="cart-drawer__header">
          <span class="cart-drawer__title">Tu pedido</span>
          <button class="btn-cerrar" id="btn-cerrar-cart" aria-label="Cerrar carrito">✕</button>
        </div>
        <div class="cart-items" id="cart-items"></div>
        <div class="cart-drawer__footer">
          <div class="cart-total-row">
            <span class="cart-total-label">Total</span>
            <span class="cart-total-valor" id="cart-total-drawer">${R.moneda} 0.00</span>
          </div>
          <button class="btn-pedido" id="btn-hacer-pedido">Continuar 🚀</button>
        </div>
      </div>

      <!-- MODAL DE CHECKOUT -->
      <div class="modal-overlay" id="modal-overlay" role="dialog" aria-label="Datos del pedido">
        <div class="modal" id="modal-checkout">
          <div class="modal__handle"></div>
          <h2 class="modal__title">📋 Datos del pedido</h2>

          <div class="form-group">
            <label class="form-label" for="inp-nombre">Tu nombre *</label>
            <input class="form-input" id="inp-nombre" type="text" placeholder="Nombre completo" autocomplete="name">
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-tel">Teléfono *</label>
            <input class="form-input" id="inp-tel" type="tel" placeholder="Ej: 6000-0000" autocomplete="tel">
          </div>

          <div class="form-group">
            <label class="form-label">¿Cómo recibes tu pedido?</label>
            <div class="radio-group">
              <label class="radio-btn selected" id="rb-llevar">
                <input type="radio" name="entrega" value="llevar" checked> 🥡 Para llevar
              </label>
              <label class="radio-btn" id="rb-delivery">
                <input type="radio" name="entrega" value="delivery"> 🛵 Delivery
              </label>
            </div>
          </div>

          <div class="form-group" id="grupo-direccion" style="display:none">
            <label class="form-label" for="inp-dir">Dirección de entrega *</label>
            <input class="form-input" id="inp-dir" type="text" placeholder="Calle, barrio, referencia...">
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-pago">Método de pago</label>
            <select class="form-input" id="inp-pago">
              <option value="Efectivo">Efectivo</option>
              <option value="Yappy">Yappy</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-notas">Notas del pedido</label>
            <input class="form-input" id="inp-notas" type="text" placeholder="Sin picante, extra salsa, etc.">
          </div>

          <div class="modal__resumen">
            <div class="modal__resumen-title">Resumen</div>
            <div id="resumen-items"></div>
            <div class="modal__resumen-total" id="resumen-total"></div>
          </div>

          <button class="btn-whatsapp" id="btn-whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido por WhatsApp
          </button>
          <button class="btn-cancelar" id="btn-cancelar-modal">Cancelar</button>
        </div>
      </div>
    `;

    attachEvents();
    updateCartUI();
    observeSections();
  }

  function renderProducto(p) {
    return `
      <div class="producto">
        <div class="producto__img">
          ${p.imagen
            ? `<img src="${escHtml(p.imagen)}" alt="${escHtml(p.nombre)}">`
            : emojiProd(p)
          }
        </div>
        <div class="producto__info">
          <div class="producto__nombre">${escHtml(p.nombre)}</div>
          ${p.descripcion ? `<div class="producto__desc">${escHtml(p.descripcion)}</div>` : ''}
          <div class="producto__precio">${fmt(p.precio)}</div>
        </div>
        <div class="producto__add">
          <button class="btn-add" data-add="${p.id}" aria-label="Agregar ${escHtml(p.nombre)}">+</button>
        </div>
      </div>
    `;
  }

  /* ── Eventos ─────────────────────────────────────────────── */
  function attachEvents() {
    /* Tabs */
    $$('.tab').forEach(tab =>
      tab.addEventListener('click', () => scrollToSection(tab.dataset.tab))
    );

    /* Productos (delegado) */
    $('#main-content').addEventListener('click', e => {
      const addBtn = e.target.closest('[data-add]');
      const removeBtn = e.target.closest('[data-remove]');
      if (addBtn) agregarItem(addBtn.dataset.add);
      if (removeBtn) quitarItem(removeBtn.dataset.remove);
    });

    /* FAB carrito */
    $('#cart-fab').addEventListener('click', abrirCarrito);

    /* Overlay y botón cerrar */
    $('#cart-overlay').addEventListener('click', cerrarCarrito);
    $('#btn-cerrar-cart').addEventListener('click', cerrarCarrito);

    /* Checkout */
    $('#btn-hacer-pedido').addEventListener('click', abrirCheckout);
    $('#btn-cancelar-modal').addEventListener('click', cerrarCheckout);
    $('#modal-overlay').addEventListener('click', e => {
      if (e.target === $('#modal-overlay')) cerrarCheckout();
    });

    /* Tipo de entrega */
    $('#rb-llevar').addEventListener('click', () => setEntrega('llevar'));
    $('#rb-delivery').addEventListener('click', () => setEntrega('delivery'));

    /* WhatsApp */
    $('#btn-whatsapp').addEventListener('click', enviarWhatsApp);
  }

  function setEntrega(tipo) {
    state.tipoEntrega = tipo;
    $('#rb-llevar').classList.toggle('selected', tipo === 'llevar');
    $('#rb-delivery').classList.toggle('selected', tipo === 'delivery');
    $('#grupo-direccion').style.display = tipo === 'delivery' ? 'block' : 'none';
  }

  /* ── Carrito ─────────────────────────────────────────────── */
  function agregarItem(id) {
    const prod = findProd(id);
    if (!prod) return;
    const item = state.carrito.find(i => i.id === id);
    if (item) {
      item.cantidad++;
    } else {
      state.carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
    }
    updateCartUI();
  }

  function quitarItem(id) {
    const idx = state.carrito.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (state.carrito[idx].cantidad > 1) {
      state.carrito[idx].cantidad--;
    } else {
      state.carrito.splice(idx, 1);
    }
    updateCartUI();
  }

  function updateCartUI() {
    const count = totalItems();
    const total = totalPrecio();

    /* FAB */
    const fab = $('#cart-fab');
    if (count > 0) {
      fab.classList.add('visible');
      $('#cart-count').textContent = `${count} artículo${count !== 1 ? 's' : ''}`;
      $('#cart-total-fab').textContent = fmt(total);
    } else {
      fab.classList.remove('visible');
    }

    /* Total en drawer */
    const drawerTotal = $('#cart-total-drawer');
    if (drawerTotal) drawerTotal.textContent = fmt(total);

    /* Items del drawer */
    renderCartItems();

    /* Botones de producto */
    $$('[data-add]', $('#main-content')).forEach(btn => {
      const id = btn.dataset.add;
      const item = state.carrito.find(i => i.id === id);
      if (item) {
        btn.className = 'btn-add en-carrito';
        btn.setAttribute('aria-label', `${item.cantidad} en carrito`);
        btn.innerHTML = `
          <span class="qty-btn" data-remove="${id}" aria-label="Quitar uno">−</span>
          <span>${item.cantidad}</span>
          <span class="qty-btn" data-add="${id}" aria-label="Agregar uno">+</span>
        `;
      } else {
        btn.className = 'btn-add';
        btn.innerHTML = '+';
      }
    });
  }

  function renderCartItems() {
    const container = $('#cart-items');
    if (!container) return;

    if (state.carrito.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🛒</div>
          <div class="empty-state__text">Tu carrito está vacío</div>
        </div>`;
      return;
    }

    container.innerHTML = state.carrito.map(item => `
      <div class="cart-item">
        <div class="cart-item__nombre">${escHtml(item.nombre)}</div>
        <div class="cart-item__controles">
          <button class="btn-qty" data-remove="${item.id}" aria-label="Quitar uno">−</button>
          <span class="cart-item__qty">${item.cantidad}</span>
          <button class="btn-qty" data-add="${item.id}" aria-label="Agregar uno">+</button>
        </div>
        <div class="cart-item__precio">${fmt(item.precio * item.cantidad)}</div>
      </div>
    `).join('');

    container.querySelectorAll('[data-add]').forEach(b =>
      b.addEventListener('click', () => agregarItem(b.dataset.add))
    );
    container.querySelectorAll('[data-remove]').forEach(b =>
      b.addEventListener('click', () => quitarItem(b.dataset.remove))
    );
  }

  /* ── Drawer ─────────────────────────────────────────────── */
  function abrirCarrito() {
    state.carritoAbierto = true;
    renderCartItems();
    $('#cart-overlay').classList.add('visible');
    $('#cart-drawer').classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function cerrarCarrito() {
    state.carritoAbierto = false;
    $('#cart-overlay').classList.remove('visible');
    $('#cart-drawer').classList.remove('visible');
    document.body.style.overflow = '';
  }

  /* ── Checkout ───────────────────────────────────────────── */
  function abrirCheckout() {
    cerrarCarrito();
    $('#resumen-items').innerHTML = state.carrito
      .map(i => `<div class="modal__resumen-item">• ${escHtml(i.nombre)} x${i.cantidad} &mdash; ${fmt(i.precio * i.cantidad)}</div>`)
      .join('');
    $('#resumen-total').textContent = `Total: ${fmt(totalPrecio())}`;
    $('#modal-overlay').classList.add('visible');
    state.checkoutAbierto = true;
    setTimeout(() => $('#inp-nombre')?.focus(), 320);
  }

  function cerrarCheckout() {
    $('#modal-overlay').classList.remove('visible');
    state.checkoutAbierto = false;
  }

  /* ── WhatsApp ───────────────────────────────────────────── */
  function enviarWhatsApp() {
    const nombre = $('#inp-nombre')?.value.trim() ?? '';
    const tel    = $('#inp-tel')?.value.trim()    ?? '';
    const dir    = $('#inp-dir')?.value.trim()    ?? '';
    const pago   = $('#inp-pago')?.value          ?? 'Efectivo';
    const notas  = $('#inp-notas')?.value.trim()  ?? '';

    if (!nombre) { showError('Por favor ingresa tu nombre.'); return; }
    if (!tel)    { showError('Por favor ingresa tu teléfono.'); return; }
    if (state.tipoEntrega === 'delivery' && !dir) {
      showError('Por favor ingresa la dirección de entrega.');
      return;
    }
    if (state.carrito.length === 0) { showError('Tu carrito está vacío.'); return; }

    const lineas = state.carrito
      .map(i => `• ${i.nombre} x${i.cantidad} — ${fmt(i.precio * i.cantidad)}`)
      .join('\n');

    const partes = [
      `🍽️ *Nuevo pedido — ${R.nombre}*`,
      ``,
      `👤 *Nombre:* ${nombre}`,
      `📞 *Teléfono:* ${tel}`,
      `📦 *Tipo:* ${state.tipoEntrega === 'llevar' ? 'Para llevar 🥡' : 'Delivery 🛵'}`,
    ];
    if (state.tipoEntrega === 'delivery') partes.push(`📍 *Dirección:* ${dir}`);
    if (notas) partes.push(`📝 *Notas:* ${notas}`);
    partes.push(``, `*Pedido:*`, lineas, ``, `💰 *Total: ${fmt(totalPrecio())}*`);
    partes.push(`💳 *Pago:* ${pago}`);
    partes.push(``, `_Enviado desde MiMenú_`);

    const msg = partes.join('\n');
    const url = `https://wa.me/${R.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  }

  /* ── Tabs / Scroll ──────────────────────────────────────── */
  function scrollToSection(id) {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const tabsH = $('#tabs-wrap')?.offsetHeight ?? 48;
    const y = el.getBoundingClientRect().top + window.scrollY - tabsH - 1;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveTab(id);
  }

  function setActiveTab(id) {
    state.seccionActiva = id;
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    $(`.tab[data-tab="${id}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  function observeSections() {
    const tabsH = $('#tabs-wrap')?.offsetHeight ?? 48;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveTab(e.target.dataset.section); });
    }, { rootMargin: `-${tabsH + 8}px 0px -55% 0px`, threshold: 0 });
    $$('[data-section]').forEach(el => obs.observe(el));
  }

  /* ── Helpers ────────────────────────────────────────────── */
  function escHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showError(msg) {
    alert(msg);
  }

  /* ── Init ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPage);
  } else {
    renderPage();
  }

})();
