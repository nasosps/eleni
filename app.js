let content;
let currentIndex = 0;
let galleryItems = [];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const siteNav = document.getElementById("site-nav");
const galleryGrid = document.getElementById("gallery-grid");
const navToggle = document.querySelector(".nav-toggle");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxSubtitle = document.getElementById("lightbox-subtitle");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-nav-prev");
const nextButton = document.querySelector(".lightbox-nav-next");

function getElement(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = getElement(id);

  if (!element || value == null) {
    return;
  }

  element.textContent = value;
}

function setImage(id, image) {
  const element = getElement(id);

  if (!element || !image) {
    return;
  }

  element.src = image.src;
  element.alt = image.alt || "";
}

function setLink(id, link) {
  const element = getElement(id);

  if (!element || !link) {
    return;
  }

  element.textContent = link.label;
  element.href = link.href;
}

function buildParagraphs(containerId, paragraphs) {
  const container = getElement(containerId);

  if (!container) {
    return;
  }

  container.replaceChildren();

  paragraphs.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    container.appendChild(element);
  });
}

function renderNavigation() {
  if (!siteNav) {
    return;
  }

  const fragment = document.createDocumentFragment();

  content.navigation.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;

    if (item.isCta) {
      link.className = "site-nav__cta";
    }

    fragment.appendChild(link);
  });

  siteNav.replaceChildren(fragment);
}

function renderHeroHighlights() {
  const container = getElement("hero-highlights");

  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  content.hero.highlights.forEach((item) => {
    const listItem = document.createElement("li");
    const title = document.createElement("strong");
    const text = document.createElement("span");

    title.textContent = item.title;
    text.textContent = item.text;

    listItem.append(title, text);
    fragment.appendChild(listItem);
  });

  container.replaceChildren(fragment);
}

function renderAboutPoints() {
  const container = getElement("about-points");

  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  content.about.points.forEach((item) => {
    const card = document.createElement("div");
    const title = document.createElement("strong");
    const text = document.createElement("span");

    card.className = "story-point";
    title.textContent = item.title;
    text.textContent = item.text;

    card.append(title, text);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

function renderCollections() {
  const container = getElement("collections-grid");

  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  content.collections.items.forEach((item, index) => {
    const card = document.createElement("article");
    const media = document.createElement("div");
    const image = document.createElement("img");
    const badge = document.createElement("span");
    const body = document.createElement("div");
    const tag = document.createElement("p");
    const title = document.createElement("h3");
    const text = document.createElement("p");

    card.className = "collection-card";
    card.setAttribute("data-reveal", "");

    media.className = "collection-media";
    image.src = item.image;
    image.alt = item.alt || item.title;
    badge.className = "collection-index";
    badge.textContent = String(index + 1).padStart(2, "0");

    body.className = "collection-body";
    tag.className = "collection-tag";
    tag.textContent = item.tag;
    title.textContent = item.title;
    text.textContent = item.text;

    media.append(image, badge);
    body.append(tag, title, text);
    card.append(media, body);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

function renderProcessCards() {
  const container = getElement("process-track");

  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  content.process.items.forEach((item, index) => {
    const card = document.createElement("article");
    const number = document.createElement("span");
    const title = document.createElement("h3");
    const text = document.createElement("p");

    card.className = "process-card";
    card.setAttribute("data-reveal", "");

    number.className = "process-number";
    number.textContent = String(index + 1).padStart(2, "0");
    title.textContent = item.title;
    text.textContent = item.text;

    card.append(number, title, text);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

function buildContactPill(label, value) {
  const pill = document.createElement("div");
  const labelElement = document.createElement("span");
  const valueElement = document.createElement("strong");

  pill.className = "contact-pill";
  labelElement.textContent = label;

  if (typeof value === "string" && value.includes("@")) {
    const [localPart, ...domainParts] = value.split("@");
    valueElement.append(localPart, "@");
    valueElement.appendChild(document.createElement("wbr"));
    valueElement.append(domainParts.join("@"));
  } else {
    valueElement.textContent = value;
  }

  pill.append(labelElement, valueElement);

  return pill;
}

function renderContactGrid() {
  const container = getElement("contact-grid");

  if (!container) {
    return;
  }

  const items = [
    { label: content.contact.instagramLabel, value: content.contact.instagramValue },
    { label: content.contact.emailLabel, value: content.contact.emailValue },
    { label: content.contact.phoneLabel, value: content.contact.phoneValue },
    { label: content.contact.locationLabel, value: content.contact.locationValue },
  ];

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.appendChild(buildContactPill(item.label, item.value));
  });

  container.replaceChildren(fragment);
}

function getGalleryTitle(item, index) {
  if (item.title) {
    return item.title;
  }

  const seeds = content.gallery.titleSeeds;
  return `${seeds[index % seeds.length]} ${String(index + 1).padStart(2, "0")}`;
}

function getGalleryLabel(item, index) {
  if (item.label) {
    return item.label;
  }

  const seeds = content.gallery.labelSeeds;
  return seeds[index % seeds.length];
}

function getGalleryAlt(item, index) {
  if (item.alt) {
    return item.alt;
  }

  return `Χειροποίητο κερί ${index + 1} της Ελένης Μαυρίδου`;
}

function getGalleryDescription(item, index) {
  if (item.description) {
    return item.description;
  }

  return `${getGalleryLabel(item, index)} ${content.gallery.defaultDescription}`;
}

function buildGallery() {
  if (!galleryGrid) {
    return;
  }

  galleryItems = content.gallery.items.slice();
  const fragment = document.createDocumentFragment();

  galleryItems.forEach((item, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const meta = document.createElement("span");
    const small = document.createElement("small");
    const strong = document.createElement("strong");

    button.type = "button";
    button.className = item.featured ? "gallery-card gallery-card--featured" : "gallery-card";
    button.dataset.index = String(index);
    button.setAttribute("data-reveal", "");
    button.setAttribute("aria-label", `Άνοιγμα εικόνας ${index + 1}`);

    image.src = item.src;
    image.alt = getGalleryAlt(item, index);
    image.decoding = "async";

    meta.className = "gallery-card__meta";
    small.textContent = getGalleryLabel(item, index);
    strong.textContent = getGalleryTitle(item, index);

    meta.append(small, strong);
    button.append(image, meta);
    button.addEventListener("click", () => openLightbox(index));
    fragment.appendChild(button);
  });

  galleryGrid.replaceChildren(fragment);
}

function updateLightbox() {
  const item = galleryItems[currentIndex];

  if (!item) {
    return;
  }

  lightboxImage.src = item.src;
  lightboxImage.alt = getGalleryAlt(item, currentIndex);
  lightboxTitle.textContent = getGalleryTitle(item, currentIndex);
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
  lightboxSubtitle.textContent = getGalleryDescription(item, currentIndex);
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");

  requestAnimationFrame(() => {
    lightbox.classList.add("is-open");
  });
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");

  window.setTimeout(() => {
    lightbox.hidden = true;
  }, 220);
}

function stepLightbox(step) {
  currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
  updateLightbox();
}

function getRevealElements() {
  return Array.from(document.querySelectorAll("[data-reveal]"));
}

function setupNavigation() {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupReveal() {
  const elements = getRevealElements();

  if (!elements.length) {
    return;
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
    observer.observe(element);
  });

  window.setTimeout(() => {
    elements.forEach((element) => element.classList.add("is-visible"));
  }, 1800);
}

function setupLightbox() {
  if (!lightbox || !closeButton || !prevButton || !nextButton) {
    return;
  }

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => stepLightbox(-1));
  nextButton.addEventListener("click", () => stepLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      stepLightbox(1);
    } else if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    }
  });
}

function renderSite() {
  document.title = content.meta.pageTitle;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", content.meta.description);
  }

  setText("brand-mark", content.brand.mark);
  setImage("brand-logo", content.brand.logo);
  setText("brand-name", content.brand.name);
  setText("brand-tagline", content.brand.tagline);

  renderNavigation();

  setText("hero-eyebrow", content.hero.eyebrow);
  setText("hero-title", content.hero.title);
  setText("hero-lead", content.hero.lead);
  setLink("hero-primary-cta", content.hero.primaryCta);
  setLink("hero-secondary-cta", content.hero.secondaryCta);
  renderHeroHighlights();
  setImage("hero-main-image", content.hero.mainImage);
  setText("hero-main-caption", content.hero.mainImage.caption);
  setImage("hero-top-image", content.hero.topImage);
  setImage("hero-bottom-image", content.hero.bottomImage);
  setText("hero-note-left", content.hero.noteLeft);
  setText("hero-note-right", content.hero.noteRight);
  setText("hero-metric-top-value", content.hero.metricTop.value);
  setText("hero-metric-top-label", content.hero.metricTop.label);
  setText("hero-metric-bottom-value", content.hero.metricBottom.value);
  setText("hero-metric-bottom-label", content.hero.metricBottom.label);

  setText("about-kicker", content.about.kicker);
  setText("about-title", content.about.title);
  buildParagraphs("about-paragraphs", content.about.paragraphs);
  renderAboutPoints();
  setImage("about-image-large", content.about.largeImage);
  setImage("about-image-small", content.about.smallImage);
  setText("about-quote", content.about.quote);

  setText("collections-kicker", content.collections.kicker);
  setText("collections-title", content.collections.title);
  setText("collections-intro", content.collections.intro);
  renderCollections();

  setText("process-kicker", content.process.kicker);
  setText("process-title", content.process.title);
  setText("process-intro", content.process.intro);
  renderProcessCards();

  setText("gallery-kicker", content.gallery.kicker);
  setText("gallery-title", content.gallery.title);
  setText("gallery-intro", content.gallery.intro);
  buildGallery();

  setText("contact-kicker", content.contact.kicker);
  setText("contact-title", content.contact.title);
  setText("contact-intro", content.contact.intro);
  renderContactGrid();
  setText("contact-note-eyebrow", content.contact.noteEyebrow);
  setText("contact-note-title", content.contact.noteTitle);
  setText("contact-note-text", content.contact.noteText);
  setText("contact-note-button", content.contact.backToTopLabel);

  setText("footer-name", content.footer.name);
  setText("footer-tagline", content.footer.tagline);
}

function showLoadError() {
  const container = getElement("gallery-intro");

  if (!container) {
    return;
  }

  container.textContent = "Υπήρξε πρόβλημα φόρτωσης του περιεχομένου. Κάνε ανανέωση της σελίδας.";
}

async function loadContent() {
  const response = await fetch("content.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load content.json: ${response.status}`);
  }

  return response.json();
}

async function initializeSite() {
  try {
    content = await loadContent();
    renderSite();
    setupNavigation();
    setupReveal();
    setupLightbox();
  } catch (error) {
    console.error(error);
    showLoadError();
  }
}

initializeSite();
