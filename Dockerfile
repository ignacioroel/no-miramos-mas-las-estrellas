FROM nginx:alpine

# Actualiza los paquetes del sistema para tomar los parches de seguridad
# disponibles (evita que Trivy frene el deploy por CVEs ya corregidas).
RUN apk upgrade --no-cache

# Copia todo el sitio (html, css, js, img/, catalogos/). Lo que no va está en .dockerignore
COPY . /usr/share/nginx/html/

EXPOSE 80
