const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const toast = document.getElementById("toast");
const dialog = document.getElementById("courseDialog");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("courseSearch").addEventListener("input", event => {
  const query = event.target.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".course-card").forEach(card => {
    const match = (card.dataset.search + " " + card.innerText).toLowerCase().includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  document.getElementById("noCourses").hidden = visible !== 0;
});

document.querySelectorAll(".course-detail").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("dialogTitle").textContent = button.dataset.title;
    document.getElementById("dialogInfo").textContent = button.dataset.info;
    dialog.showModal();
  });
});
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
document.getElementById("dialogDone").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
document.getElementById("year").textContent = new Date().getFullYear();

function updateConnectionStatus() {
  const status = document.getElementById("connectionStatus");
  if (navigator.onLine) {
    status.textContent = "Online";
    status.style.background = "#d7eee6";
    status.style.color = "#176c58";
  } else {
    status.textContent = "Offline mode";
    status.style.background = "#fff0df";
    status.style.color = "#925817";
    showToast("You are offline. Cached pages may still be available.");
  }
}
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
updateConnectionStatus();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("Service worker registered"))
      .catch(error => console.log("Service worker registration failed:", error));
  });
}

let installPrompt;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
  installBtn.hidden = false;
});
installBtn.addEventListener("click", async () => {
  if (!installPrompt) {
    showToast("If installation is supported, use your browser menu and choose Install app or Add to Home Screen.");
    return;
  }
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installBtn.hidden = true;
});
window.addEventListener("appinstalled", () => showToast("CampusConnect was installed successfully."));
