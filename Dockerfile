FROM nginx:alpine

# Copia todo el sitio (html, css, js, img/, catalogos/). Lo que no va está en .dockerignore
COPY . /usr/share/nginx/html/

EXPOSE 80
