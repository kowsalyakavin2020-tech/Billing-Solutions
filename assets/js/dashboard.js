/* ===================== Stackly — Dashboard logic ===================== */
let currentRole = "admin";
let currentEmail = "guest@stackly.io";

// panels that have separate admin/client content behind one nav button
const ROLE_SPLIT_PANELS = ["invoices", "payments", "subscriptions", "insights"];

function resolvePanelId(key, role) {
  if (key === "overview") return "panel-overview-" + role;
  if (ROLE_SPLIT_PANELS.includes(key)) return "panel-" + key + "-" + role;
  return "panel-" + key; // clients, wallet, settings — already role-exclusive or shared
}

(() => {
  const email = sessionStorage.getItem("stackly_email") || "guest@stackly.io";
  const role = sessionStorage.getItem("stackly_role") || "admin";
  currentRole = role;
  currentEmail = email;

  document.getElementById("userEmailDisplay").textContent = email;
  document.getElementById("userRoleDisplay").textContent = role;
  document.getElementById("userAvatar").textContent = email.charAt(0).toUpperCase();
  document.getElementById("userEmailDisplayMobile").textContent = email;
  document.getElementById("userRoleDisplayMobile").textContent = role;
  document.getElementById("userAvatarMobile").textContent = email.charAt(0).toUpperCase();
  const se = document.getElementById("settingsEmail"), sr = document.getElementById("settingsRole");
  if (se) se.value = email;
  if (sr) sr.value = role.charAt(0).toUpperCase() + role.slice(1);

  const overviewAdminNav = document.getElementById("overviewAdminNav");
  const overviewClientNav = document.getElementById("overviewClientNav");

  if (role === "admin") {
    document.getElementById("clientsNavItem").style.display = "flex";
    overviewAdminNav.style.display = "flex";
    overviewClientNav.style.display = "none";
    overviewAdminNav.classList.add("active");
    overviewClientNav.classList.remove("active");
  } else {
    document.getElementById("walletNavItem").style.display = "flex";
    overviewClientNav.style.display = "flex";
    overviewAdminNav.style.display = "none";
    overviewClientNav.classList.add("active");
    overviewAdminNav.classList.remove("active");
  }

  // show the correct starting panel for this role
  document.getElementById(resolvePanelId("overview", role))?.classList.add("active");
  document.getElementById("panelTitle").textContent = "Welcome back, " + email;
})();

const navItems = document.querySelectorAll(".dash-nav-item[data-panel]");
navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    document.querySelectorAll(".dash-panel").forEach(p => p.classList.remove("active"));

    const key = item.dataset.panel.replace("-admin", "").replace("-client", ""); // normalize overview-admin/overview-client
    const baseKey = key === "overview-admin" || key === "overview-client" ? "overview" : key;
    const targetId = resolvePanelId(baseKey, currentRole);
    document.getElementById(targetId)?.classList.add("active");

    document.getElementById("panelTitle").textContent = "Welcome back, " + currentEmail;
    document.getElementById("dashSidebar").classList.remove("open");
  });
});

document.getElementById("dashMenuToggle")?.addEventListener("click", () => document.getElementById("dashSidebar").classList.toggle("open"));
document.getElementById("dashSidebarClose")?.addEventListener("click", () => document.getElementById("dashSidebar").classList.remove("open"));
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  sessionStorage.removeItem("stackly_email"); sessionStorage.removeItem("stackly_role");
  showToast("Logged out.", "success");
  setTimeout(() => { window.location.href = "signin.html"; }, 700);
});
document.getElementById("saveSettingsBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("settingsName");
  const nameValue = nameInput ? nameInput.value.trim() : "";

  if (!nameValue) {
    showToast("Please enter your display name.", "error");
    nameInput?.focus();
    return;
  }

  window.location.href = "404.html";
});