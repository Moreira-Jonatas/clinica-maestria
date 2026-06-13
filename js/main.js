document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initFaq();
  initSmoothScroll();
  initAnimations();
  initForm();
  initCounter();
  initBuscaSite();
  initBlogSearch();
});

function initNavbar() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.navbar-links');

  if (toggle && links) {
    toggle.addEventListener('click', function() {
      this.classList.toggle('ativo');
      links.classList.toggle('ativo');
    });

    document.querySelectorAll('.navbar-links a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('ativo');
        links.classList.remove('ativo');
      });
    });
  }

  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
  });
}

function initFaq() {
  document.querySelectorAll('.faq-pergunta').forEach(pergunta => {
    pergunta.addEventListener('click', function() {
      const item = this.parentElement;
      item.classList.toggle('ativo');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animar').forEach(el => observer.observe(el));
}

function initForm() {
  const form = document.querySelector('.contato-form form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Mensagem enviada!';
      btn.style.background = '#A4D097';
      setTimeout(() => {
        btn.textContent = originalText;
        this.reset();
      }, 3000);
    });
  }
}

function initBlogSearch() {
  const searchInput = document.getElementById('busca-blog');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    const term = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.blog-card');

    cards.forEach(card => {
      const busca = (card.dataset.busca || '').toLowerCase();
      if (term === '' || busca.includes(term)) {
        card.style.display = '';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

function initBuscaSite() {
  const toggle = document.getElementById('busca-toggle');
  const bar = document.getElementById('busca-barra');
  const input = document.getElementById('busca-input');
  const btn = document.getElementById('busca-btn');

  if (!toggle || !bar || !input) return;

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    bar.classList.toggle('visivel');
    if (bar.classList.contains('visivel')) {
      input.focus();
    }
  });

  function caminhoBusca() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/busca/')) return '';
    if (path.includes('/blog/post/')) return '../../busca/index.html';
    if (path.includes('/blog/') || path.includes('/servicos/') || path.includes('/equipe/') || path.includes('/contato/')) return '../busca/index.html';
    return 'busca/index.html';
  }

  function executarBusca() {
    const termo = input.value.trim();
    if (!termo) return;
    bar.classList.remove('visivel');
    input.value = '';
    const params = new URLSearchParams({ q: termo });
    const destino = caminhoBusca();
    window.location.href = destino ? (destino + '?' + params.toString()) : ('?' + params.toString());
  }

  btn.addEventListener('click', executarBusca);

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      executarBusca();
    }
  });

  document.addEventListener('click', function(e) {
    if (bar.classList.contains('visivel') && !bar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
      bar.classList.remove('visivel');
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const termoUrl = urlParams.get('q');
  if (termoUrl && document.getElementById('busca-blog')) {
    document.getElementById('busca-blog').value = termoUrl;
    document.getElementById('busca-blog').dispatchEvent(new Event('input'));
  }
}

function initCounter() {
  document.querySelectorAll('.contar').forEach(counter => {
    const target = parseInt(counter.textContent);
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;

    const update = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target + (counter.dataset.suffix || '');
        return;
      }
      counter.textContent = current;
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          update();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}
