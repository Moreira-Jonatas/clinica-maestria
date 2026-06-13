document.addEventListener('DOMContentLoaded', function() {
  highlightCurrentPage();
  initSubmenu();
});

function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && currentPath.includes(linkPath.replace('./', '').replace('/', ''))) {
      link.classList.add('ativo');
    }
  });
}

function initSubmenu() {
  const servicosLink = document.querySelector('.navbar-links a[href*="servicos"]');
  if (servicosLink) {
    servicosLink.addEventListener('mouseenter', function() {
      const submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains('submenu')) {
        submenu.classList.add('ativo');
      }
    });
  }
}

document.addEventListener('click', function(e) {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.navbar-links');
  if (toggle && links && !toggle.contains(e.target) && !links.contains(e.target)) {
    toggle.classList.remove('ativo');
    links.classList.remove('ativo');
  }
});
