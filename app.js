const galleryItems = [
  "649929323_1445592036957617_4811656233790342485_n.jpg",
  "646401605_1611295286792531_1693032952503617363_n.jpg",
  "642956299_3134608536710752_4839227349564883787_n.jpg",
  "641312967_1248509870057918_8212363899290476648_n.jpg",
  "634117934_1619186429319204_5813764445398311840_n.jpg",
  "645077545_1441517390859420_6596153206727601340_n.jpg",
  "648544957_1802575880714048_1335952957219468782_n.jpg",
  "643616457_957602726705317_5555487890073409819_n.jpg",
  "644971420_1449475820003487_7811157862106139159_n.jpg",
  "646842976_1246029544344149_5933204039512651522_n.jpg",
  "648829065_1503363467788701_4082342472121566622_n.jpg",
  "648851068_26206371378982213_3708839730726218740_n.jpg",
  "641255880_1248269160733653_7570571072478165710_n.jpg",
  "641285231_1461598061980593_1632709767084401583_n.jpg",
  "641636503_959777936712726_7303549459640143855_n.jpg",
  "641845189_777803022058660_6414789065466456393_n.jpg",
  "641912496_2114377819376397_2337978751419770182_n.jpg",
  "645051324_973885058644608_2323347147895695078_n.jpg",
  "644022946_914314391569912_4291778504126472225_n.jpg",
  "644029135_928073129604783_6718963257448592149_n.jpg",
  "643832402_1826834097977567_9022649661772240143_n.jpg",
  "640923784_3856632861306100_563823942911455551_n.jpg",
  "640687733_25933642536257263_3895487770486450629_n.jpg",
  "638476255_950009787368033_2359626893566046148_n.jpg",
  "638285080_940732005006669_818375781340797325_n.jpg",
  "647557994_1235445305342438_2060824980986728623_n.jpg",
];

const titleSeeds = [
  "Ανθισμένο κερί",
  "Ρομαντική παλέτα",
  "Pastel candle",
  "Handmade candle",
  "Gift-ready στιγμή",
  "Soft candle story",
  "Seasonal candle",
  "Delicate candle",
];

const labelSeeds = [
  "Decor candle",
  "Pastel candle",
  "Handmade candle",
  "Gift-ready candle",
];

const featuredIndexes = new Set([0, 3, 6, 11, 17, 21]);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const galleryGrid = document.getElementById("gallery-grid");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxSubtitle = document.getElementById("lightbox-subtitle");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-nav-prev");
const nextButton = document.querySelector(".lightbox-nav-next");

let currentIndex = 0;

function getRevealElements() {
  return Array.from(document.querySelectorAll("[data-reveal]"));
}

function buildGallery() {
  if (!galleryGrid) {
    return;
  }

  const fragment = document.createDocumentFragment();

  galleryItems.forEach((src, index) => {
    const button = document.createElement("button");
    const title = `${titleSeeds[index % titleSeeds.length]} ${String(index + 1).padStart(2, "0")}`;
    const label = labelSeeds[index % labelSeeds.length];

    button.type = "button";
    button.className = featuredIndexes.has(index) ? "gallery-card gallery-card--featured" : "gallery-card";
    button.dataset.index = String(index);
    button.setAttribute("data-reveal", "");
    button.setAttribute("aria-label", `Άνοιγμα κεριού ${index + 1}`);
    button.innerHTML = `
      <img
        src="${src}"
        alt="Χειροποίητο κερί ${index + 1} της Ελένης Μαυρίδου"
        decoding="async"
      />
      <span class="gallery-card__meta">
        <small>${label}</small>
        <strong>${title}</strong>
      </span>
    `;

    button.addEventListener("click", () => openLightbox(index));
    fragment.appendChild(button);
  });

  galleryGrid.appendChild(fragment);
}

function updateLightbox() {
  const title = `${titleSeeds[currentIndex % titleSeeds.length]} ${String(currentIndex + 1).padStart(2, "0")}`;
  const label = labelSeeds[currentIndex % labelSeeds.length];

  lightboxImage.src = galleryItems[currentIndex];
  lightboxImage.alt = `Χειροποίητο κερί ${currentIndex + 1} της Ελένης Μαυρίδου`;
  lightboxTitle.textContent = title;
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
  lightboxSubtitle.textContent = `${label} με ρομαντική, χειροποίητη αισθητική κεριού.`;
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

function setupNavigation() {
  if (!navToggle) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
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
    },
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

buildGallery();
setupNavigation();
setupReveal();
setupLightbox();
