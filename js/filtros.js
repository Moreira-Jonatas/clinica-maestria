document.addEventListener('DOMContentLoaded', function() {
  initFilters();
  initSearch();
  initCategoriaTabs();
});

function initFilters() {
  const filterButtons = document.querySelectorAll('[data-filtro]');
  const items = document.querySelectorAll('[data-categoria]');

  if (filterButtons.length && items.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('ativo'));
        this.classList.add('ativo');

        const filter = this.dataset.filtro;

        items.forEach(item => {
          if (filter === 'todos' || item.dataset.categoria === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => item.style.opacity = '1', 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

function initSearch() {
  const searchInput = document.getElementById('busca');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const term = this.value.toLowerCase();
      document.querySelectorAll('[data-busca]').forEach(item => {
        const text = item.dataset.busca.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
      });
    });
  }
}

function initCategoriaTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const grids = document.querySelectorAll('[data-tab-content]');

  if (tabs.length && grids.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('ativo'));
        this.classList.add('ativo');

        const target = this.dataset.tab;
        grids.forEach(grid => {
          grid.style.display = grid.dataset.tabContent === target ? 'grid' : 'none';
        });
      });
    });
  }
}
