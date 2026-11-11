// Visor de fotos: al hacer clic en una foto se agranda.
// Las flechas recorren las fotos del mismo módulo.

export function wrapIndex(index, length) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function readFoto(figure) {
  const img = figure.querySelector('img');
  return {
    src: img?.getAttribute('src') ?? '',
    alt: img?.getAttribute('alt') ?? '',
    caption: figure.querySelector('figcaption')?.textContent.trim() ?? '',
  };
}

export function initGallery(doc = document) {
  const lb = doc.getElementById('lightbox');
  if (!lb) return;

  const $ = (sel) => lb.querySelector(sel);
  let group = [];
  let current = 0;

  function show(index) {
    current = wrapIndex(index, group.length);
    const foto = readFoto(group[current]);
    $('.lb-img').src = foto.src;
    $('.lb-img').alt = foto.alt;
    $('.lb-caption').textContent = foto.caption;
  }

  doc.querySelectorAll('.modulo').forEach((modulo) => {
    const fotos = [...modulo.querySelectorAll('.foto')];
    fotos.forEach((fig, i) => {
      const open = () => {
        group = fotos;
        show(i);
        if (!lb.open) lb.showModal();
      };
      fig.addEventListener('click', open);
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  });

  $('.lb-close').addEventListener('click', () => lb.close());
  $('.lb-prev').addEventListener('click', () => show(current - 1));
  $('.lb-next').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => {
    if (e.target === lb) lb.close();
  });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}
