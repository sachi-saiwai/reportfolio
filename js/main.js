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
};

const showView = (name) => {
  views.forEach((v) => v.classList.toggle("is-active", v.dataset.view === name));
  backBtn.classList.toggle("is-shown", name !== "home");
  osLabel.textContent = labels[name] || "Home";
  document.querySelector(".win-body").scrollTop = 0;
};

document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => showView(btn.dataset.open));
});
backBtn.addEventListener("click", () => showView("home"));
document
  .querySelectorAll("[data-home]")
  .forEach((b) => b.addEventListener("click", () => showView("home")));

/* ============================================================
   RENDER: WORKS / MUSIC / BOOKS
   ============================================================ */
document.querySelector("[data-works]").innerHTML = WORKS.map(
  (w) => `
    <a class="work-card" href="${w.url}" target="_blank" rel="noopener">
      <h3>${w.name}</h3>
      ${w.desc ? `<p>${w.desc}</p>` : ""}
      <div class="work-meta">
        ${w.tech.map((t) => `<span class="lang-badge">${t}</span>`).join("")}
      </div>
    </a>`
).join("");

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
