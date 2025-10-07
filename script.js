// Year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Search filter (title only, no dependencies)
const search = document.getElementById("search");
const grid = document.getElementById("grid");
const empty = document.getElementById("empty");

function filter(q){
  const query = (q||"").trim().toLowerCase();
  let shown = 0;
  grid.querySelectorAll(".card").forEach(card => {
    const title = card.getAttribute("data-title") || "";
    const match = !query || title.includes(query);
    card.style.display = match ? "" : "none";
    if (match) shown++;
  });
  if (empty) empty.hidden = shown !== 0;
}
if (search) {
  search.addEventListener("input", () => filter(search.value));
}

// Modal launcher (robust and minimal)
const overlay = document.getElementById("overlay");
const frame = document.getElementById("frame");
const titleEl = document.getElementById("modalTitle");
const openTab = document.getElementById("openTab");
const reloadBtn = document.getElementById("reload");
const closeBtn = document.getElementById("close");

let lastFocus = null;

function openModal(title, url){
  lastFocus = document.activeElement;
  if (titleEl) titleEl.textContent = title || "Game";
  if (openTab) openTab.href = url;
  if (frame) frame.src = url;
  if (overlay) overlay.hidden = false;
  setTimeout(() => closeBtn?.focus(), 0);
}
function closeModal(){
  if (overlay) overlay.hidden = true;
  if (frame) frame.src = "about:blank";
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

document.querySelectorAll(".play").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const url = btn.getAttribute("data-url");
    const card = btn.closest(".card");
    const title = card?.querySelector("h3")?.textContent || "Game";
    if (url) openModal(title, url);
  });
});

if (reloadBtn) reloadBtn.addEventListener("click", () => {
  const src = frame?.getAttribute("src");
  if (src && frame) frame.src = src;
});
if (closeBtn) closeBtn.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  const isOpen = overlay && !overlay.hidden;
  if (!isOpen) return;
  if (e.key === "Escape") {
    e.preventDefault();
    closeModal();
  }
});