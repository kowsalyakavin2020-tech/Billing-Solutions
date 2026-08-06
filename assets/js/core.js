/* ===================== STACKLY — core.js ===================== */
/* ---- Active nav link based on current page ---- */
(() => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .dropdown a, .mobile-menu a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPage = href.split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
      const parentLi = link.closest("li");
      if (parentLi) parentLi.classList.add("active");
    }
  });
})();
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  const start = performance.now();
  const wait = Math.max(0, 700 - (performance.now() - start));
  setTimeout(() => {
    if (loader) { loader.classList.add("hide"); setTimeout(() => loader.remove(), 600); }
    document.body.classList.remove("loading-lock");
  }, wait);
});

/* ---- Header + back-to-top ---- */
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (header) header.style.boxShadow = y > 10 ? "0 10px 30px rgba(0,0,0,.35)" : "none";
  const bt = document.querySelector(".back-to-top");
  if (bt) bt.classList.toggle("show", y > 600);
}, { passive: true });

/* ---- Mobile menu ---- */
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const active = hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active", active);
    document.body.classList.toggle("menu-open", active);
  });
  mobileMenu.querySelectorAll(".has-sub > a").forEach(a => {
    a.addEventListener("click", (e) => { e.preventDefault(); a.parentElement.querySelector(".sub-list").classList.toggle("open"); });
  });
  mobileMenu.querySelectorAll("a:not(.has-sub > a)").forEach(a => {
    a.addEventListener("click", () => { hamburger.classList.remove("active"); mobileMenu.classList.remove("active"); document.body.classList.remove("menu-open"); });
  });
}

/* ---- Custom cursor (dot + lagging ring) ---- */
(() => {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring || !matchMedia("(min-width:901px)").matches) return;
  let rx = 0, ry = 0, mx = 0, my = 0;
  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
  function loop() { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); }
  loop();
  document.querySelectorAll("a, button, .tilt-card, input, textarea, select").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("grow"));
    el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
  });
})();

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  revealEls.forEach(el => io.observe(el));
}

/* ---- Tilt cards (3D mouse-follow tilt) ---- */
document.querySelectorAll(".tilt-card").forEach(card => {
  if (matchMedia("(max-width:900px)").matches) return;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = "perspective(800px) rotateY(0) rotateX(0)"; });
});

/* ---- Magnetic buttons ---- */
document.querySelectorAll(".btn-primary, .btn-teal").forEach(btn => {
  if (matchMedia("(max-width:900px)").matches) return;
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
  });
  btn.addEventListener("mouseleave", () => { btn.style.transform = "none"; });
});

/* ---- Split-text stagger reveal: wrap each char/word, animate in on view ---- */
document.querySelectorAll("[data-split]").forEach(el => {
  const mode = el.dataset.split === "chars" ? "chars" : "words";
  const src = el.textContent;
  const units = mode === "chars" ? src.split("") : src.split(" ");
  el.innerHTML = units.map((u, i) => `<span class="split-unit" style="transition-delay:${i * (mode === "chars" ? 22 : 60)}ms">${u === " " ? "&nbsp;" : u}</span>${mode === "words" ? " " : ""}`).join("");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { el.classList.add("split-in"); io.unobserve(el); } });
  }, { threshold: 0.4 });
  io.observe(el);
});

/* ---- Toast ---- */
function showToast(message, type = "success") {
  let stack = document.querySelector(".toast-stack");
  if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}"></i><span>${message}</span>`;
  stack.appendChild(toast);
  setTimeout(() => { toast.classList.add("out"); setTimeout(() => toast.remove(), 400); }, 3600);
}
window.showToast = showToast;

/* ---- Form validation helpers ---- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;
function setFieldError(field, msg) { field.classList.add("invalid"); const err = field.querySelector(".error-msg"); if (err) err.textContent = msg; }
function clearFieldError(field) { field.classList.remove("invalid"); }
window.StackForm = { EMAIL_RE, PHONE_RE, setFieldError, clearFieldError };
document.querySelectorAll(".field input, .field select, .field textarea").forEach(input => {
  input.addEventListener("input", () => clearFieldError(input.closest(".field")));
});

/* ---- Accordion ---- */
document.querySelectorAll(".acc-head").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains("active");
    item.parentElement.querySelectorAll(".acc-item").forEach(i => i.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });
});

/* ---- Back to top ---- */
document.querySelector(".back-to-top")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

if (window.AOS) AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 60 });
document.getElementById("mobileMenuClose")?.addEventListener("click", () => {
  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");
  document.body.classList.remove("menu-open");
});
