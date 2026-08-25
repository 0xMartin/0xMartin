const USERNAME = "0xMartin";
const PROJECT_LIMIT = 9;
const TOP_PROJECTS = window.TOP_PROJECTS_CONFIG || [];
let topbarMenuIdCounter = 0;
const MOBILE_NAV_BREAKPOINT = 900;

const fallbackProjects = [
  {
    name: "DoggyMan3D",
    description: "Open source RPG game created in Unity.",
    html_url: "https://github.com/0xMartin/DoggyMan3D",
    stargazers_count: 24,
    language: "C#",
    full_name: "0xMartin/DoggyMan3D"
  },
  {
    name: "QtBitmapEditor",
    description: "Multi-platform raster editor written in C++ and Qt.",
    html_url: "https://github.com/0xMartin/QtBitmapEditor",
    stargazers_count: 23,
    language: "C++",
    full_name: "0xMartin/QtBitmapEditor"
  },
  {
    name: "BMPEditor",
    description: "BMP viewer, converter and editor.",
    html_url: "https://github.com/0xMartin/BMPEditor",
    stargazers_count: 13,
    language: "C++",
    full_name: "0xMartin/BMPEditor"
  },
  {
    name: "PhotoStudio",
    description: "Photography and photo editing app with TensorFlow detection.",
    html_url: "https://github.com/0xMartin/PhotoStudio",
    stargazers_count: 8,
    language: "Kotlin",
    full_name: "0xMartin/PhotoStudio"
  }
];

const projectsGrid = document.getElementById("projects-grid");
const topProjectsList = document.getElementById("top-projects-list");

function createTechnologies(technologies) {
  if (!Array.isArray(technologies) || !technologies.length) {
    return "";
  }

  const chips = technologies
    .map((item) => `<span class="top-project-tech-chip">${item}</span>`)
    .join("");

  return `<div class="top-project-technologies" aria-label="Main technologies"><strong>Stack</strong><div class="top-project-tech-list">${chips}</div></div>`;
}

function formatInlineList(items) {
  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function createProjectDetails(project) {
  if (!project.description) {
    return "";
  }

  return `<p class="top-project-description">${project.description}</p>`;
}

function createGallery(project) {
  const count = Number(project.additionalImageCount || 0);
  if (!count) {
    return "";
  }

  const slotCount = Math.max(3, count);
  const slots = [];

  for (let slot = 1; slot <= slotCount; slot += 1) {
    const index = slot + 1;

    if (slot <= count) {
      const src = `${project.imageFolder}/img${index}.${project.imageExtension}`;
      slots.push(
        `<div class="top-project-gallery-slot"><img class="top-project-gallery-item" src="${src}" alt="${project.title} detail image ${slot}" loading="lazy" onerror="this.closest('.top-project-gallery-slot').classList.add('is-empty'); this.remove();" /></div>`
      );
    } else {
      slots.push('<div class="top-project-gallery-slot is-empty" aria-hidden="true"></div>');
    }
  }

  return `<div class="top-project-gallery">${slots.join("")}</div>`;
}

function openLightbox(imageSrc) {
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-image");
  
  img.onload = () => {
    checkImageAspectRatio(img);
  };
  
  img.src = imageSrc;
  
  if (img.complete) {
    checkImageAspectRatio(img);
  }
  
  modal.setAttribute("aria-hidden", "false");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
  document.body.style.overflow = "";
}

function checkImageAspectRatio(img) {
  if (!img.naturalWidth || !img.naturalHeight) return;
  
  const aspectRatio = img.naturalWidth / img.naturalHeight;
  const minAspect = Number(img.dataset.aspectThreshold || 4 / 3);
  
  if (aspectRatio < minAspect) {
    img.classList.add("tall-aspect");
  } else {
    img.classList.remove("tall-aspect");
  }
}

function setupLightbox() {
  const modal = document.getElementById("lightbox-modal");
  const closeBtn = document.querySelector(".lightbox-close");

  if (!modal || !closeBtn) {
    return;
  }

  closeBtn.addEventListener("click", closeLightbox);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });

  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("top-project-hero") ||
      e.target.classList.contains("top-project-gallery-item")
    ) {
      openLightbox(e.target.src);
    }
  });

  const heroImages = document.querySelectorAll(".top-project-hero");
  heroImages.forEach((img) => {
    if (img.complete) {
      checkImageAspectRatio(img);
    } else {
      img.addEventListener("load", () => checkImageAspectRatio(img));
    }
  });
}

function renderTopProjects() {
  if (!topProjectsList) {
    return;
  }

  topProjectsList.innerHTML = "";

  TOP_PROJECTS.forEach((project) => {
    const article = document.createElement("article");
    article.className = "top-project-item reveal";

    const mainImage = `${project.imageFolder}/main.${project.imageExtension}`;
    const hasGallery = Number(project.additionalImageCount || 0) > 0;

    let linkBlock = "";
    if (project.companyName && project.companyUrl) {
      linkBlock = `<p class="company-info">In collaboration with <a href="${project.companyUrl}" target="_blank" rel="noreferrer">${project.companyName}</a></p>`;
    } else if (project.isPublic && project.projectUrl) {
      linkBlock = `<a class="project-link" href="${project.projectUrl}" target="_blank" rel="noreferrer">${project.projectUrl}</a>`;
    } else {
      linkBlock = `<p class="private-note">Private project (link not available)</p>`;
    }

    const appLinkBlock = project.appUrl
      ? `<p class="company-info">Application: <a href="${project.appUrl}" target="_blank" rel="noreferrer">${project.appUrl}</a></p>`
      : "";

    article.innerHTML = `
      <div class="top-project-main">
        <div class="top-project-media ${hasGallery ? "has-gallery" : "no-gallery"}">
          <img
            class="top-project-hero"
            src="${mainImage}"
            alt="${project.title} main image"
            loading="lazy"
            data-aspect-threshold="1"
            style="cursor: pointer;"
            onerror="this.style.display='none'"
          />
          ${createGallery(project)}
        </div>
        <div class="top-project-content">
          <p class="project-period">${project.period || ""}</p>
          <h3>${project.title}</h3>
          ${createTechnologies(project.technologies)}
          ${linkBlock}
          ${createProjectDetails(project)}
          ${appLinkBlock}
        </div>
      </div>
    `;

    topProjectsList.appendChild(article);
  });

  setupReveal();
  setupLightbox();
}

function renderProjects(repos) {
  if (!projectsGrid) {
    return;
  }

  projectsGrid.innerHTML = "";

  repos.forEach((repo) => {
    const imageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;
    const card = document.createElement("article");
    card.className = "project-card reveal";
    const initial = (repo.name || "?").charAt(0).toUpperCase();
    card.innerHTML = `
      <div class="project-thumb-wrap">
        <div class="project-thumb-fallback" aria-hidden="true"><span>${initial}</span><small>${repo.name}</small></div>
        <img class="project-thumb" src="${imageUrl}" alt="${repo.name} preview image" loading="lazy" onload="this.classList.add('is-loaded')" onerror="this.remove()" />
      </div>
      <div class="project-content">
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available."}</p>
        <div class="project-meta">
          <span class="chip">${repo.language || "N/A"}</span>
          <span class="chip">${repo.stargazers_count} stars</span>
        </div>
        <a class="project-link" href="${repo.html_url}" target="_blank" rel="noreferrer">Open Repository -></a>
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  setupReveal();
}

async function fetchRepositories() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const repos = await response.json();
    const filtered = repos
      .filter(
        (repo) =>
          !repo.fork && repo.name.toLowerCase() !== USERNAME.toLowerCase()
      )
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, PROJECT_LIMIT);

    renderProjects(filtered.length ? filtered : fallbackProjects);
  } catch (error) {
    console.error("Failed to load repositories:", error);
    renderProjects(fallbackProjects);
  }
}

function setupReveal() {
  const revealItems = document.querySelectorAll(".reveal:not([data-reveal-init])");

  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.04,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  revealItems.forEach((item, index) => {
    item.setAttribute("data-reveal-init", "true");
    item.style.transitionDelay = `${Math.min(index * 24, 120)}ms`;
    observer.observe(item);
  });
}

function setupFloatingTopbar() {
  const staticTopbar = document.querySelector("header.topbar");
  if (!staticTopbar) {
    return;
  }

  setupTopbarMenu(staticTopbar);

  const floatingTopbar = staticTopbar.cloneNode(true);
  floatingTopbar.classList.remove("container", "reveal", "is-visible");
  floatingTopbar.classList.add("topbar-floating");
  floatingTopbar.setAttribute("aria-hidden", "true");
  document.body.appendChild(floatingTopbar);

  setupTopbarMenu(floatingTopbar);

  const toggleTopbar = () => {
    const shouldShow = window.scrollY > 300;
    floatingTopbar.classList.toggle("is-visible", shouldShow);
    floatingTopbar.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  };

  toggleTopbar();
  window.addEventListener("scroll", toggleTopbar, { passive: true });
}

function setupTopbarMenu(topbar) {
  const menuToggle = topbar.querySelector(".menu-toggle");
  const nav = topbar.querySelector("nav");

  if (!menuToggle || !nav) {
    return;
  }

  topbarMenuIdCounter += 1;
  nav.id = `site-navigation-${topbarMenuIdCounter}`;
  menuToggle.setAttribute("aria-controls", nav.id);

  const closeMenu = () => {
    topbar.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    if (window.innerWidth <= MOBILE_NAV_BREAKPOINT) {
      nav.style.display = "none";
    }
  };

  const toggleMenu = () => {
    if (window.getComputedStyle(menuToggle).display === "none") {
      return;
    }

    const willOpen = !topbar.classList.contains("menu-open");
    topbar.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    menuToggle.setAttribute(
      "aria-label",
      willOpen ? "Close navigation menu" : "Open navigation menu"
    );
    nav.style.display = willOpen ? "flex" : "none";
  };

  const syncResponsiveMenuState = () => {
    const isCompact = window.innerWidth <= MOBILE_NAV_BREAKPOINT;
    topbar.classList.toggle("compact-nav", isCompact);

    if (isCompact) {
      menuToggle.style.display = "inline-flex";
      nav.style.display = topbar.classList.contains("menu-open") ? "flex" : "none";
      return;
    }

    closeMenu();
    menuToggle.style.display = "none";
    nav.style.removeProperty("display");
  };

  menuToggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  });

  menuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    toggleMenu();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth <= MOBILE_NAV_BREAKPOINT && !topbar.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    syncResponsiveMenuState();
  });

  syncResponsiveMenuState();
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");

  if (!form || !status) {
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const defaultBtnText = submitBtn ? submitBtn.textContent : "Send Message";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const action = form.getAttribute("action") || "";
    const endpoint = action.replace("formsubmit.co/", "formsubmit.co/ajax/");
    const formData = new FormData(form);

    status.hidden = true;
    status.className = "contact-status";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok || result.success !== "true") {
        throw new Error(result.message || `Form submit failed with ${response.status}`);
      }

      status.textContent = "Email was sent successfully. Thank you for your message.";
      status.classList.add("success");
      status.hidden = false;
      form.reset();
    } catch (error) {
      console.error("Contact form submit failed:", error);
      status.textContent = "Sending failed. Please try again in a moment.";
      status.classList.add("error");
      status.hidden = false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnText;
      }
    }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderTopProjects();
setupReveal();
setupFloatingTopbar();
fetchRepositories();
setupContactForm();
