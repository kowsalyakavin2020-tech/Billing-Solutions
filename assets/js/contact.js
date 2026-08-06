(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const { EMAIL_RE, PHONE_RE, setFieldError, clearFieldError } = window.StackForm;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const name = form.querySelector("#cf-name");
    const email = form.querySelector("#cf-email");
    const phone = form.querySelector("#cf-phone");
    const subject = form.querySelector("#cf-subject");
    const message = form.querySelector("#cf-message");
    [name, email, subject, message].forEach(f => clearFieldError(f.closest(".field")));
    clearFieldError(phone.closest(".field"));
    if (!name.value.trim()) { setFieldError(name.closest(".field"), "Please enter your name."); valid = false; }
    if (!EMAIL_RE.test(email.value.trim())) { setFieldError(email.closest(".field"), "Please enter a valid email."); valid = false; }
    if (phone.value.trim() && !PHONE_RE.test(phone.value.trim())) { setFieldError(phone.closest(".field"), "Please enter a valid phone number."); valid = false; }
    if (!subject.value) { setFieldError(subject.closest(".field"), "Please select a subject."); valid = false; }
    if (!message.value.trim()) { setFieldError(message.closest(".field"), "Please enter a message."); valid = false; }
    if (!valid) { showToast("Please fix the highlighted fields.", "error"); return; }
    window.location.href = "404.html";
  });
})();
