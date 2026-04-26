const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const anchorLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
if (anchorLinks.length > 0) {
  const sections = anchorLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateActiveLink = () => {
    const offset = window.scrollY + 120;
    let currentId = sections[0]?.id || "home";

    sections.forEach((section) => {
      if (section.offsetTop <= offset) {
        currentId = section.id;
      }
    });

    anchorLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
}

const engagementInput = document.querySelector("#w-engagement");
const qualityInput = document.querySelector("#w-quality");
const riskInput = document.querySelector("#w-risk");
const diversityInput = document.querySelector("#w-diversity");
const creatorInput = document.querySelector("#w-creator");
const rankingBody = document.querySelector("#ranking-body");

const engagementValue = document.querySelector("#v-engagement");
const qualityValue = document.querySelector("#v-quality");
const riskValue = document.querySelector("#v-risk");
const diversityValue = document.querySelector("#v-diversity");
const creatorValue = document.querySelector("#v-creator");

if (
  engagementInput &&
  qualityInput &&
  riskInput &&
  diversityInput &&
  creatorInput &&
  rankingBody &&
  engagementValue &&
  qualityValue &&
  riskValue &&
  diversityValue &&
  creatorValue
) {
  const items = [
    {
      name: "Calm news explainer",
      engagement: 0.48,
      quality: 0.9,
      risk: 0.08,
      diversity: 0.32,
      creatorExposure: 0.22
    },
    {
      name: "Viral outrage clip",
      engagement: 0.93,
      quality: 0.26,
      risk: 0.89,
      diversity: 0.06,
      creatorExposure: 0.18
    },
    {
      name: "Fact-checking post",
      engagement: 0.57,
      quality: 0.95,
      risk: 0.05,
      diversity: 0.38,
      creatorExposure: 0.28
    },
    {
      name: "Small creator essay",
      engagement: 0.44,
      quality: 0.84,
      risk: 0.12,
      diversity: 0.58,
      creatorExposure: 0.96
    },
    {
      name: "Community safety update",
      engagement: 0.51,
      quality: 0.87,
      risk: 0.1,
      diversity: 0.66,
      creatorExposure: 0.72
    }
  ];

  const sliderMap = [
    { input: engagementInput, output: engagementValue },
    { input: qualityInput, output: qualityValue },
    { input: riskInput, output: riskValue },
    { input: diversityInput, output: diversityValue },
    { input: creatorInput, output: creatorValue }
  ];

  const getWeights = () => ({
    engagement: Number(engagementInput.value),
    quality: Number(qualityInput.value),
    risk: Number(riskInput.value),
    diversity: Number(diversityInput.value),
    creator: Number(creatorInput.value)
  });

  const updateLabels = () => {
    sliderMap.forEach(({ input, output }) => {
      output.textContent = Number(input.value).toFixed(2);
    });
  };

  const scoreItem = (item, w) =>
    w.engagement * item.engagement +
    w.quality * item.quality -
    w.risk * item.risk +
    w.diversity * item.diversity +
    w.creator * item.creatorExposure;

  const renderRanking = () => {
    const weights = getWeights();
    const ranked = items
      .map((item) => ({
        name: item.name,
        score: scoreItem(item, weights)
      }))
      .sort((a, b) => b.score - a.score);

    rankingBody.innerHTML = "";
    ranked.forEach((item, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${item.name}</td><td>${item.score.toFixed(3)}</td><td>${idx + 1}</td>`;
      rankingBody.appendChild(row);
    });
  };

  sliderMap.forEach(({ input }) => {
    input.addEventListener("input", () => {
      updateLabels();
      renderRanking();
    });
  });

  updateLabels();
  renderRanking();
}
