# No miramos más las estrellas

Sitio web de la exposición: portada, texto curatorial, galería de obras con texto y catálogos en PDF.
Es un sitio estático (HTML + CSS + un poco de JS) y se publica en GitHub Pages en cada push a `main`.

## Estructura

```text
├── index.html          # Todo el contenido de la muestra
├── style.css           # Estilos (tema noche / tema claro)
├── theme.js            # Botón de tema claro/oscuro
├── gallery.js          # Galería con vista ampliada (lightbox)
├── img/obras/          # Imágenes de las obras
├── catalogos/          # PDFs (catálogo, hoja de sala, etc.)
├── *.test.js           # Tests (Vitest)
├── Dockerfile / docker-compose.yml
└── .github/workflows/deploy.yml   # Tests → Trivy → Deploy a Pages
```

## Cómo cargar el contenido

Todo se edita en `index.html`. Los textos de ejemplo están marcados con `TODO`.

**Obras**
1. Subí la imagen a `img/obras/` (jpg, png o webp; idealmente de menos de 1 MB).
2. En la sección `OBRAS`, copiá un bloque `<figure class="obra">…</figure>` y cambiá la imagen (`src` y `alt`), el título, el autor, la ficha técnica y el texto de `<div class="obra-texto">`.
3. El texto de la obra aparece al hacer clic en ella. Podés poner varios párrafos `<p>`.
4. Borrá los bloques y las imágenes de ejemplo (`obra-1.svg` … `obra-6.svg`).

**Catálogos**
1. Subí el PDF a `catalogos/`.
2. En la sección `CATÁLOGOS`, copiá un bloque `<article class="catalogo">` y cambiá el título, la descripción y las dos rutas `href`.
3. Borrá los PDFs de ejemplo.

**Museo, fechas, horarios**: en las secciones de portada (`PORTADA`) y `VISITA`.

## Correr localmente

```bash
docker compose up        # http://localhost:8080, se actualiza al guardar
```

o sin Docker: `python3 -m http.server 8080`.

## Tests

```bash
npm install
npm test
```
