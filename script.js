/* =========================================================
   Reencuentro Promoción 99 · I.E. N.° 80175 Daniel Alcides Carrión
   script.js
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIGURACIÓN  ✏️  (edita aquí los datos del evento)
   --------------------------------------------------------- */
const CONFIG = {
  // Fecha y hora del reencuentro (formato AAAA-MM-DDTHH:MM:SS, hora de Perú).
  // Si aún no hay fecha, deja null y se mostrará "Por confirmar".
  eventDate: "2026-12-19T19:00:00",
  eventPlace: "Por confirmar",       // Ej.: "Local comunal El Calvario"
  promoYear: 1999,
  storageKey: "promo99_recuerdos_v1",
  maxPhotoSize: 720,                 // px del lado mayor tras optimizar
  photoQuality: 0.82
};

/* Mensajes motivacionales que rotan en la página */
const HERO_QUOTES = [
  "Los años pasan, pero la amistad de verdad no se gradúa nunca.",
  "Volvimos a crecer, pero el corazón sigue en el mismo salón.",
  "Cada uno tomó su camino; hoy todos los caminos vuelven a El Calvario.",
  "Hay abrazos que esperan años… y este es uno de ellos.",
  "Lo que vivimos en el cole no se olvida: se celebra.",
  "Somos la Promo 99: diferentes historias, un mismo origen."
];

const FORM_MOTIVATIONS = [
  "✨ Tu foto puede ser la que le saque una sonrisa a toda la promo.",
  "📸 No importa si es de ayer o de hoy: lo importante es que estés.",
  "💙 Un mensaje tuyo puede alegrarle el día a un viejo amigo.",
  "🎓 Carrionistas de corazón: ¡que no falte tu cara en el muro!",
  "🤝 Cuantos más seamos en el muro, más grande será el reencuentro."
];

const CLOSING_QUOTES = [
  "“No importa cuántos años pasen: cuando nos juntamos, volvemos a tener 16.”",
  "“Los mejores recuerdos no se guardan en fotos, se comparten en persona.”",
  "“El tiempo nos cambió el rostro, pero no el cariño.”"
];

const WELCOME_MESSAGES = {
  morning:   "☀️ ¡Buenos días, promo! Qué gusto tenerte por aquí.",
  afternoon: "🌤️ ¡Buenas tardes, promo! El reencuentro te espera.",
  night:     "🌙 ¡Buenas noches, promo! Deja tu recuerdo antes de dormir."
};

/* ---------------------------------------------------------
   2. ALMACENAMIENTO
   Por defecto guarda en el navegador (localStorage).
   Para que TODOS vean las fotos de TODOS, reemplaza estas
   dos funciones por llamadas a un backend (Firebase, Supabase,
   Google Apps Script, PHP + MySQL, etc.). El resto del código
   no necesita cambios.
   --------------------------------------------------------- */
const Store = {
  async getAll() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
    } catch {
      return [];
    }
  },
  async add(entry) {
    const all = await this.getAll();
    all.unshift(entry);
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(all));
    } catch (err) {
      throw new Error("No hay espacio suficiente para guardar la foto. Prueba con una imagen más pequeña.");
    }
    return entry;
  }
};

/* ---------------------------------------------------------
   3. UTILIDADES
   --------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const pad = n => String(n).padStart(2, "0");

function rotateText(el, list, interval = 5000) {
  if (!el) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % list.length;
    el.classList.add("is-out");
    el.style.opacity = "0";
    setTimeout(() => {
      el.textContent = list[i];
      el.classList.remove("is-out");
      el.style.opacity = "";
    }, 500);
  }, interval);
}

let toastTimer;
function showToast(message, ms = 4200) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), ms);
}

function normalize(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/* ---------------------------------------------------------
   4. NAVEGACIÓN, SCROLL Y ANIMACIONES
   --------------------------------------------------------- */
function initNav() {
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-visible", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach(a => a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    io.observe(el);
  });
}

function initParticles() {
  const box = $("#particles");
  if (!box) return;
  const count = window.innerWidth < 600 ? 16 : 32;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const size = Math.random() * 3 + 2;
    p.style.left = `${Math.random() * 100}%`;
    p.style.width = p.style.height = `${size}px`;
    p.style.animationDuration = `${Math.random() * 10 + 9}s`;
    p.style.animationDelay = `${Math.random() * -18}s`;
    if (Math.random() > 0.6) {
      p.style.background = "#8fa2ff";
      p.style.boxShadow = "0 0 10px #8fa2ff";
    }
    box.appendChild(p);
  }
}

function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const from = target > 1000 ? target - 60 : 0;
  const step = now => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (target - from) * eased);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateCounter(el, Number(el.dataset.count || el.textContent));
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$(".stat__num").forEach(el => io.observe(el));
}

/* ---------------------------------------------------------
   5. DATOS DEL EVENTO Y CUENTA REGRESIVA
   --------------------------------------------------------- */
function initEvent() {
  const eventDate = CONFIG.eventDate ? new Date(CONFIG.eventDate) : null;
  const refYear = eventDate ? eventDate.getFullYear() : new Date().getFullYear();
  const years = refYear - CONFIG.promoYear;

  $("#yearsSince").textContent = years;
  $("#statYears").dataset.count = years;
  $("#eventPlaceText").textContent = CONFIG.eventPlace;
  $("#year").textContent = new Date().getFullYear();

  const countdown = $("#countdown");
  if (!eventDate || isNaN(eventDate)) {
    countdown.innerHTML = '<p class="countdown__soon">📅 Fecha por anunciar · ¡atento a la convocatoria!</p>';
    return;
  }

  const dateFmt = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeFmt = new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateText = dateFmt.format(eventDate);
  $("#eventDateText").textContent = dateText.charAt(0).toUpperCase() + dateText.slice(1);
  $("#eventTimeText").textContent = timeFmt.format(eventDate);

  const els = {
    d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMinutes"), s: $("#cdSeconds")
  };

  const tick = () => {
    const diff = eventDate - new Date();
    if (diff <= 0) {
      countdown.classList.add("is-today");
      countdown.innerHTML = "🎉 ¡Llegó el día del reencuentro, promo! 🎉";
      clearInterval(timer);
      return;
    }
    els.d.textContent = pad(Math.floor(diff / 86400000));
    els.h.textContent = pad(Math.floor((diff / 3600000) % 24));
    els.m.textContent = pad(Math.floor((diff / 60000) % 60));
    els.s.textContent = pad(Math.floor((diff / 1000) % 60));
  };
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------------------------------------------------------
   6. FORMULARIO + VISTA PREVIA
   --------------------------------------------------------- */
let currentPhoto = null; // dataURL optimizado

/* Redimensiona y comprime la foto en el navegador */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => reject(new Error("El archivo no parece ser una imagen válida."));
      img.onload = () => {
        const scale = Math.min(1, CONFIG.maxPhotoSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", CONFIG.photoQuality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function setError(id, msg) {
  $(`#${id}`).textContent = msg || "";
  const map = { errPhoto: "#dropzone", errName: "#nameInput", errMsg: "#msgInput" };
  const target = $(map[id]);
  const holder = target.classList.contains("dropzone") ? target : target.closest(".field");
  holder.classList.toggle("has-error", Boolean(msg));
}

function updatePreview() {
  const name = $("#nameInput").value.trim();
  const msg = $("#msgInput").value.trim();
  $("#previewNameFront").textContent = name || "Tu nombre";
  $("#previewNameBack").textContent = `— ${name || "Tu nombre"}`;
  $("#previewMsg").textContent = msg || "Aquí se verá tu mensaje para la promo…";

  const photoBox = $("#previewPhoto");
  photoBox.innerHTML = "";
  if (currentPhoto) {
    const img = document.createElement("img");
    img.src = currentPhoto;
    img.alt = "Vista previa de tu foto";
    photoBox.appendChild(img);
  } else {
    photoBox.innerHTML = '<span class="polaroid__placeholder">Tu foto aquí</span>';
  }
}

async function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setError("errPhoto", "Elige un archivo de imagen (JPG o PNG).");
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    setError("errPhoto", "La imagen es muy pesada (máx. 15 MB).");
    return;
  }
  try {
    currentPhoto = await compressImage(file);
    const img = $("#dropzoneImg");
    img.src = currentPhoto;
    img.hidden = false;
    $("#dropzoneContent").hidden = true;
    $("#dropzone").classList.add("has-image");
    setError("errPhoto", "");
    updatePreview();
    showToast("📸 ¡Qué buena foto! Ahora escribe tu mensaje.");
  } catch (err) {
    setError("errPhoto", err.message);
  }
}

function initForm() {
  const form = $("#memoryForm");
  const dropzone = $("#dropzone");
  const fileInput = $("#photoInput");
  const nameInput = $("#nameInput");
  const msgInput = $("#msgInput");
  const counter = $("#msgCount");
  const submitBtn = $("#submitBtn");
  const previewCard = $("#previewCard");

  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

  ["dragenter", "dragover"].forEach(ev => dropzone.addEventListener(ev, e => {
    e.preventDefault();
    dropzone.classList.add("is-drag");
  }));
  ["dragleave", "drop"].forEach(ev => dropzone.addEventListener(ev, e => {
    e.preventDefault();
    dropzone.classList.remove("is-drag");
  }));
  dropzone.addEventListener("drop", e => handleFile(e.dataTransfer.files[0]));

  nameInput.addEventListener("input", () => { setError("errName", ""); updatePreview(); });

  msgInput.addEventListener("input", () => {
    const len = msgInput.value.length;
    counter.textContent = len;
    counter.parentElement.classList.toggle("is-near", len > 190);
    setError("errMsg", "");
    updatePreview();
  });
  msgInput.addEventListener("focus", () => previewCard.classList.add("is-flipped"));
  nameInput.addEventListener("focus", () => previewCard.classList.remove("is-flipped"));

  $$(".chip[data-suggest]").forEach(chip => chip.addEventListener("click", () => {
    msgInput.value = chip.dataset.suggest;
    msgInput.dispatchEvent(new Event("input"));
    previewCard.classList.add("is-flipped");
  }));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = nameInput.value.trim().replace(/\s+/g, " ");
    const message = msgInput.value.trim();
    let ok = true;

    if (!currentPhoto) { setError("errPhoto", "Sube una foto para tu tarjeta."); ok = false; }
    if (name.length < 3) { setError("errName", "Escribe tu nombre (mínimo 3 letras)."); ok = false; }
    if (message.length < 5) { setError("errMsg", "Déjale un mensajito a la promo (mínimo 5 caracteres)."); ok = false; }
    if (!ok) {
      showToast("💡 Te falta poco: completa los campos marcados.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");

    try {
      const entry = {
        id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
        name,
        message,
        photo: currentPhoto,
        createdAt: new Date().toISOString()
      };
      await Store.add(entry);
      await renderWall(entry.id);

      form.reset();
      currentPhoto = null;
      counter.textContent = "0";
      $("#dropzoneImg").hidden = true;
      $("#dropzoneContent").hidden = false;
      dropzone.classList.remove("has-image");
      previewCard.classList.remove("is-flipped");
      updatePreview();

      launchConfetti();
      showToast(`🎉 ¡Gracias, ${name.split(" ")[0]}! Tu recuerdo ya brilla en el muro de la Promo 99.`, 5500);
      setTimeout(() => $("#muro").scrollIntoView({ behavior: "smooth" }), 700);
    } catch (err) {
      showToast(`⚠️ ${err.message}`, 6000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
    }
  });

  // Voltear la vista previa
  const flip = () => previewCard.classList.toggle("is-flipped");
  previewCard.addEventListener("click", flip);
  previewCard.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
}

/* ---------------------------------------------------------
   7. MURO DE RECUERDOS
   --------------------------------------------------------- */
function createCard(entry, isNew) {
  // Se usa textContent (no innerHTML) para el contenido del usuario → seguro ante XSS
  const card = document.createElement("article");
  card.className = "flip-card" + (isNew ? " is-new" : "");
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Recuerdo de ${entry.name}. Presiona para leer su mensaje.`);
  card.dataset.name = normalize(entry.name);

  card.innerHTML = `
    <div class="flip-card__inner">
      <div class="flip-card__front">
        <div class="polaroid">
          <div class="polaroid__photo"><img loading="lazy" alt=""></div>
          <p class="polaroid__caption"></p>
        </div>
      </div>
      <div class="flip-card__back">
        <div class="note">
          <p class="note__msg"></p>
          <p class="note__name"></p>
          <span class="note__stamp">Promo 99</span>
        </div>
      </div>
    </div>`;

  const img = $("img", card);
  img.src = entry.photo;
  img.alt = `Foto de ${entry.name}`;
  $(".polaroid__caption", card).textContent = entry.name;
  $(".note__msg", card).textContent = entry.message;
  $(".note__name", card).textContent = `— ${entry.name}`;

  const flip = () => card.classList.toggle("is-flipped");
  card.addEventListener("click", flip);
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
  return card;
}

async function renderWall(newId = null) {
  const grid = $("#wallGrid");
  const entries = await Store.getAll();
  grid.innerHTML = "";

  entries.forEach((entry, i) => {
    const card = createCard(entry, entry.id === newId);
    card.style.animationDelay = `${Math.min(i, 12) * 0.05}s`;
    grid.appendChild(card);
  });

  const total = entries.length;
  $("#emptyState").hidden = total > 0;
  $("#wallCount").textContent = `${total} ${total === 1 ? "recuerdo" : "recuerdos"}`;
  const statWall = $("#statWall");
  statWall.dataset.count = total;
  statWall.textContent = total;

  applySearch();
}

function applySearch() {
  const q = normalize($("#searchInput").value.trim());
  const grid = $("#wallGrid");
  let visible = 0;
  $$(".flip-card", grid).forEach(card => {
    const show = !q || card.dataset.name.includes(q);
    card.hidden = !show;
    if (show) visible++;
  });
  $(".no-results", grid)?.remove();
  if (q && visible === 0) {
    const p = document.createElement("p");
    p.className = "no-results";
    p.textContent = "Aún no encontramos a ese compañero… ¡invítalo a subir su foto! 📲";
    grid.appendChild(p);
  }
}

/* ---------------------------------------------------------
   8. CONFETI (colores de la insignia)
   --------------------------------------------------------- */
function launchConfetti() {
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ["#ebce2c", "#e69e26", "#d7262b", "#3f3f95", "#4a5bd1", "#ffffff"];
  const pieces = Array.from({ length: 160 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200,
    y: innerHeight * 0.55,
    w: Math.random() * 8 + 5,
    h: Math.random() * 5 + 3,
    vx: (Math.random() - 0.5) * 16,
    vy: Math.random() * -16 - 6,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  const start = performance.now();
  const frame = now => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach(p => {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (now - start < 3500) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------
   9. MENSAJES DE BIENVENIDA
   --------------------------------------------------------- */
function welcome() {
  const h = new Date().getHours();
  const key = h < 12 ? "morning" : h < 19 ? "afternoon" : "night";
  const firstVisit = !sessionStorage.getItem("promo99_welcomed");
  if (firstVisit) {
    sessionStorage.setItem("promo99_welcomed", "1");
    setTimeout(() => showToast(WELCOME_MESSAGES[key]), 1200);
  }

  // Un empujoncito si el visitante llega al muro sin haber publicado
  let nudged = false;
  const io = new IntersectionObserver(async entries => {
    if (nudged || !entries[0].isIntersecting) return;
    nudged = true;
    const total = (await Store.getAll()).length;
    showToast(total
      ? `💙 Ya somos ${total} en el muro. ¿Y tú cuándo te sumas?`
      : "💙 El muro está esperando su primera foto… ¿será la tuya?");
  }, { threshold: 0.3 });
  io.observe($("#muro"));
}

/* ---------------------------------------------------------
   10. INICIO
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  initEvent();
  initNav();
  initParticles();
  initReveal();
  initForm();
  await renderWall();
  initCounters();
  $("#searchInput").addEventListener("input", applySearch);

  rotateText($("#heroQuote"), HERO_QUOTES, 5200);
  rotateText($("#formMotivation"), FORM_MOTIVATIONS, 6000);
  rotateText($("#closingQuote"), CLOSING_QUOTES, 7000);
  welcome();
});
