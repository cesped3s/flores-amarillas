/* =====================================================================
   CONFIGURACIÓN  ·  Aquí editas TODO el contenido, sin tocar el código.
   En GitHub: abre este archivo → lápiz ✏️ (Edit) → cambia → "Commit changes".
   ===================================================================== */

window.CONFIG = {

  /* Pantalla de entrada */
  intro: {
    titulo: "Para ti, mi amor",
    subtitulo: "Feliz comienzo de primavera",
    boton: "Entrar a la galaxia",
  },

  /* Texto pequeño arriba de la galaxia */
  titulo: "Feliz Primavera 🌻",

  /* Frase dentro del corazón de estrellas */
  corazon: "Te amo 💛",

  /* Palabras que flotan por la galaxia (agrega o borra las que quieras) */
  palabras: [
    "Te Amo 💛", "Mi Amor 💛", "Me encantas 🌻", "Eres mi sol 🌞",
    "Siempre juntos 💛", "Eres preciosa 🌼", "Amor de mi vida 💛", "Te adoro 💐",
    "Eres mi todo 🌻", "My Love 💛", "Mi girasol 🌻", "Mi lugar seguro 🏡",
  ],


  /* Carta final: aparece sola cuando ya abrió todos los ramos */
  final: {
    titulo: "Los abriste todos",
    mensaje: "Cada uno de estos ramos era una forma distinta de decirte lo mismo.\nGracias por ser mi primavera todo el año.",
    destacado: "Te amo",
  },

  /* Música (opcional). Sube tu mp3 al repositorio y pon su nombre aquí.
     Ejemplo: "musica.mp3". Déjalo vacío ("") para no usar música. */
  musica: "fotos/music.mp3",

  /* ===================================================================
     RAMOS  ·  Cada ramo se puede tocar y abre una tarjeta.
     Campos:
       nombre    → título del ramo y de la tarjeta
       estilo    → la forma del ramo. Elige uno:
                   redondo · grande · alto · corazon · cascada
                   canasta · maceta · mini · corona · jarron
       papel     → color del envoltorio (opcional):
                   crema · rosa · kraft · blanco · lila · verde · dorado
       color     → color del resplandor que rodea al ramo (hex)
       tam       → tamaño del ramo (unos 45 a 75)
       mensaje   → texto de la tarjeta (puedes usar \n para saltos de línea)
       destacado → palabra o frase grande y dorada al final (opcional)
       fotos     → hasta 3 fotos: { src: "fotos/archivo.jpg", pie: "texto" }
                   Si la foto no existe, se muestra una imagen de girasol.
     =================================================================== */
  planetas: [
    {
      nombre: "Nuestro comienzo",
      estilo: "redondo",
      papel: "crema",
      color: "#ffc400",
      tam: 62,
      mensaje: "Cada girasol sigue al sol. Yo te sigo a ti, todos los días.\nGracias por hacer que todo empezara así de bonito.",
      destacado: "AMARILLAS",
      fotos: [
        { src: "fotos/1.jpeg", pie: "Mi amor" },
        { src: "fotos/2.jpeg", pie: "Te amo" },
      ],
    },
    {
      nombre: "Mi persona favorita",
      estilo: "corona",
      color: "#ffb43a",
      tam: 58,
      mensaje: "Si el universo tuviera un centro, sería el lugar donde estás tú.",
      fotos: [{ src: "fotos/3.jpeg", pie: "Mi persona favorita" }],
    },
    {
      nombre: "Risas infinitas",
      estilo: "grande",
      papel: "kraft",
      color: "#ffcf5a",
      tam: 52,
      mensaje: "Contigo hasta los días malos terminan en risa.\nNunca dejes de reírte así.",
      fotos: [{ src: "fotos/4.jpeg", pie: "Ese día" }],
    },
    {
      nombre: "Aventuras",
      estilo: "canasta",
      color: "#f2e28a",
      tam: 48,
      mensaje: "Faltan muchos lugares por conocer y quiero recorrerlos todos contigo.",
      fotos: [{ src: "fotos/5.jpeg", pie: "Nuestro viaje" }],
    },
    {
      nombre: "Latidos",
      estilo: "corazon",
      papel: "rosa",
      color: "#ff7a9a",
      tam: 54,
      mensaje: "Mi corazón tiene tu nombre escrito en cada latido.",
      destacado: "Te amo",
      fotos: [{ src: "fotos/6.jpeg", pie: "Mi corazón" }],
    },
    {
      nombre: "Sueños",
      estilo: "cascada",
      papel: "lila",
      color: "#ffb347",
      tam: 56,
      mensaje: "Quiero cumplir todos mis sueños, y que tú estés en cada uno.",
      fotos: [{ src: "fotos/7.jpeg", pie: "Lo que viene" }],
    },
    {
      nombre: "Abrazos",
      estilo: "jarron",
      color: "#ffd166",
      tam: 50,
      mensaje: "Tus abrazos son el único lugar donde todo se calma.",
      fotos: [{ src: "fotos/abrazo.jpeg", pie: "Mi lugar seguro" }],
    },
    {
      nombre: "Para siempre",
      estilo: "alto",
      papel: "blanco",
      color: "#fff0a0",
      tam: 46,
      mensaje: "Te elegí ayer, te elijo hoy y te voy a elegir siempre.\nFeliz primavera, mi amor.",
      destacado: "Siempre juntos",
      fotos: [
        { src: "fotos/9.jpeg", pie: "Tú y yo" },
        { src: "fotos/10.jpeg", pie: "Para siempre" },
        { src: "fotos/11.jpeg", pie: "Mi girasol" },
      ],
    },
  ],
};
