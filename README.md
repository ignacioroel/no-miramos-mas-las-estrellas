# No miramos más las estrellas

Sitio web de la exposición: portada, texto curatorial, galería de obras con texto y catálogos en PDF.
Es un sitio estático (HTML + CSS + un poco de JS) y se publica en GitHub Pages en cada push a `main`.

## Diseño

Página única (one page):
1. **Inicio**: título y texto de presentación.
2. **3 módulos** uno al lado del otro (en celular quedan uno debajo del otro). Cada módulo es una grilla de 3×3:
   8 fotos alrededor y un **cuadro central más grande con texto**. Al hacer clic en una foto se agranda,
   y con las flechas se recorren las fotos de ese módulo.
3. **Catálogos** en PDF (ver / descargar) y pie con los datos del museo.

## Estructura

```text
├── index.html          # Todo el contenido
├── style.css           # Estilos (tema noche / tema claro)
├── theme.js            # Botón de tema claro/oscuro
├── gallery.js          # Visor de fotos ampliadas
├── img/modulo-1/       # 8 fotos del módulo 1 (ídem modulo-2, modulo-3)
├── catalogos/          # PDFs
├── *.test.js           # Tests (Vitest)
├── Dockerfile / docker-compose.yml
└── .github/workflows/deploy.yml   # Tests → Trivy → Deploy a GitHub Pages
```

## Cómo cargar el contenido

Todo se edita en `index.html`. Los textos de ejemplo están marcados con `TODO`.

**Fotos**
1. Subí las fotos a `img/modulo-1/`, `img/modulo-2/` y `img/modulo-3/` (jpg o webp, idealmente de menos de 1 MB).
   Lo más simple es nombrarlas igual que las de ejemplo (`foto-1.jpg` … `foto-8.jpg`) y cambiar `.svg` por `.jpg` en el HTML.
2. En cada `<figure class="foto">` cambiá:
   - `src`: la ruta de la imagen
   - `alt`: una descripción breve de la foto (para lectores de pantalla)
   - `<figcaption>`: el texto que aparece debajo cuando se agranda
3. Las fotos se recortan para llenar su cuadro. Al agrandarlas se ven completas.
4. Borrá los `.svg` de ejemplo.

**Texto central de cada módulo**: en `<div class="modulo-texto">` (número, título y párrafos).
Si el texto es largo, el cuadro crece y las fotos de esa fila se estiran para acompañarlo.

> Ojo con el orden dentro de cada módulo: 4 fotos, después el texto, después 4 fotos.

**Catálogos**: subí el PDF a `catalogos/` y cambiá las rutas `href` en la sección `CATÁLOGOS`.

**Museo, fechas, horarios**: en el inicio y en el `<footer>`.

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
