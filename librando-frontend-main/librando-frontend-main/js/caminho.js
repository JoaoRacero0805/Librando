// caminho.js
document.addEventListener('DOMContentLoaded', async () => {
  /* ====== MARCAR BOTÕES ====== */
  const buttons = document.querySelectorAll('.button');
  const ofensive = document.querySelector('.daysOfensive'); // Aqui foi onde eu alterei o seletor @Eduardo
  const url = CONFIG.URL; // funciona direto
  
  // Função para marcar botão como completo
  function markCompleted(key, value = true) {
    // procura botão pelo id correspondente à key
    const button = document.querySelector(`.button[id="${key}"]`);
    if (button) {
      if (value) {
        button.classList.add('completed');
      } else {
        button.classList.remove('completed');
      }
    }
  }

  const id = localStorage.getItem('id');
  if (id) {
    try {
      // buscar quests do usuário
      const res = await fetch(`${url}/user/${id}/quests`);
      if (!res.ok) throw new Error('Falha ao buscar quests');
      const data = await res.json();
      ofensive.innerText = `${data?.ofensive?.current || 0}`; // blz
      if (data.quests && Array.isArray(data.quests)) {
        data.quests.forEach(q => {
          const button = document.querySelector(`.button[id="${q.key}"]`);
          if (button) {
            if (q.value) button.classList.add('completed');
            else button.classList.remove('completed');
          }
        });
      }
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
    }
  }

  // Atualização ao clicar  
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      button.classList.toggle('completed');
      const completed = button.classList.contains('completed');
      if (!id) return;

      try {
        const res = await fetch(`${url}/user/${id}/quest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: button.id, value: completed }),
        });
        if (!res.ok) console.error('Erro ao atualizar quest');
      } catch (err) {
        console.error('Falha na requisição:', err);
      }
    });
  });

  /* ====== DESENHO DOS CAMINHOS COM SVG (DINÂMICO) ====== */
  const container = document.querySelector('.pat');
  const svg = document.querySelector('.map-path');
  if (!container || !svg) return;

  const order = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];

  function ensurePaths(count) {
    const NS = 'http://www.w3.org/2000/svg';
    let paths = Array.from(svg.querySelectorAll('path'));
    while (paths.length < count) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', '#CDCDCD');
      p.setAttribute('stroke-width', '6');
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-dasharray', '20 30');
      svg.appendChild(p);
      paths.push(p);
    }
    while (paths.length > count) {
      svg.removeChild(paths.pop());
    }
    return Array.from(svg.querySelectorAll('path'));
  }

  function getCenter(el, refRect) {
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - refRect.left,
      y: r.top + r.height / 2 - refRect.top,
    };
  }

  function quadCurve(a, b, offsetMax = 120, direction = -1) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = -dy / dist;
    const ny = dx / dist;
    const midx = (a.x + b.x) / 2;
    const midy = (a.y + b.y) / 2;
    let offset = Math.min(offsetMax, dist * 0.35);
    if (Math.abs(dx) < 40) offset = Math.min(offset, 60);
    const cx = midx + nx * (offset * direction);
    const cy = midy + ny * (offset * direction);
    return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(
      1
    )} ${b.y.toFixed(1)}`;
  }

  function updatePaths() {
    const refRect = container.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${refRect.width} ${refRect.height}`);
    const centers = order
      .map(cls => {
        const btn = container.querySelector(`.button-container.${cls} .button`);
        return btn ? getCenter(btn, refRect) : null;
      })
      .filter(Boolean);

    const nSeg = Math.max(0, centers.length - 1);
    const paths = ensurePaths(nSeg);

    for (let i = 0; i < nSeg; i++) {
      let curveDirection = -1;
      if ([1, 2, 3].includes(i)) curveDirection = 1;
      const d = quadCurve(centers[i], centers[i + 1], 120, curveDirection);
      paths[i].setAttribute('d', d);
    }
  }

  window.addEventListener('load', updatePaths);
  window.addEventListener('resize', updatePaths);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(updatePaths);
    ro.observe(container);
    container.querySelectorAll('.button').forEach(el => ro.observe(el));
  }

  /* ====== MENU HAMBÚRGUER ====== */
  const menuBtn = document.getElementById('menuBtn');
  const menuOpcoes = document.getElementById('menuOpcoes');
  if (menuBtn && menuOpcoes) {
    menuBtn.addEventListener('click', () => {
      menuOpcoes.style.display = menuOpcoes.style.display === 'flex' ? 'none' : 'flex';
    });
    menuOpcoes.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => (menuOpcoes.style.display = 'none'));
    });
  }
});
