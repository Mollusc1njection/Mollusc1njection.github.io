/*
  Cada vez que publiques un writeup nuevo:
  1. Copia writeups/plantilla.html y renómbralo (ej: writeups/htb-forest.html)
  2. Escribe el contenido dentro de ese archivo (o usa el bloque de PDF/Markdown
     que ya trae la plantilla, ver instrucciones dentro del archivo)
  3. Agrega un objeto aquí abajo con sus datos

  El listado en writeups.html se genera automáticamente desde este archivo,
  ordenado del más reciente al más antiguo.

  Campos:
  - date, title, url: obligatorios
  - cover: ruta a una imagen de portada (opcional, ej "writeups/img/forest.png")
  - categories: plataforma/tipo, se muestran como pastillas (ej ["HackTheBox","Windows"])
  - tags: hashtags técnicos (ej ["ActiveDirectory","PrivEsc"])
*/

const WRITEUPS = [
  {
    date: "2026-01-15",
    title: "[Nombre de la máquina/reto] — ejemplo de plantilla",
    cover: "",
    categories: ["HackTheBox", "Windows"],
    tags: ["ActiveDirectory", "PrivEsc"],
    url: "writeups/plantilla.html"
  },

  // Agrega tus próximos writeups aquí, ej:
  // {
  //   date: "2026-02-03",
  //   title: "HTB - Nombre de la máquina",
  //   cover: "writeups/img/nombre.png",
  //   categories: ["HackTheBox", "Linux"],
  //   tags: ["SQLi", "PrivEsc"],
  //   url: "writeups/htb-nombre.html"
  // },
];
