const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const scoreButton = document.querySelector("#score-button");
const scoreOutput = document.querySelector("#score-output");

const rankingBody = document.querySelector("#ranking-body");
const rangeEngage = document.querySelector("#w-engage");
const rangeQuality = document.querySelector("#w-quality");
const rangeRisk = document.querySelector("#w-risk");
const rangeDiversity = document.querySelector("#w-diversity");
const labelEngage = document.querySelector("#label-engage");
const labelQuality = document.querySelector("#label-quality");
const labelRisk = document.querySelector("#label-risk");
const labelDiversity = document.querySelector("#label-diversity");
const modeButtons = document.querySelectorAll(".mode-button");

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

if (scoreButton && scoreOutput) {
  scoreButton.addEventListener("click", () => {
    const applicantAScore = 4;
    const applicantBScore = 0;
    scoreOutput.textContent =
      "Sample result: Applicant A = " +
      applicantAScore +
      ", Applicant B = " +
      applicantBScore +
      ". Applicant A ranks higher under this signal configuration.";
  });
}

if (
  rankingBody &&
  rangeEngage &&
  rangeQuality &&
  rangeRisk &&
  rangeDiversity &&
  labelEngage &&
  labelQuality &&
  labelRisk &&
  labelDiversity
) {
  const candidates = [
    { name: "A: Context-rich explainer", engagement: 0.61, quality: 0.92, risk: 0.08, diversity: 0.22 },
    { name: "B: Polarizing short rant", engagement: 0.74, quality: 0.31, risk: 0.73, diversity: 0.08 },
    { name: "C: Fact-check breakdown", engagement: 0.57, quality: 0.95, risk: 0.05, diversity: 0.34 },
    { name: "D: Community issue thread", engagement: 0.5, quality: 0.7, risk: 0.2, diversity: 0.43 }
  ];

  const presets = {
    engagement: { engage: 0.85, quality: 0.05, risk: 0.05, diversity: 0.05 },
    quality: { engage: 0.6, quality: 0.25, risk: 0.1, diversity: 0.05 },
    fairness: { engage: 0.45, quality: 0.25, risk: 0.15, diversity: 0.15 }
  };

  const scoreCandidate = (item, weights) =>
    weights.engage * item.engagement +
    weights.quality * item.quality -
    weights.risk * item.risk +
    weights.diversity * item.diversity;

  const setLabels = () => {
    labelEngage.textContent = Number(rangeEngage.value).toFixed(2);
    labelQuality.textContent = Number(rangeQuality.value).toFixed(2);
    labelRisk.textContent = Number(rangeRisk.value).toFixed(2);
    labelDiversity.textContent = Number(rangeDiversity.value).toFixed(2);
  };

  const renderRanking = () => {
    const weights = {
      engage: Number(rangeEngage.value),
      quality: Number(rangeQuality.value),
      risk: Number(rangeRisk.value),
      diversity: Number(rangeDiversity.value)
    };

    const ranked = candidates
      .map((item) => ({ ...item, final: scoreCandidate(item, weights) }))
      .sort((a, b) => b.final - a.final);

    rankingBody.innerHTML = "";
    ranked.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" +
        item.name +
        "</td><td>" +
        item.engagement.toFixed(2) +
        "</td><td>" +
        item.quality.toFixed(2) +
        "</td><td>" +
        item.risk.toFixed(2) +
        "</td><td>" +
        item.diversity.toFixed(2) +
        "</td><td>" +
        item.final.toFixed(3) +
        "</td><td>" +
        (index + 1) +
        "</td>";
      rankingBody.appendChild(row);
    });
  };

  const setActiveModeButton = (mode) => {
    modeButtons.forEach((button) => {
      button.classList.toggle("active-mode", button.dataset.mode === mode);
    });
  };

  const applyPreset = (mode) => {
    const weights = presets[mode];
    if (!weights) {
      return;
    }
    rangeEngage.value = weights.engage;
    rangeQuality.value = weights.quality;
    rangeRisk.value = weights.risk;
    rangeDiversity.value = weights.diversity;
    setLabels();
    renderRanking();
    setActiveModeButton(mode);
  };

  [rangeEngage, rangeQuality, rangeRisk, rangeDiversity].forEach((input) => {
    input.addEventListener("input", () => {
      setLabels();
      renderRanking();
      setActiveModeButton("");
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.mode);
    });
  });

  applyPreset("fairness");
}
