/* ==========================================================================
   TANYA BAKES — script.js
   Handles: navigation, product loading, catalog rendering, filter & search
   ========================================================================== */

/* --------------------------------------------------------------------------
   GLOBALS
   -------------------------------------------------------------------------- */
let allProducts    = [];
let activeCategory = 'All';
let searchQuery    = '';

/* --------------------------------------------------------------------------
   INIT
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  loadProducts();
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

/* --------------------------------------------------------------------------
   NAVIGATION
   -------------------------------------------------------------------------- */
function initNav() {
  const header    = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close mobile menu when clicking outside the header
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

/* --------------------------------------------------------------------------
   LOAD PRODUCTS
   -------------------------------------------------------------------------- */
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    allProducts = data.products || [];
    const categories = data.categories || [];

    renderFeatured(allProducts);
    renderFilterTabs(categories);
    renderProducts(allProducts);
    initSearch();

  } catch (err) {
    console.error('Could not load products.json:', err);

    // Show friendly error in both grids
    const errMsg = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 24px;color:var(--muted);">
        <p style="margin-bottom:12px;font-size:1.5rem;opacity:.4;">🎂</p>
        <p>Products could not be loaded. Please refresh the page.</p>
        <p style="font-size:.8rem;margin-top:8px;opacity:.6;">
          (If previewing locally, open via a local server rather than the file:// protocol.)
        </p>
      </div>`;

    document.getElementById('featuredGrid').innerHTML = errMsg;
    document.getElementById('productsGrid').innerHTML = errMsg;
  }
}

/* --------------------------------------------------------------------------
   RENDER FEATURED PRODUCTS
   Shows up to 3 products where "featured": true
   -------------------------------------------------------------------------- */
function renderFeatured(products) {
  const grid     = document.getElementById('featuredGrid');
  const section  = document.getElementById('featured');
  const featured = products.filter(p => p.featured).slice(0, 3);

  if (featured.length === 0) {
    section.style.display = 'none';
    return;
  }

  grid.innerHTML = featured
    .map((product, i) => buildCard(product, i * 80))
    .join('');
}

/* --------------------------------------------------------------------------
   RENDER FILTER TABS
   -------------------------------------------------------------------------- */
function renderFilterTabs(categories) {
  const container = document.getElementById('filterTabs');
  const allTabs   = ['All', ...categories];

  container.innerHTML = allTabs.map(cat => `
    <button
      class="filter-tab${cat === 'All' ? ' active' : ''}"
      data-category="${escHtml(cat)}"
      role="tab"
      aria-selected="${cat === 'All'}"
      onclick="filterByCategory('${escHtml(cat)}')">
      ${escHtml(cat)}
    </button>
  `).join('');
}

/* --------------------------------------------------------------------------
   RENDER PRODUCTS GRID
   -------------------------------------------------------------------------- */
function renderProducts(products) {
  const grid      = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');

  if (products.length === 0) {
    grid.innerHTML    = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  grid.innerHTML = products
    .map((product, i) => buildCard(product, i * 50))
    .join('');
}

/* --------------------------------------------------------------------------
   BUILD PRODUCT CARD HTML
   Each card's WhatsApp button pre-fills the product name in the message.
   -------------------------------------------------------------------------- */
function buildCard(product, delay = 0) {
  const waText = encodeURIComponent(
    `Hi Tanya! I'm interested in ordering "${product.name}". Could you please share more details and check availability?`
  );
  const waLink = `https://wa.me/97336007536?text=${waText}`;

  // Render image if path is provided; otherwise show placeholder
  const imageHtml = product.image
    ? `<img
         src="${escHtml(product.image)}"
         alt="${escHtml(product.name)}"
         loading="lazy"
         onerror="this.replaceWith(buildPlaceholderEl())">`
    : `<div class="card-placeholder">
         <span class="ph-icon">🎂</span>
         <span class="ph-label">Photo Coming Soon</span>
       </div>`;

  const badgeHtml = product.badge
    ? `<span class="badge">${escHtml(product.badge)}</span>`
    : '';

  return `
    <article class="product-card" style="animation-delay:${delay}ms">
      <div class="card-img-wrap">
        ${imageHtml}
        ${badgeHtml}
        <span class="cat-badge">${escHtml(product.category)}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${escHtml(product.name)}</h3>
        <p class="card-desc">${escHtml(product.description)}</p>
        <div class="card-footer">
          <span class="card-price">${escHtml(product.price)}</span>
          <a href="${waLink}"
             class="btn-wa"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Order ${escHtml(product.name)} via WhatsApp">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order via WhatsApp
          </a>
        </div>
      </div>
    </article>`;
}

// Helper used inside onerror — must be global
function buildPlaceholderEl() {
  const div = document.createElement('div');
  div.className = 'card-placeholder';
  div.innerHTML = '<span class="ph-icon">🎂</span><span class="ph-label">Photo Coming Soon</span>';
  return div;
}

/* --------------------------------------------------------------------------
   FILTER BY CATEGORY
   -------------------------------------------------------------------------- */
function filterByCategory(category) {
  activeCategory = category;

  // Update tab visual state
  document.querySelectorAll('.filter-tab').forEach(tab => {
    const active = tab.dataset.category === category;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  applyFilters();
}

/* --------------------------------------------------------------------------
   SEARCH
   -------------------------------------------------------------------------- */
function initSearch() {
  const input = document.getElementById('searchInput');
  const clear = document.getElementById('searchClear');

  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    clear.style.display = searchQuery ? 'block' : 'none';
    applyFilters();
  });
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  const clear = document.getElementById('searchClear');

  input.value         = '';
  clear.style.display = 'none';
  searchQuery         = '';
  filterByCategory('All');   // also resets tabs
}

/* --------------------------------------------------------------------------
   APPLY FILTERS + SEARCH
   -------------------------------------------------------------------------- */
function applyFilters() {
  let results = allProducts;

  // Category filter
  if (activeCategory !== 'All') {
    results = results.filter(p => p.category === activeCategory);
  }

  // Search filter — checks name, description, and category
  if (searchQuery) {
    results = results.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  renderProducts(results);
}

/* --------------------------------------------------------------------------
   UTILITY — HTML escaping
   Prevents XSS if product data ever contains special characters
   -------------------------------------------------------------------------- */
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
