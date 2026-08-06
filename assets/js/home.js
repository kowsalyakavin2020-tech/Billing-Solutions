/* ===================== Stackly — home.js ===================== */

/* ---- Hero typewriter: cycles through action words after "to" ---- */
(() => {
  const el = document.getElementById("heroTypeWord");
  if (!el) return;
  const words = ["optimize invoices.", "automate billing.", "collect payments.", "track cash flow."];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 45 : 85;
    if (!deleting && ci === word.length + 1) { delay = 1500; deleting = true; }
    if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 300; }
    setTimeout(tick, delay);
  }
  tick();
})();




/* ---- Live spotlight: auto-rotating big stat ---- */
(() => {
  const wrap = document.querySelector(".sl-spotlight");
  if (!wrap) return;
  const spots = wrap.querySelectorAll(".sl-spot");
  const dots = wrap.querySelectorAll(".sl-dots button");
  let idx = 0, timer, counted = new Set();

  function animateCount(numEl) {
    if (counted.has(numEl)) return;
    counted.add(numEl);
    const target = parseFloat(numEl.dataset.count);
    const suffix = numEl.dataset.suffix || "";
    const isDecimal = target % 1 !== 0;
    const duration = 1100;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const cur = target * p;
      numEl.textContent = (isDecimal ? cur.toFixed(2) : Math.floor(cur)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else numEl.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  function show(i) {
    spots.forEach((s, si) => s.classList.toggle("active", si === i));
    dots.forEach((d, di) => d.classList.toggle("active", di === i));
    animateCount(spots[i].querySelector(".sl-spot-num"));
    idx = i;
  }

  function next() { show((idx + 1) % spots.length); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 2600);
  }

  dots.forEach((d, i) => d.addEventListener("click", () => { show(i); resetTimer(); }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        show(0);
        resetTimer();
        io.unobserve(wrap);
      }
    });
  }, { threshold: 0.4 });
  io.observe(wrap);
})();

/* ---- Live activity feed: simulated incoming transactions ---- */
(() => {
  const list = document.getElementById("slFeedList");
  if (!list) return;

  const names = ["Aarav Studio", "Kestrel Media", "Nimbus Retail", "Verve Agency", "Orbit Labs", "Fable & Co.", "Northline Design", "Harbor Goods", "Solace Fitness", "Pixel Foundry"];
  const MAX_ITEMS = 5;

  function randomItem() {
    const isFail = Math.random() < 0.12;
    const name = names[Math.floor(Math.random() * names.length)];
    const amt = (Math.random() * 4200 + 300).toFixed(0);
    const el = document.createElement("div");
    el.className = "sl-feed-item" + (isFail ? " is-fail" : "");
    el.innerHTML = `
      <span class="sl-feed-icon"><i class="fa-solid ${isFail ? "fa-triangle-exclamation" : "fa-check"}"></i></span>
      <span class="sl-feed-text">
        <strong>${name}</strong>
        <span>${isFail ? "Payment retry scheduled" : "Invoice paid"} · just now</span>
      </span>
      <span class="sl-feed-amt">$${amt}</span>
    `;
    return el;
  }

  function pushItem() {
    const el = randomItem();
    list.prepend(el);
    while (list.children.length > MAX_ITEMS) {
      list.removeChild(list.lastElementChild);
    }
  }

  let feedTimer;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pushItem(); pushItem(); pushItem();
        feedTimer = setInterval(pushItem, 2200);
      } else {
        clearInterval(feedTimer);
      }
    });
  }, { threshold: 0.3 });
  io.observe(list);
})();

/* ---- Animated bar comparison ---- */
(() => {
  const bars = document.querySelectorAll(".bar-fill[data-width]");
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.style.width = entry.target.dataset.width + "%"; io.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => io.observe(b));
})();

/* ---- Expand cards (security section) ---- */
document.querySelectorAll(".xcard").forEach(card => {
  card.addEventListener("click", () => card.classList.toggle("open"));
});

/* ---- Plan strip: monthly/yearly toggle ---- */
(() => {
  const toggle = document.getElementById("psToggle");
  if (!toggle) return;
  const labels = document.querySelectorAll(".ps-toggle-label");
  const amt = document.querySelector(".ps-featured .ps-amt[data-monthly]");
  let yearly = false;

  toggle.addEventListener("click", () => {
    yearly = !yearly;
    toggle.classList.toggle("on", yearly);
    labels.forEach(l => l.classList.toggle("active", l.dataset.mode === (yearly ? "yearly" : "monthly")));

    if (amt) {
      amt.style.opacity = "0";
      setTimeout(() => {
        amt.textContent = yearly ? amt.dataset.yearly : amt.dataset.monthly;
        amt.style.opacity = "1";
      }, 150);
    }
  });
})();


/* ---- Premium grid stagger reveal ---- */
(() => {
  const grid = document.querySelector(".premium-grid");
  if (!grid) return;
  const cells = grid.querySelectorAll(".pg-cell");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cells.forEach(c => c.classList.add("in-view"));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  io.observe(grid);
})();

/* ---- Interactive feature showcase (tab switch) ---- */
(() => {
  const tabs = document.querySelectorAll(".sc-tab");
  const panels = document.querySelectorAll(".sc-panel-item");
  if (!tabs.length) return;
  let autoTimer;

  function activate(idx) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.target === String(idx)));
    panels.forEach(p => p.classList.toggle("active", p.dataset.panel === String(idx)));
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      activate(tab.dataset.target);
      resetAutoPlay();
    });
  });

  function resetAutoPlay() {
    clearInterval(autoTimer);
    let current = 0;
    autoTimer = setInterval(() => {
      current = (current + 1) % tabs.length;
      activate(current);
    }, 4000);
  }
  resetAutoPlay();
})();