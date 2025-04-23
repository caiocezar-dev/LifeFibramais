// Rolagem suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const destino = document.querySelector(link.getAttribute('href'));
    if (destino) destino.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.menu').classList.remove('ativo');
    document.querySelector('.menu-btn').classList.remove('ativo');
  });
});

// Menu mobile toggle
const menuBtn = document.querySelector('.menu-btn');
const menu    = document.querySelector('.menu');
menuBtn.addEventListener('click', () => {
  menu.classList.toggle('ativo');
  menuBtn.classList.toggle('ativo');
});

// Esconder header ao rolar
let lastY = 0;
window.addEventListener('scroll', () => {
  const topo = document.querySelector('.topo');
  topo.style.top = (window.scrollY > lastY && window.scrollY > 100) ? '-80px' : '0';
  lastY = window.scrollY;
});

// ————————————————————————
// CARROSSEL DE BANNERS (inalterado)
// ————————————————————————
const slides   = document.querySelectorAll('.slide');
const prevB    = document.querySelector('.seta-banner.esquerda');
const nextB    = document.querySelector('.seta-banner.direita');
let idxB       = 0;

function showBanner(i) {
  slides.forEach(s => s.classList.remove('ativo'));
  slides[i].classList.add('ativo');
}

prevB.addEventListener('click', () => {
  idxB = (idxB - 1 + slides.length) % slides.length;
  showBanner(idxB);
});
nextB.addEventListener('click', () => {
  idxB = (idxB + 1) % slides.length;
  showBanner(idxB);
});
setInterval(() => {
  idxB = (idxB + 1) % slides.length;
  showBanner(idxB);
}, 6000);


// =============================================
// CARROSSEL DE PLANOS (3 visíveis, loop contínuo)
// =============================================
(function() {
  const wrapper     = document.querySelector('.cards-planos');
  const btnPrevP    = document.querySelector('.seta-planos.esquerda');
  const btnNextP    = document.querySelector('.seta-planos.direita');
  const cards       = Array.from(wrapper.children);
  const visiveis    = 3;
  const gap         = 32;            // gap em px (~2rem)
  const cardW       = 280 + gap;     // 280px card + gap
  let idxP          = visiveis;      // começa na “janela” do 1º card real

  // 1) clonar últimos e primeiros para loop
  const prefix = cards.slice(-visiveis).map(c => c.cloneNode(true));
  const suffix = cards.slice(0, visiveis).map(c => c.cloneNode(true));

  prefix.forEach(c => wrapper.insertBefore(c, wrapper.firstChild));
  suffix.forEach(c => wrapper.appendChild(c));

  // 2) ajustar largura e posição inicial sem animação
  wrapper.style.transition = 'none';
  wrapper.style.transform  = `translateX(-${idxP * cardW}px)`;

  // reativa transição
  setTimeout(() => wrapper.style.transition = 'transform 0.5s ease', 50);

  // 3) função de atualização
  function update() {
    wrapper.style.transform = `translateX(-${idxP * cardW}px)`;
  }

  // 4) ao final da transição, ajustar idx sem animação se for clone
  wrapper.addEventListener('transitionend', () => {
    // chegou ao clone do final? volta pro original
    if (idxP >= cards.length + visiveis) {
      wrapper.style.transition = 'none';
      idxP = visiveis;
      wrapper.style.transform = `translateX(-${idxP * cardW}px)`;
      return setTimeout(() => wrapper.style.transition = 'transform 0.5s ease', 50);
    }
    // chegou ao clone do início? volta pro final real
    if (idxP < visiveis) {
      wrapper.style.transition = 'none';
      idxP = cards.length + visiveis - 1;
      wrapper.style.transform = `translateX(-${idxP * cardW}px)`;
      return setTimeout(() => wrapper.style.transition = 'transform 0.5s ease', 50);
    }
  });

  // 5) botões de navegação
  btnNextP.addEventListener('click', () => {
    idxP++;
    update();
  });
  btnPrevP.addEventListener('click', () => {
    idxP--;
    update();
  });

  // 6) auto-play
  setInterval(() => {
    idxP++;
    update();
  }, 5000);

})();
