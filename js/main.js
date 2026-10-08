/* ============================================================
   LOADER  (元のロジックを維持)
   ============================================================ */
const loaderScreen = document.querySelector("[data-loader]");
const loaderWord = document.querySelector("[data-loader-word]");
const loaderStars = [...document.querySelectorAll(".loader-star")];
const osShell = document.querySelector("[data-os]");

const steps = [
  { label: "impulse...", activeStars: 1 },
  { label: "curiosity...", activeStars: 2 },
  { label: "creation!", activeStars: 3 },
];

const setStep = (step) => {
  loaderWord.classList.add("is-changing");
  window.setTimeout(() => {
    loaderWord.textContent = step.label;
    loaderStars.forEach((star, index) => {
      star.classList.toggle("is-active", index < step.activeStars);
    });
    loaderWord.classList.remove("is-changing");
  }, 220);
};

const runLoading = () => {
  steps.forEach((step, index) => {
    window.setTimeout(() => setStep(step), index * 880);
  });
  const finish = steps.length * 880 + 700;
  window.setTimeout(() => {
    loaderScreen.classList.add("is-done");
    osShell.classList.add("is-visible");
  }, finish);
};

window.addEventListener("DOMContentLoaded", runLoading);

/* ============================================================
   WINDOW NAVIGATION
   ============================================================ */
const views = [...document.querySelectorAll(".view")];
const backBtn = document.querySelector("[data-back]");
const osLabel = document.querySelector("[data-os-label]");

const labels = {
  home: "Home",
  about: "Aboutme",
  works: "works",
  music: "likemusic",
  books: "likebooks",
  contact: "contact",
  "med-dad": "資格更新ノート",
  "message-window-generator": "メッセージウィンドウジェネレーター",
  kashika: "KASHIKA",
  portfolio: "portfolio",
  pocketreception: "PocketReception",
};

const taskIcons = [...document.querySelectorAll(".task-icon")];
const windowEl = document.querySelector("[data-window]");

const isWorkDetail = (name) => ["med-dad", "message-window-generator", "kashika", "portfolio", "pocketreception"].includes(name);
let currentView = "home";

const showView = (name) => {
  currentView = name;
  const isHome = name === "home";
  document.title = isHome ? "portfolio" : `${labels[name]} | portfolio`;
  backBtn.setAttribute("aria-label", isWorkDetail(name) ? "Worksに戻る" : "ホームに戻る");

  // ホーム = ウィンドウを閉じてデスクトップ(背景)だけ表示
  windowEl.classList.toggle("is-hidden", isHome);
  backBtn.classList.toggle("is-shown", !isHome);
  osLabel.textContent = labels[name] || "Home";

  if (!isHome) {
    views.forEach((v) => v.classList.toggle("is-active", v.dataset.view === name));
    document.querySelector(".win-body").scrollTop = 0;
  }

  taskIcons.forEach((t) =>
    t.classList.toggle("is-open", t.dataset.open === (isWorkDetail(name) ? "works" : name) && !isHome)
  );
};

// Resolve routes relative to the site root, including deployments in a subdirectory.
const siteBase = new URL(".", document.baseURI);
const routeViews = { "": "home", about: "about", works: "works", "works/med-dad": "med-dad", "works/message-window-generator": "message-window-generator", "works/kashika": "kashika", "works/portfolio": "portfolio", "works/pocketreception": "pocketreception", music: "music", books: "books", contact: "contact" };
const navigate = (route) => {
  const url = new URL(route || "./", siteBase);
  if (location.pathname !== url.pathname) history.pushState(null, "", url);
  showView(routeViews[route] || "home");
};
const restoreRoute = () => {
  const route = location.pathname.slice(siteBase.pathname.length).replace(/^\/+|\/+$/g, "").replace(/(?:^|\/)index\.html$/, "");
  showView(routeViews[route] || "home");
};
window.addEventListener("popstate", restoreRoute);
restoreRoute();

document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => navigate(btn.dataset.open));
});
backBtn.addEventListener("click", () => navigate(isWorkDetail(currentView) ? "works" : ""));
document
  .querySelectorAll("[data-home]")
  .forEach((b) => b.addEventListener("click", () => navigate("")));

/* □ ボタン: ウィンドウ表示 ⇔ 最大化 */
document.querySelector("[data-max]").addEventListener("click", () => {
  osShell.classList.toggle("is-windowed");
});

/* ============================================================
   RENDER: WORKS / MUSIC / BOOKS
   ============================================================ */
document.querySelector("[data-works]").innerHTML = WORKS.map(
  (w) => `
    <a class="work-card" href="${w.route ? new URL(w.route, siteBase).href : w.url}" ${w.route ? `data-route="${w.route}"` : 'target="_blank" rel="noopener"'}>
      <h3>${w.name}</h3>
      ${w.desc ? `<p>${w.desc}</p>` : ""}
      <div class="work-meta">
        ${w.tech.map((t) => `<span class="lang-badge">${t}</span>`).join("")}
      </div>
    </a>`
).join("");

document.querySelector("[data-works]").addEventListener("click", (event) => {
  const link = event.target.closest("[data-route]");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(link.dataset.route);
  document.querySelector(`[data-view="${currentView}"] .page-title`).focus({ preventScroll: true });
});

document.querySelector("[data-music]").innerHTML = MUSIC.map(
  ([song, artist]) =>
    `<span class="tag">${song} <span class="sep">/</span> ${artist}</span>`
).join('<span class="sep">／</span>');

document.querySelector("[data-books]").innerHTML = BOOKS.map(
  ([title, author]) =>
    `<span class="tag">${title}<span class="sep">/</span>${author}</span>`
).join('<span class="sep">　</span>');

/* ============================================================
   CONTACT FORM (FormSubmit AJAX)
   ============================================================ */
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/kmc2519@kamiyama.ac.jp";

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const sendBtn = contactForm.querySelector(".send-btn");
  formStatus.classList.remove("is-error");
  formStatus.textContent = "そうしんちゅう...";
  sendBtn.disabled = true;

  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(contactForm),
    });
    if (!res.ok) throw new Error("failed");
    formStatus.textContent = "そうしんしました！おへんじまってね ♡";
    contactForm.reset();
  } catch (err) {
    formStatus.classList.add("is-error");
    formStatus.textContent =
      "そうしんにしっぱいしました。じかんをおいてもういちどおためしください。";
  } finally {
    sendBtn.disabled = false;
  }
});
