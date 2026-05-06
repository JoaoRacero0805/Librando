// === Dados ===
const letters = [
  { letter: 'A', img: 'gestos/a.JPG', name: "'A'" },
  { letter: 'B', img: 'gestos/b.JPG', name: "'B'" },
  { letter: 'C', img: 'gestos/c.JPG', name: "'C'" },
  { letter: 'D', img: 'gestos/d.JPG', name: "'D'" },
  { letter: 'E', img: 'gestos/e.JPG', name: "'E'" },
  { letter: 'OI', img: 'gestos/oi2.mp4', name: 'Oi' },
  { letter: 'Tchau', img: 'gestos/tchau.mp4', name: "'Tchau'" },
  { letter: 'Sim', img: 'gestos/sim.mp4', name: "'Sim'" },
  { letter: 'Nao', img: 'gestos/nao.mp4', name: "'Não'" },
  { letter: 'Por favor / Com licença', img: 'gestos/pfv.mp4', name: "'Por favor' / 'Com licença'" },
  { letter: 'Obrigado', img: 'gestos/obg.mp4', name: "'Obrigado'" },
];

let currentIndex = 0;
let reachedOi = false;

// === Elementos ===
const letterImage = document.getElementById('letterImage');
const letterName = document.getElementById('letterName');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
const progressBar = document.querySelector('.progress');
const letterCard = document.querySelector('.letter-card');
const repeatButton = document.getElementById('repeatButton'); // NOVO

// Textos dinâmicos
const speech = document.querySelector('.speech-bubble');
const titleEl = document.querySelector('h2');
const questionEl = document.querySelector('.question');

const defaultSpeech = speech ? speech.textContent : '';
const defaultTitle = titleEl ? titleEl.textContent : '';
const questionTextNode = questionEl
  ? Array.from(questionEl.childNodes).find(n => n.nodeType === Node.TEXT_NODE)
  : null;
const defaultQuestion = questionTextNode ? questionTextNode.textContent.trim() : '';

const oiTexts = {
  speech: 'Agora vamos aprender como cumprimentar e se comunicar com gentileza em Libras?',
  title: 'Conheça alguns sinais essenciais:',
  question: 'SINAIS BÁSICOS',
};

// Aplica os textos
function applyTexts() {
  const elements = [
    { el: speech, newText: reachedOi ? oiTexts.speech : defaultSpeech },
    { el: titleEl, newText: reachedOi ? oiTexts.title : defaultTitle },
    { el: questionTextNode, newText: reachedOi ? oiTexts.question + ' ' : defaultQuestion + ' ' },
  ];

  elements.forEach(item => {
    if (!item.el) return;

    if (item.el.nodeType === Node.TEXT_NODE) {
      const parent = item.el.parentElement;
      parent.classList.add('fade-text', 'fade-out');
      setTimeout(() => {
        item.el.textContent = item.newText;
        parent.classList.remove('fade-out');
      }, 400);
    } else {
      item.el.classList.add('fade-text', 'fade-out');
      setTimeout(() => {
        item.el.textContent = item.newText;
        item.el.classList.remove('fade-out');
      }, 400);
    }
  });
}

// Atualiza o card
function updateStep() {
  const item = letters[currentIndex];

  // Remove vídeo antigo
  const oldVideo = document.getElementById('letterVideo');
  if (oldVideo) oldVideo.remove();

  if (item.img.endsWith('.mp4') || item.img.endsWith('.webm')) {
    letterImage.style.display = 'none';

    const video = document.createElement('video');
    video.id = 'letterVideo';
    video.src = item.img;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.width = '220px';
    video.style.height = '220px';
    video.style.borderRadius = '15px';
    video.style.objectFit = 'cover';
    video.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.1)';
    video.style.border = '4px solid #75429E';

    letterCard.insertBefore(video, nextButton);
  } else {
    letterImage.style.display = 'block';
    letterImage.src = item.img;
  }

  if (letterName) letterName.textContent = item.name;
  if (progressBar) progressBar.style.width = ((currentIndex + 1) / letters.length) * 100 + '%';

  // Atualiza textos dinâmicos
  reachedOi = letters.slice(0, currentIndex + 1).some(l => (l.letter || '').toLowerCase() === 'oi');
  applyTexts();

  // Mostrar botão final
  const finalButton = document.getElementById('finalbuton');
  if (finalButton) {
    finalButton.style.display = currentIndex === letters.length - 1 ? 'inline-block' : 'none';
  }
}

// === Eventos ===
// Botão próximo
nextButton?.addEventListener('click', () => {
  if (currentIndex < letters.length - 1) {
    currentIndex++;
    updateStep();
  } else {
    updateStep();
  }
});

// Botão voltar
prevButton?.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateStep();
  }
});

// Botão repetir
repeatButton?.addEventListener('click', () => {
  const video = document.getElementById('letterVideo');
  if (video) {
    video.currentTime = 0;
    video.play();
  }
});

// Navegação por teclado
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextButton?.click();
  if (e.key === 'ArrowLeft') prevButton?.click();
});

// Clique no card (avançar)
letterCard?.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') nextButton?.click();
});

// Inicializa
updateStep();
