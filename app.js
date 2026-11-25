const github = "https://github.com/Sanjanakumarii/";
const projectDialog = document.querySelector("#project-dialog");
const chatDialog = document.querySelector("#chat-dialog");
const codeLink = document.querySelector("#project-code");
const alternate = document.createElement("a");
alternate.className = "button outline";
alternate.target = "_blank";
alternate.rel = "noopener";
alternate.textContent = "Related billing repository";
codeLink.after(alternate);
const demoLink = alternate.cloneNode();
demoLink.textContent = "Live demo";
alternate.after(demoLink);

function projectPreview(project, lazy = false) {
  const image = document.createElement("img");
  image.src = "previews/" + project.image + ".webp";
  image.alt = lazy ? "" : (project.mock || project.previewLabel ? "Interface preview of " : "Project screenshot of ") + project.title;
  image.width = 1160;
  image.height = 690;
  if (lazy) image.loading = "lazy";
  return image;
}

function showProject(project) {
  document.querySelector("#project-art").replaceChildren(projectPreview(project));
  document.querySelector("#project-art").removeAttribute("aria-hidden");
  document.querySelector("#project-category").textContent = project.category;
  document.querySelector("#project-title").textContent = project.title;
  document.querySelector("#project-description").textContent = project.detail;
  const tags = document.querySelector("#project-tags");
  tags.replaceChildren(...project.tags.map(tag => {
    const chip = document.createElement("span");
    chip.textContent = tag;
    return chip;
  }));
  codeLink.hidden = !project.repo;
  if (project.repo) {
    codeLink.href = github + project.repo;
    codeLink.textContent = project.link || "View on GitHub";
  } else {
    codeLink.removeAttribute("href");
  }
  alternate.hidden = !project.alternate;
  if (project.alternate) alternate.href = github + project.alternate;
  demoLink.hidden = !project.demo;
  if (project.demo) demoLink.href = project.demo;
  projectDialog.showModal();
}

for (const project of projects) {
  const button = document.createElement("button");
  button.className = "card";
  button.type = "button";
  button.setAttribute("aria-haspopup", "dialog");
  button.innerHTML = '<span class="art" aria-hidden="true"></span><span class="card-body"><span class="eyebrow"></span><span class="card-title"></span><span class="card-summary"></span><span class="preview-label" hidden>UI preview</span><br class="preview-break" hidden><span class="detail-link">Project details</span></span>';
  button.querySelector(".art").append(projectPreview(project, true));
  button.querySelector(".preview-label").hidden = !project.mock;
  button.querySelector(".preview-break").hidden = !project.mock;
  button.querySelector(".eyebrow").textContent = project.pinned ? "PINNED · " + project.category.toUpperCase() : project.category.toUpperCase();
  button.querySelector(".card-title").textContent = project.title;
  button.querySelector(".card-summary").textContent = project.summary;
  button.addEventListener("click", () => showProject(project));
  document.querySelector(project.featured ? "#featured" : "#more").append(button);
}

const pocketIntro = document.querySelector(".project-intro");
const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
let introTimer;
let landingTime = 0;
function startIntro() {
  if (!motion.matches) return;
  clearTimeout(introTimer);
  pocketIntro.classList.remove("playing");
  void pocketIntro.offsetWidth;
  pocketIntro.classList.add("playing");
  landingTime = performance.now() + 2100;
  introTimer = setTimeout(() => pocketIntro.classList.remove("playing"), 2700);
}
startIntro();
document.querySelectorAll('a[href="#work"]').forEach(link => link.addEventListener("click", startIntro));

if ("IntersectionObserver" in window) {
  const onView = new IntersectionObserver(entries => {
    let position = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      onView.unobserve(entry.target);
      if (!motion.matches) continue;
      const delay = Math.max(0, landingTime - performance.now()) + position++ * 64;
      entry.target.style.setProperty("--card-delay", Math.min(delay, 1950) + "ms");
      entry.target.classList.add("arrive");
      entry.target.addEventListener("animationend", () => entry.target.classList.remove("arrive"), {once:true});
    }
  }, {threshold: .12});
  document.querySelectorAll(".card").forEach(card => onView.observe(card));
}
document.querySelector("#open-chat").addEventListener("click", () => chatDialog.showModal());
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const {left, right, top, bottom} = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
  });
}

const form = document.querySelector("#chat-form");
const requiredFields = [form.elements.name, form.elements.reason];
for (const field of requiredFields) field.addEventListener("input", () => field.setCustomValidity(""));
form.addEventListener("submit", event => {
  event.preventDefault();
  for (const field of requiredFields) {
    field.setCustomValidity(field.value.trim() ? "" : "Please enter a value.");
  }
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const company = form.elements.company.value.trim();
  const reason = form.elements.reason.value.trim();
  const greeting = company ? "Hi Sanjana, I’m " + name + " from " + company + "." : "Hi Sanjana, I’m " + name + ".";
  const message = greeting + "\n\nI’m reaching out about:\n" + reason;
  const link = document.createElement("a");
  link.href = "https://wa.me/918406007004?text=" + encodeURIComponent(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
});
