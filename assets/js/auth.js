/* ===================== Stackly — Auth pages logic ===================== */

document.querySelectorAll(".rl-pw-toggle, .clean-pw-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const icon = btn.querySelector("i");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    icon.classList.toggle("fa-eye", !show);
    icon.classList.toggle("fa-eye-slash", show);
  });
});

(() => {
  const pw = document.getElementById("su-password");
  const bar = document.getElementById("pwStrengthBar");
  if (!pw || !bar) return;
  pw.addEventListener("input", () => {
    const v = pw.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    bar.style.width = (score / 4) * 100 + "%";
    bar.style.background = score <= 1 ? "#e05a4e" : score === 2 ? "#f2c94c" : "var(--teal)";
  });
})();

const AUTH_EMAIL_RE = (window.StackForm && window.StackForm.EMAIL_RE) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function markError(field, on) {
  if (!field) return;
  field.classList.toggle("field-error", on);
}
function clearAllErrors(form) {
  form.querySelectorAll(".rl-field").forEach(f => f.classList.remove("field-error"));
}

function safeToast(msg, type) {
  if (typeof showToast === "function") { showToast(msg, type); }
  else { alert(msg); }
}

/* ---- LOGIN: any valid-format email + 8+ char password logs in ---- */
(() => {
  const form = document.getElementById("loginForm");
  const submitBtn = document.getElementById("loginSubmitBtn");
  if (!form || !submitBtn) return;

  submitBtn.addEventListener("click", () => {
    clearAllErrors(form);
    let valid = true;
    const roleSelect = form.querySelector("#rl-role");
    const email = form.querySelector("#rl-email");
    const password = form.querySelector("#rl-password");
    const remember = form.querySelector("#rl-remember");

    if (roleSelect && !roleSelect.value) {
      markError(roleSelect.closest(".rl-field"), true);
      valid = false;
    }
    if (!email || !AUTH_EMAIL_RE.test(email.value.trim())) {
      markError(email?.closest(".rl-field"), true);
      valid = false;
    }
    const STRONG_PW_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!password || !STRONG_PW_RE.test(password.value)) {
      markError(password?.closest(".rl-field"), true);
      valid = false;
    }
    

    if (!valid) {
      if (remember && !remember.checked && email && AUTH_EMAIL_RE.test(email.value.trim()) && password && STRONG_PW_RE.test(password.value)) {
        safeToast('Please check "Remember me" to log in.', "error");
      } else {
        safeToast("Please fix the highlighted fields.", "error");
      }
      return;
    }

    sessionStorage.setItem("stackly_email", email.value.trim());
    sessionStorage.setItem("stackly_role", roleSelect.value);
    safeToast("Signed in — redirecting to your dashboard…", "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);
  });
})();

/* ---- SIGNUP: fill valid fields, always redirect to login ---- */
(() => {
  const form = document.getElementById("signupForm");
  const submitBtn = document.getElementById("signupSubmitBtn");
  if (!form || !submitBtn) return;

  submitBtn.addEventListener("click", () => {
    clearAllErrors(form);
    let valid = true;

    const roleSelect = form.querySelector("#su-role");
    const name = form.querySelector("#su-name");
    const email = form.querySelector("#su-email");
    const password = form.querySelector("#su-password");
    const confirm = form.querySelector("#su-confirm");
    const terms = form.querySelector("#su-terms");

    if (roleSelect && !roleSelect.value) { markError(roleSelect.closest(".rl-field"), true); valid = false; }
    if (!name || !name.value.trim()) { markError(name?.closest(".rl-field"), true); valid = false; }
    if (!email || !AUTH_EMAIL_RE.test(email.value.trim())) { markError(email?.closest(".rl-field"), true); valid = false; }
    const STRONG_PW_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!password || !STRONG_PW_RE.test(password.value)) { markError(password?.closest(".rl-field"), true); valid = false; }
    if (!confirm || confirm.value !== password.value || !confirm.value) { markError(confirm?.closest(".rl-field"), true); valid = false; }

    if (!valid) {
      safeToast("Please fix the highlighted fields.", "error");
      return;
    }
    if (terms && !terms.checked) {
      safeToast("Please accept the Terms & Privacy Policy.", "error");
      return;
    }

    safeToast("Account created — please sign in.", "success");
    setTimeout(() => { window.location.href = "signin.html"; }, 900);
  });
})();