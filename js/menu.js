const MENU_ITEMS = [
  { label: 'Home', href: 'index.html' },
  { label: 'Serviços', href: 'servicos/transtornos-neurodesenvolvimento/index.html' },
  { label: 'Produtos', href: 'produtos/index.html' },
  { label: 'Blog', href: 'blog/index.html' },
  { label: 'Equipe', href: 'equipe/index.html' },
  { label: 'Contato', href: 'contato/index.html' }
];

document.addEventListener('DOMContentLoaded', function() {
  buildNavbar();
  highlightCurrentPage();
});

function buildNavbar() {
  const linksContainer = document.querySelector('.navbar-links');
  if (!linksContainer) return;

  const depth = getDepth();
  const existingLabels = new Set();
  linksContainer.querySelectorAll('a[href^="index"]:not([href*="//"]), a[href*="/"]:not([href*="//"]):not([href^="http"]):not([href^="#"]), a[href^="../"], a[href^="../../"]').forEach(a => {
    if (a.textContent.trim()) existingLabels.add(a.textContent.trim());
  });

  MENU_ITEMS.forEach(item => {
    if (!existingLabels.has(item.label)) {
      const href = depth > 0 ? '../'.repeat(depth) + item.href : item.href;
      const a = document.createElement('a');
      a.href = href;
      a.textContent = item.label;
      const ref = linksContainer.querySelector('.navbar-busca-toggle');
      if (ref) {
        linksContainer.insertBefore(a, ref);
      } else {
        linksContainer.appendChild(a);
      }
    }
  });
}

function getDepth() {
  const path = window.location.pathname.replace(/\\/g, '/').replace(/\/[^/]*\.html$/, '/');
  const base = path.replace(/\/clinica-maestria\//, '').replace(/^\//, '');
  if (!base || base === '') return 0;
  return base.split('/').filter(Boolean).length;
}

function highlightCurrentPage() {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    const label = link.textContent.trim();
    if (linkPath) {
      const isCurrentPage = (label === 'Home' && currentPath.replace(/\/[^/]*\.html$/, '/').endsWith('/clinica-maestria/')) ||
        (currentPath.includes(linkPath.replace(/^\.\.\//g, '').replace(/^\.\//g, '').replace(/\/$/, '')) && label !== 'Home');
      if (isCurrentPage) {
        link.classList.add('ativo');
      }
    }
  });
}

// Close menu on Escape
document.addEventListener('keydown', function(e) {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.navbar-links');
  if (e.key === 'Escape' && links && links.classList.contains('ativo')) {
    links.classList.remove('ativo');
    toggle.classList.remove('ativo');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});

// Close menu on click outside
document.addEventListener('click', function(e) {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.navbar-links');
  if (toggle && links && links.classList.contains('ativo') &&
      !toggle.contains(e.target) && !links.contains(e.target)) {
    links.classList.remove('ativo');
    toggle.classList.remove('ativo');
    toggle.setAttribute('aria-expanded', 'false');
  }
});
