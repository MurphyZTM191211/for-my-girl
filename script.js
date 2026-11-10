const screens = [...document.querySelectorAll(".screen")];
const screenLinks = [...document.querySelectorAll("[data-screen]")];
const memoryLinks = [...document.querySelectorAll(".memory-nav [data-screen]")];

function showScreen(screenId) {
  const target = document.getElementById(screenId);
  if (!target || !target.classList.contains("screen")) return;

  screens.forEach((screen) => {
    const isActive = screen === target;
    screen.classList.toggle("active-screen", isActive);
    screen.setAttribute("aria-hidden", String(!isActive));
  });

  memoryLinks.forEach((link) => {
    const isActive = link.dataset.screen === screenId;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

screenLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const parentModal = link.closest(".modal");
    if (parentModal) closeModal(parentModal);
    showScreen(link.dataset.screen);
  });
});

const openLetterButton = document.querySelector("#openLetterBtn");
const openSecretButton = document.querySelector("#secretBtn");
const letterModal = document.querySelector("#letterModal");
const secretModal = document.querySelector("#secretModal");

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => {
    modal.querySelector(".modal-close")?.focus();
  }, 50);
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".modal.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

openLetterButton.addEventListener("click", () => openModal(letterModal));
openSecretButton.addEventListener("click", () => openModal(secretModal));

document.querySelectorAll("[data-close-modal], [data-close-letter]").forEach((closeControl) => {
  closeControl.addEventListener("click", () => {
    const modal = closeControl.closest(".modal");
    if (modal) closeModal(modal);
  });
});

document.querySelectorAll(".modal-card").forEach((card) => {
  card.addEventListener("click", (event) => event.stopPropagation());
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".modal.is-open").forEach(closeModal);
});

const passwordForm = document.querySelector("#passwordForm");
const passwordInput = document.querySelector("#secretPassword");
const passwordError = document.querySelector("#passwordError");
const passwordGate = document.querySelector("#passwordGate");
const secretContent = document.querySelector("#secretContent");
const secretButton = document.querySelector("#secretloveButton");

function resetSecret() {
  passwordGate.hidden = false;
  secretContent.hidden = true;
  passwordError.textContent = "";
  passwordInput.value = "";
}

openSecretButton.addEventListener("click", resetSecret);
document.querySelector("#quizBtn").addEventListener("click", () => {
  resetSecret();
  openModal(secretModal);
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredCode = passwordInput.value.trim().replace(/\D/g, "");

  if (enteredCode !== "191211") {
    passwordError.textContent = "Not quite, my love. Try the date from our little timer ♡";
    passwordInput.focus();
    return;
  }

  passwordGate.hidden = true;
  secretContent.hidden = false;
  secretContent.querySelector("h2").focus?.();
});

secretButton.addEventListener("click", () => {
  createHeartBurst(secretButton);
  window.setTimeout(() => {
    closeModal(secretModal);
    showScreen("closing");
  }, 420);
});

const timerElement = document.querySelector("#loveTimer");

function getAnniversaryStart(now) {
  const start = new Date(now.getFullYear(), 6, 26);
  if (start > now) start.setFullYear(start.getFullYear() - 1);
  return start;
}

function updateLoveTimer() {
  const now = new Date();
  const start = getAnniversaryStart(now);
  let seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  timerElement.textContent = `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

updateLoveTimer();
window.setInterval(updateLoveTimer, 1000);

function createHeartBurst(source) {
  const bounds = source.getBoundingClientRect();
  const symbols = ["♥", "♡", "✦", "♥", "✧", "♡"];

  symbols.forEach((symbol, index) => {
    const particle = document.createElement("span");
    const angle = (index / symbols.length) * Math.PI * 2;
    particle.className = "heart-particle";
    particle.textContent = symbol;
    particle.setAttribute("aria-hidden", "true");
    particle.style.left = `${bounds.left + bounds.width / 2}px`;
    particle.style.top = `${bounds.top + bounds.height / 2}px`;
    particle.style.setProperty("--particle-x", `${Math.cos(angle) * 54}px`);
    particle.style.setProperty("--particle-y", `${Math.sin(angle) * 54}px`);
    document.body.append(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  });
}

function makeFloatingDecorations() {
  const layer = document.querySelector("#heartsLayer");
  const decorations = [
    { symbol: "♡", className: "bg-heart" },
    { symbol: "♥", className: "bg-heart" },
    { symbol: "✿", className: "bg-flower" },
    { symbol: "❀", className: "bg-flower" },
  ];

  for (let index = 0; index < 24; index += 1) {
    const decoration = decorations[index % decorations.length];
    const element = document.createElement("span");
    element.className = `floating-decoration ${decoration.className}`;
    element.textContent = decoration.symbol;
    element.style.left = `${(index * 41 + 7) % 100}%`;
    element.style.animationDuration = `${15 + (index % 8) * 3}s`;
    element.style.animationDelay = `${-(index * 2.1)}s`;
    element.style.fontSize = `${14 + (index % 4) * 6}px`;
    element.style.setProperty("--sway", `${(index % 2 === 0 ? 1 : -1) * (18 + index % 20)}px`);
    layer.append(element);
  }
}

makeFloatingDecorations();
