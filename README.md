# Galaxia de girasoles 🌻

Página web interactiva: una galaxia dorada con girasoles, un corazón de estrellas y planetas que se pueden tocar. Cada planeta abre una tarjeta con fotos y un mensaje.

- **Arrastra** para girar la galaxia
- **Rueda del mouse o pellizco** para acercar y alejar
- **Toca un planeta** para abrir su tarjeta (los planetas con un aro que pulsa aún no se han abierto)

No usa librerías ni instalación: son solo `index.html`, `style.css`, `script.js` y `config.js`.

## Cómo personalizarla

Todo el contenido está en **`config.js`**: los textos, las palabras que flotan, los planetas, los mensajes y las fotos.

1. Sube tus fotos a la carpeta `fotos/` (jpg o png, idealmente de menos de 1 MB).
2. En `config.js`, escribe el nombre de cada foto en el planeta que quieras, por ejemplo `src: "fotos/comienzo-1.jpg"`.
3. Cambia los `mensaje`, `nombre` y `destacado` por tus propias palabras.

Si una foto no existe, la tarjeta muestra un girasol en su lugar.

Estilos de planeta disponibles: `girasol`, `anillos`, `bandas`, `crateres`, `corazon`, `nebulosa`, `lunas`, `estrella`, `tierra`. Para agregar otro planeta, copia un bloque `{ ... }` dentro de `planetas`.

## Subirla a GitHub y compartir el link

1. Crea un repositorio nuevo en GitHub y sube todos los archivos y la carpeta `fotos/`.
2. Ve a **Settings → Pages**, en *Source* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`, y guarda.
3. Después de un minuto, tu página queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`. Ese es el link que puedes enviar.

Para editar desde GitHub: abre `config.js`, toca el lápiz ✏️, cambia el texto y presiona **Commit changes**. La página se actualiza sola en uno o dos minutos.

**Sobre la privacidad:** con la cuenta gratuita, GitHub Pages necesita un repositorio público, así que cualquiera que tenga el link (o encuentre el repo) puede ver las fotos. Sube solo fotos que estés cómodo compartiendo.

## Probarla en tu computador

Abre `index.html` con doble clic. No necesita servidor.
