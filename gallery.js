// Galería con lightbox: toma los datos de cada <figure class="obra"> del HTML.

export function wrapIndex(index, length) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function readObra(figure) {
  const img = figure.querySelector('img');
  const text = (sel) => figure.querySelector(sel)?.textContent.trim() ?? '';
  return {
    src: img?.getAttribute('src') ?? '',
    alt: img?.getAttribute('alt') ?? '',
    titulo: text('.obra-titulo'),
    autor: text('.obra-autor'),
    ficha: text('.obra-ficha'),
    textoHTML: figure.querySelector('.obra-texto')?.innerHTML ?? '',
  };
}

export function initGallery(doc = document) {
  const figures = [...doc.querySelectorAll('.gallery .obra')];
  const lb = doc.getElementById('lightbox');
  if (!lb || figures.length === 0) return;

  const $ = (sel) => lb.querySelector(sel);
  let current = 0;

  function show(index) {
    current = wrapIndex(index, figures.length);
    const obra = readObra(figures[current]);
    $('.lb-img').src = obra.src;
    $('.lb-img').alt = obra.alt;
    $('.lb-titulo').textContent = obra.titulo;
    $('.lb-autor').textContent = obra.autor;
    $('.lb-ficha').textContent = obra.ficha;
    $('.lb-texto').innerHTML = obra.textoHTML;
    $('.lb-count').textContent = `${current + 1} / ${figures.length}`;
  }

  function open(index) {
    show(index);
    if (!lb.open) lb.showModal();
  }

  figures.forEach((fig, i) => {
    fig.addEventListener('click', () => open(i));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  $('.lb-close').addEventListener('click', () => lb.close());
  $('.lb-prev').addEventListener('click', () => show(current - 1));
  $('.lb-next').addEventListener('click', () => show(current + 1));

  // Cerrar al hacer clic fuera del contenido
  lb.addEventListener('click', (e) => {
    if (e.target === lb) lb.close();
  });

  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}
