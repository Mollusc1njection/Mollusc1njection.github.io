// Año en el footer
document.querySelectorAll("#year").forEach(el => el.textContent = new Date().getFullYear());

// Menú móvil
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks){
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}


const term = document.getElementById("termBody");
if (term){
  const script = [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "sebastian" },
    { type: "cmd", text: "cat resumen.txt" },
    { type: "out", text: "¡Bienvenido a mi pagina! Preparate Hacker, porque veras muchas cosas interesantes en esta pagina" },
    { type: "cmd", text: "ls certs/ | wc -l" },
    { type: "out", text: "[N] certificaciones activas — ver abajo ↓" },
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion){
    // Sin animación: mostrar todo directo
    term.innerHTML = script.map(l =>
      l.type === "cmd"
        ? `<p class="terminal-line"><span class="prompt">$</span> ${l.text}</p>`
        : `<p class="terminal-out">${l.text}</p>`
    ).join("");
  } else {
    let i = 0;
    function typeLine(){
      if (i >= script.length) return;
      const line = script[i];
      const p = document.createElement("p");
      p.className = line.type === "cmd" ? "terminal-line" : "terminal-out";
      if (line.type === "cmd") p.innerHTML = '<span class="prompt">$</span> ';
      term.appendChild(p);

      let charIndex = 0;
      const speed = line.type === "cmd" ? 38 : 10;
      const interval = setInterval(() => {
        p.append ? null : null;
        if (line.type === "cmd"){
          p.innerHTML = '<span class="prompt">$</span> ' + line.text.slice(0, charIndex + 1);
        } else {
          p.textContent = line.text.slice(0, charIndex + 1);
        }
        charIndex++;
        if (charIndex >= line.text.length){
          clearInterval(interval);
          i++;
          setTimeout(typeLine, line.type === "cmd" ? 220 : 380);
        }
      }, speed);
    }
    typeLine();

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    term.appendChild(cursor);
  }
}


function setupReveal(selector){
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return; // se quedan visibles, sin animación

  els.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .5s ease, transform .5s ease";
    el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => io.observe(el));
}

[
  ".teaser-card",
  ".cert-card",
  ".log-row",
  ".proj-card",
  ".contact-list li"
].forEach(setupReveal);

const wuList = document.getElementById("wuList");
if (wuList && typeof WRITEUPS !== "undefined"){
  const sorted = [...WRITEUPS].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0){
    wuList.innerHTML = `<p style="color:var(--muted); font-family:var(--mono); font-size:0.9rem;">
      Todavía no hay writeups publicados. Agrega el primero en assets/js/writeups-data.js
    </p>`;
  } else {
    wuList.innerHTML = sorted.map(w => `
      <div class="wu-row">
        <span class="wu-date">${w.date}</span>
        <div class="wu-title">
          <a href="${w.url}">${w.title}</a>
          <div class="wu-tags">
            ${w.tags.map(t => `<span class="tag">${t}</span>`).join("")}
          </div>
        </div>
      </div>
    `).join("");
    setupReveal(".wu-row");
  }
}
