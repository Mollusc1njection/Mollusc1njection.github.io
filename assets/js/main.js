document.querySelectorAll("#year").forEach(el => el.textContent = new Date().getFullYear());

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
    wuList.innerHTML = sorted.map(w => {
      const cover = w.cover
        ? `<img class="wu-cover" src="${w.cover}" alt="">`
        : `<div class="wu-cover" style="display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:0.75rem;color:var(--muted);">sin portada</div>`;

      const categories = (w.categories || []).map(c =>
        `<span class="badge-pill"><span class="bd"></span>${c}</span>`
      ).join("");

      const hashtags = (w.tags || []).map(t => `<span class="tag">#${t}</span>`).join("");

      return `
        <a class="wu-card" href="${w.url}">
          ${cover}
          <div class="wu-card-body">
            <p class="wu-card-meta">${w.date}</p>
            <h3>${w.title}</h3>
            ${categories ? `<div class="badge-row">${categories}</div>` : ""}
            ${hashtags ? `<div class="hashtag-row">${hashtags}</div>` : ""}
          </div>
        </a>
      `;
    }).join("");
    setupReveal(".wu-card");
  }
}


function buildToc(){
  const toc = document.getElementById("postToc");
  const body = document.querySelector(".post-body");
  if (!toc || !body) return;

  const headings = body.querySelectorAll("h2, h3");
  const asideEl = toc.closest(".post-toc");
  if (!headings.length){

    if (asideEl) asideEl.style.display = "none";
    return;
  }
  if (asideEl) asideEl.style.display = "";

  const slugCount = {};
  const items = [];
  headings.forEach(h => {
    let slug = h.textContent.trim().toLowerCase()
      .replace(/[^a-z0-9áéíóúñ\s-]/g, "")
      .replace(/\s+/g, "-");
    if (slugCount[slug] !== undefined){
      slugCount[slug]++;
      slug = `${slug}-${slugCount[slug]}`;
    } else {
      slugCount[slug] = 0;
    }
    h.id = slug;
    items.push({ id: slug, text: h.textContent, level: h.tagName });
  });

  toc.innerHTML = items.map(it =>
    `<li style="${it.level === 'H3' ? 'padding-left:12px;' : ''}"><a href="#${it.id}">${it.text}</a></li>`
  ).join("");

  const links = toc.querySelectorAll("a");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = toc.querySelector(`a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  headings.forEach(h => io.observe(h));
}
buildToc();


document.querySelectorAll("[data-md-src]").forEach(async (el) => {
  const src = el.getAttribute("data-md-src");
  el.innerHTML = `<p class="md-loading">Cargando ${src}…</p>`;
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error("no encontrado");
    const raw = await res.text();
    if (typeof marked !== "undefined"){
      el.innerHTML = marked.parse(raw);
    } else {
      el.innerHTML = `<pre>${raw.replace(/</g, "&lt;")}</pre>`;
    }
    buildToc();
  } catch (err){
    el.innerHTML = `<p class="md-loading">No se pudo cargar ${src} (¿existe el archivo?).</p>`;
  }
});
