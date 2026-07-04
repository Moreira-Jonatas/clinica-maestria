document.addEventListener('DOMContentLoaded', function() {
  highlightCurrentPage();
});

function highlightCurrentPage() {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath) {
      const normalized = linkPath.replace('./', '').replace(/\/$/, '');
      if (currentPath.includes(normalized) && normalized !== '') {
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
