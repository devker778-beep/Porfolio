document.body.classList.add("cyber-intro");

const siteLoader = document.querySelector(".site-loader");
const loaderBits = siteLoader.querySelector(".site-loader-binary");
const loaderTrack = siteLoader.querySelector(".site-loader-track");
const loaderPercent = siteLoader.querySelector(".site-loader-percent");
const loaderStartedAt = performance.now();
let loaderBitFlipTimer;
let loaderFinished = false;
let loaderFallbackTimer;
let loaderCurrentPercent = 1;
let portraitIntroStarted = false;
let portraitIntroFallbackTimer;

for (let index = 0; index < 100; index += 1) {
  const bit = document.createElement("span");
  bit.textContent = Math.random() < 0.5 ? "0" : "1";
  bit.style.setProperty("--bit-top", `${Math.random() * 100}%`);
  bit.style.setProperty("--bit-left", `${Math.random() * 100}%`);
  bit.style.setProperty("--bit-size", `${12 + Math.floor(Math.random() * 13)}px`);
  bit.style.setProperty("--bit-duration", `${3 + Math.random() * 4}s`);
  bit.style.setProperty("--bit-delay", `${Math.random() * -7}s`);
  bit.style.setProperty("--bit-travel", Math.random() < 0.5 ? "-18vh" : "18vh");
  bit.style.setProperty("--bit-rotation", Math.random() < 0.5 ? "-180deg" : "180deg");
  bit.style.setProperty("--bit-blur", `${0.5 + Math.random() * 1.5}px`);
  loaderBits.appendChild(bit);
}

loaderBitFlipTimer = window.setInterval(() => {
  loaderBits.querySelectorAll("span").forEach((bit) => {
    if (Math.random() < 0.5) bit.textContent = bit.textContent === "0" ? "1" : "0";
  });
}, 180);

function updateLoaderProgress(timestamp) {
  const progress = Math.min((timestamp - loaderStartedAt) / 3000, 1);
  const easedProgress = progress * progress * (3 - 2 * progress);
  const percent = Math.max(1, Math.floor(1 + progress * 99));

  loaderTrack.style.setProperty("--loader-progress", String(easedProgress));
  if (percent !== loaderCurrentPercent) {
    loaderCurrentPercent = percent;
    loaderPercent.textContent = String(percent);
    loaderTrack.setAttribute("aria-valuenow", String(percent));
  }

  if (progress === 1) stagePortraitAtTop();
  if (progress < 1) window.requestAnimationFrame(updateLoaderProgress);
}
window.requestAnimationFrame(updateLoaderProgress);

function stagePortraitAtTop() {
  if (portraitIntroStarted || portrait.classList.contains("badge-staged")) return;
  const artRect = heroArt.getBoundingClientRect();
  const neckRect = lanyardNeck.getBoundingClientRect();
  portrait.style.setProperty("--badge-rest-top", window.getComputedStyle(portrait).top);
  portrait.style.setProperty("--badge-stage-top", `${neckRect.bottom - artRect.top + 32}px`);
  portrait.classList.add("badge-staged");
  drawIntroLanyard();
}

function finishSiteLoader() {
  if (loaderFinished) return;
  loaderFinished = true;
  window.clearTimeout(loaderFallbackTimer);
  const remainingTime = Math.max(0, 3000 - (performance.now() - loaderStartedAt));
  window.setTimeout(() => {
    stagePortraitAtTop();
    window.clearInterval(loaderBitFlipTimer);
    siteLoader.classList.add("is-hidden");
    siteLoader.setAttribute("aria-hidden", "true");
    portraitIntroFallbackTimer = window.setTimeout(startPortraitIntro, 1000);
  }, remainingTime);
}

function startPortraitIntro() {
  if (portraitIntroStarted) return;
  portraitIntroStarted = true;
  window.clearTimeout(portraitIntroFallbackTimer);
  portrait.classList.remove("badge-staged");
  portrait.classList.add("photo-snapped");
  animateIntroLanyard();
}

siteLoader.addEventListener("transitionend", (event) => {
  if (event.target === siteLoader && event.propertyName === "opacity" && siteLoader.classList.contains("is-hidden")) {
    startPortraitIntro();
  }
});

window.addEventListener("load", finishSiteLoader, { once: true });
loaderFallbackTimer = window.setTimeout(finishSiteLoader, 8000);

const reveals = document.querySelectorAll(".reveal");
const portrait = document.querySelector(".portrait-card");
const portraitMatrix = document.querySelector(".portrait-matrix");

for (let index = 0; index < 80; index += 1) {
  const bit = document.createElement("span");
  bit.textContent = Math.random() < 0.5 ? "0" : "1";
  bit.style.setProperty("--cell-delay", `${Math.random() * 0.35}s`);
  portraitMatrix.appendChild(bit);
}

const binaryRain = document.querySelector(".binary-rain");
const binaryPatterns = ["101010", "0101"];
const streamsPerSide = window.matchMedia("(max-width: 600px)").matches ? 10 : 50;
const binaryStreamCount = streamsPerSide * 2;
function shuffledDirections() {
  const directions = Array.from(
    { length: streamsPerSide },
    (_, index) => index < streamsPerSide / 2 ? "up" : "down"
  );
  for (let index = directions.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [directions[index], directions[swapIndex]] = [directions[swapIndex], directions[index]];
  }
  return directions;
}
const directionsBySide = [shuffledDirections(), shuffledDirections()];
for (let index = 0; index < binaryStreamCount; index += 1) {
  const digit = document.createElement("span");
  const sideIndex = index % 2;
  const side = sideIndex === 0 ? "left" : "right";
  const streamIndex = Math.floor(index / 2);
  const direction = directionsBySide[sideIndex][streamIndex];
  const column = streamIndex % 12;
  digit.classList.add(`binary-${side}`);
  digit.classList.add(`binary-${direction}`);
  digit.textContent = binaryPatterns[Math.floor(Math.random() * binaryPatterns.length)];
  digit.style.setProperty("--edge-offset", `${column * 0.55 + Math.random() * 0.4}vw`);
  digit.style.setProperty("--delay", `${Math.random() * -30}s`);
  digit.style.setProperty("--duration", `${16 + Math.random() * 14}s`);
  digit.style.setProperty("--size", `${12 + Math.floor(Math.random() * 4) * 2}px`);
  binaryRain.appendChild(digit);
}

function leaveBinaryAfterimages() {
  binaryRain.querySelectorAll("span:not(.binary-afterimage)").forEach((digit) => {
    const bounds = digit.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

    const style = window.getComputedStyle(digit);
    if (Number.parseFloat(style.opacity) < 0.1) return;

    const afterimage = document.createElement("span");
    afterimage.className = "binary-afterimage";
    afterimage.textContent = digit.textContent;
    afterimage.style.left = `${bounds.left}px`;
    afterimage.style.top = `${bounds.top}px`;
    afterimage.style.setProperty("--size", style.fontSize);
    afterimage.addEventListener("animationend", () => afterimage.remove(), { once: true });
    binaryRain.appendChild(afterimage);
  });
}
window.setInterval(leaveBinaryAfterimages, window.matchMedia("(max-width: 600px)").matches ? 1200 : 500);

reveals.forEach((element) => {
  const delay = element.dataset.delay;
  if (delay) element.style.setProperty("--delay", `${delay}ms`);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((element) => revealObserver.observe(element));

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    if (link.hash === "#who-am-i") {
      event.preventDefault();
      returnFocus = link;
      returnScrollY = window.scrollY;
      enterAboutPage();
    }
  });
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("a, button, .vision-card, .dimension");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  target.classList.remove("press-feedback");
  requestAnimationFrame(() => target.classList.add("press-feedback"));
  window.setTimeout(() => target.classList.remove("press-feedback"), 520);
});

const dimensionCards = Array.from(document.querySelectorAll(".dimension"));
const aboutSection = document.querySelector("#who-am-i");
const aboutPage = document.querySelector("#about-page");
const aboutPageTitle = aboutPage.querySelector("#about-page-title");
const aboutPageName = aboutPage.querySelector(".about-page-name");
const aboutPageBio = aboutPage.querySelector(".about-page-bio");
const aboutPageIdentity = aboutPage.querySelector(".about-page-identity");
const aboutPageQuote = aboutPage.querySelector(".about-page-quote-text");
const aboutPageQuoteAuthor = aboutPage.querySelector(".about-page-quote-author");
const dimensionPage = document.querySelector("#dimension-page");
const dimensionPageIndex = dimensionPage.querySelector(".dimension-page-index");
const dimensionPageTag = dimensionPage.querySelector(".dimension-page-tag");
const dimensionPageTitle = dimensionPage.querySelector("#dimension-page-title");
const dimensionPagePrompt = dimensionPage.querySelector(".dimension-page-prompt");
const dimensionPageReflection = dimensionPage.querySelector(".dimension-page-reflection");
const pageTransition = document.querySelector(".page-transition");
const soundStatus = dimensionPage.querySelector(".sound-status");
const transitionDuration = 800;
const returnTransitionDuration = 500;
const glitterSound = new Audio("activate-glitter-1.mp3");
const arrivalSounds = [
  new Audio("level-up-274134.mp3"),
  new Audio("gaming-stage-successfully-finished.mp3")
];
const futureCards = Array.from(document.querySelectorAll(".vision-card"));
const futurePage = document.querySelector("#future-page");
const futurePageIndex = futurePage.querySelector(".future-page-index");
const futurePageTag = futurePage.querySelector(".future-page-tag");
const futurePageTitle = futurePage.querySelector("#future-page-title");
const futurePagePrompt = futurePage.querySelector(".future-page-prompt");
const futurePageReflection = futurePage.querySelector(".future-page-reflection");
const futureSoundStatus = futurePage.querySelector(".future-sound-status");
let activeDimensionIndex = -1;
let activeFutureIndex = -1;
let transitionInProgress = false;
let returnFocus = null;
let returnScrollY = 0;
let bitFlipTimer = null;

function renderAboutPage() {
  const bioCard = aboutSection.querySelector(".bio-card");
  const name = bioCard.querySelector("h3 .editable").textContent;
  const biography = bioCard.querySelector(".editable-block");
  const identity = aboutSection.querySelector(".editable-list");
  const quote = aboutSection.querySelector(".quote p");
  const quoteAuthor = aboutSection.querySelector(".quote cite");

  aboutPageName.textContent = `Hello, I am ${name}.`;
  aboutPageBio.innerHTML = biography.innerHTML;
  aboutPageBio.dataset.placeholder = biography.dataset.placeholder;
  aboutPageIdentity.innerHTML = identity.innerHTML;
  aboutPageQuote.innerHTML = quote.innerHTML;
  aboutPageQuoteAuthor.innerHTML = quoteAuthor.innerHTML;
  aboutPage.hidden = false;
  document.body.classList.add("dimension-page-open");
  scrollImmediatelyTo(0);
}

function enterAboutPage() {
  if (transitionInProgress) return;
  transitionInProgress = true;
  playSound(glitterSound);

  const showPage = () => {
    renderAboutPage();
    aboutPageTitle.focus();
    playSound(arrivalSounds[Math.floor(Math.random() * arrivalSounds.length)]);
    window.setTimeout(() => {
      stopBinaryTransition();
      document.body.classList.remove("dimension-transitioning");
      transitionInProgress = false;
    }, 100);
  };

  const startTransition = () => {
    startBinaryTransition();
    window.setTimeout(showPage, transitionDuration);
  };

  if (aboutPage.hidden) {
    preparePageTransition().then(startTransition);
  } else {
    startTransition();
  }
}

const transitionBitCount = window.matchMedia("(max-width: 600px)").matches ? 70 : 120;
for (let index = 0; index < transitionBitCount; index += 1) {
  const bit = document.createElement("span");
  bit.textContent = Math.random() < 0.5 ? "0" : "1";
  pageTransition.appendChild(bit);
}

function randomizeTransitionBits(duration = transitionDuration) {
  pageTransition.querySelectorAll("span").forEach((bit) => {
    const delay = Math.random() * Math.min(250, duration * 0.35);

    bit.textContent = Math.random() < 0.5 ? "0" : "1";
    bit.style.setProperty("--bit-x", `${Math.random() * 100}%`);
    bit.style.setProperty("--bit-y", `${Math.random() * 100}%`);
    bit.style.setProperty("--bit-size", `${22 + Math.random() * 28}px`);
    bit.style.setProperty("--bit-delay", `${delay}ms`);
    bit.style.setProperty("--bit-duration", `${duration - delay}ms`);
  });
}

function scrollImmediatelyTo(top) {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
}

async function preparePageTransition() {
  document.body.classList.remove("dimension-page-open");
  document.body.classList.add("transition-background-blur");
  await new Promise((resolve) => window.setTimeout(resolve, 150));
  document.body.classList.remove("transition-background-blur");
}

function startBinaryTransition({ impact = true, duration = transitionDuration } = {}) {
  stopBinaryTransition();
  if (!impact) pageTransition.classList.add("no-impact");
  randomizeTransitionBits(duration);
  void pageTransition.offsetWidth;
  pageTransition.classList.add("playing");
  document.body.classList.add("dimension-transitioning");
  bitFlipTimer = window.setInterval(() => {
    pageTransition.querySelectorAll("span").forEach((bit) => {
      if (Math.random() < 0.3) bit.textContent = bit.textContent === "0" ? "1" : "0";
    });
  }, 80);
}

function stopBinaryTransition() {
  window.clearInterval(bitFlipTimer);
  bitFlipTimer = null;
  pageTransition.classList.remove("playing", "no-impact");
}

function playSound(audio, status = soundStatus) {
  audio.currentTime = 0;
  audio.volume = 0.3;
  audio.play().then(() => {
    status.textContent = "";
  }).catch(() => {
    status.textContent = "Sound could not be played. Check your browser's audio settings.";
  });
}

function renderDimension(index) {
  const card = dimensionCards[index];
  const title = card.querySelector("h3").textContent;
  const reflection = card.querySelector(".reflection");

  activeDimensionIndex = index;
  dimensionPageIndex.textContent = `${card.querySelector(".dimension-index").textContent} / 02.6`;
  dimensionPageTag.textContent = card.querySelector(".dimension-tag").textContent;
  dimensionPageTitle.textContent = title;
  dimensionPagePrompt.textContent = card.querySelector(".prompt").textContent;
  dimensionPageReflection.innerHTML = reflection.innerHTML;
  dimensionPageReflection.dataset.placeholder = reflection.dataset.placeholder;
  dimensionPageReflection.setAttribute("aria-label", `${title} reflection`);
  dimensionPage.hidden = false;
  document.body.classList.add("dimension-page-open");
  scrollImmediatelyTo(0);
}

function renderFutureGoal(index) {
  const card = futureCards[index];
  const description = card.querySelector("p[contenteditable='true']");

  activeFutureIndex = index;
  futurePageIndex.textContent = `03.${index + 1} / 03.3`;
  futurePageTag.textContent = card.querySelector(".vision-year").textContent;
  futurePageTitle.textContent = card.querySelector("h3").textContent;
  futurePagePrompt.textContent = "The future I am working toward";
  futurePageReflection.innerHTML = description.innerHTML;
  futurePageReflection.dataset.placeholder = description.dataset.placeholder;
  futurePageReflection.setAttribute("aria-label", `${card.querySelector("h3").textContent} description`);
  futurePage.hidden = false;
  document.body.classList.add("dimension-page-open");
  scrollImmediatelyTo(0);
}

function enterFutureGoal(index) {
  if (transitionInProgress || index < 0 || index >= futureCards.length) return;
  transitionInProgress = true;
  playSound(glitterSound, futureSoundStatus);
  if (activeFutureIndex >= 0 && !futurePage.hidden) {
    futureCards[activeFutureIndex].querySelector("p[contenteditable='true']").innerHTML = futurePageReflection.innerHTML;
  }

  const showPage = () => {
    renderFutureGoal(index);
    futurePageTitle.focus();
    playSound(arrivalSounds[Math.floor(Math.random() * arrivalSounds.length)], futureSoundStatus);
    window.setTimeout(() => {
      stopBinaryTransition();
      document.body.classList.remove("dimension-transitioning");
      transitionInProgress = false;
    }, 100);
  };

  const startTransition = () => {
    startBinaryTransition();
    window.setTimeout(showPage, transitionDuration);
  };

  if (futurePage.hidden) {
    preparePageTransition().then(startTransition);
  } else {
    startTransition();
  }
}

function closeDimensionPage() {
  if (transitionInProgress) return;
  transitionInProgress = true;
  startBinaryTransition({ impact: false, duration: returnTransitionDuration });
  window.setTimeout(() => {
    aboutPage.hidden = true;
    dimensionPage.hidden = true;
    futurePage.hidden = true;
    document.body.classList.remove("dimension-page-open");
    scrollImmediatelyTo(returnScrollY);
    if (returnFocus) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
    stopBinaryTransition();
    document.body.classList.remove("dimension-transitioning");
    transitionInProgress = false;
  }, returnTransitionDuration);
}

aboutSection.querySelector(".about-entry").addEventListener("click", () => {
  returnFocus = aboutSection.querySelector(".about-open");
  returnScrollY = window.scrollY;
  enterAboutPage();
});

aboutPage.querySelector(".about-back").addEventListener("click", () => {
  const bioCard = aboutSection.querySelector(".bio-card");
  bioCard.querySelector(".editable-block").innerHTML = aboutPageBio.innerHTML;
  const sourceIdentity = aboutSection.querySelector(".editable-list");
  sourceIdentity.innerHTML = aboutPageIdentity.innerHTML;
  aboutSection.querySelector(".quote p").innerHTML = aboutPageQuote.innerHTML;
  aboutSection.querySelector(".quote cite").innerHTML = aboutPageQuoteAuthor.innerHTML;
  playSound(glitterSound);
  closeDimensionPage();
});

aboutPageBio.addEventListener("input", () => {
  aboutSection.querySelector(".bio-card .editable-block").innerHTML = aboutPageBio.innerHTML;
});
aboutPageIdentity.addEventListener("input", () => {
  aboutSection.querySelector(".editable-list").innerHTML = aboutPageIdentity.innerHTML;
});
aboutPageQuote.addEventListener("input", () => {
  aboutSection.querySelector(".quote p").innerHTML = aboutPageQuote.innerHTML;
});
aboutPageQuoteAuthor.addEventListener("input", () => {
  aboutSection.querySelector(".quote cite").innerHTML = aboutPageQuoteAuthor.innerHTML;
});

function enterDimension(index, shouldAnimate, shouldPlayClick) {
  if (transitionInProgress || index < 0 || index >= dimensionCards.length) return;
  transitionInProgress = true;
  if (shouldPlayClick) playSound(glitterSound);
  if (!dimensionPage.hidden) {
    const oldReflection = dimensionCards[activeDimensionIndex].querySelector(".reflection");
    oldReflection.innerHTML = dimensionPageReflection.innerHTML;
  }

  const showPage = () => {
    renderDimension(index);
    dimensionPageTitle.focus();
    if (shouldAnimate) {
      const sound = arrivalSounds[Math.floor(Math.random() * arrivalSounds.length)];
      playSound(sound);
    }
    window.setTimeout(() => {
      stopBinaryTransition();
      document.body.classList.remove("dimension-transitioning");
      transitionInProgress = false;
    }, shouldAnimate ? 100 : 0);
  };

  if (!shouldAnimate) {
    showPage();
    return;
  }

  const startTransition = () => {
    startBinaryTransition();
    window.setTimeout(showPage, transitionDuration);
  };

  if (dimensionPage.hidden) {
    preparePageTransition().then(startTransition);
  } else {
    startTransition();
  }
}

dimensionCards.forEach((card, index) => {
  const openButton = card.querySelector(".dimension-open");
  openButton.addEventListener("click", () => {
    returnFocus = openButton;
    returnScrollY = window.scrollY;
    enterDimension(index, true, true);
  });
  card.addEventListener("click", (event) => {
    if (event.target.closest("[contenteditable='true'], button")) return;
    returnFocus = openButton;
    returnScrollY = window.scrollY;
    enterDimension(index, true, true);
  });
});

dimensionPage.querySelector(".dimension-back").addEventListener("click", () => {
  if (activeDimensionIndex >= 0) {
    const reflection = dimensionCards[activeDimensionIndex].querySelector(".reflection");
    reflection.innerHTML = dimensionPageReflection.innerHTML;
  }
  playSound(glitterSound);
  closeDimensionPage();
});

dimensionPageReflection.addEventListener("input", () => {
  if (activeDimensionIndex < 0) return;
  dimensionCards[activeDimensionIndex].querySelector(".reflection").innerHTML = dimensionPageReflection.innerHTML;
});

dimensionPage.querySelector(".dimension-previous").addEventListener("click", () => {
  const nextIndex = (activeDimensionIndex + dimensionCards.length - 1) % dimensionCards.length;
  enterDimension(nextIndex, true, true);
});
dimensionPage.querySelector(".dimension-next").addEventListener("click", () => {
  const nextIndex = (activeDimensionIndex + 1) % dimensionCards.length;
  enterDimension(nextIndex, true, true);
});

futureCards.forEach((card, index) => {
  const openButton = card.querySelector(".vision-open");
  openButton.addEventListener("click", () => {
    returnFocus = openButton;
    returnScrollY = window.scrollY;
    enterFutureGoal(index);
  });
  card.addEventListener("click", (event) => {
    if (event.target.closest("[contenteditable='true'], button")) return;
    returnFocus = openButton;
    returnScrollY = window.scrollY;
    enterFutureGoal(index);
  });
});

futurePage.querySelector(".future-back").addEventListener("click", () => {
  if (activeFutureIndex >= 0) {
    futureCards[activeFutureIndex].querySelector("p[contenteditable='true']").innerHTML = futurePageReflection.innerHTML;
  }
  playSound(glitterSound);
  closeDimensionPage();
});

futurePageReflection.addEventListener("input", () => {
  if (activeFutureIndex < 0) return;
  futureCards[activeFutureIndex].querySelector("p[contenteditable='true']").innerHTML = futurePageReflection.innerHTML;
});

futurePage.querySelector(".future-previous").addEventListener("click", () => {
  const nextIndex = (activeFutureIndex + futureCards.length - 1) % futureCards.length;
  enterFutureGoal(nextIndex);
});
futurePage.querySelector(".future-next").addEventListener("click", () => {
  const nextIndex = (activeFutureIndex + 1) % futureCards.length;
  enterFutureGoal(nextIndex);
});

const heroArt = document.querySelector(".hero-art");
const whoAmISection = document.querySelector("#who-am-i");
const lanyardNeck = document.querySelector(".lanyard-neck");
const lanyardPaths = [...document.querySelectorAll(".id-lanyard path")];
const ropeSegments = 18;
const maxBadgeTilt = 8;
let badgePhysicsReady = false;
let badgeFrame = 0;
let previousBadgeFrame = 0;
let draggingBadge = false;
let badgePointerId = null;
let badgeBase = { x: 0, y: 0 };
let badgePosition = { x: 0, y: 0 };
let badgeAnchor = { x: 0, y: 0 };
let badgeLength = 0;
let badgeCurrentLength = 0;
let badgeLengthVelocity = 0;
let badgeScrollOffsetY = 0;
let badgeSwingAngle = 0;
let badgeSwingVelocity = 0;
let badgeAngle = 0;
let badgeAngularVelocity = 0;
let badgePointerOffset = { x: 0, y: 0 };
let badgeDragTargetAngle = 0;
let badgeDragTargetLength = 0;
let ropePoints = [];
let introLanyardFrame = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getBadgeCenterBounds() {
  const artRect = heroArt.getBoundingClientRect();
  const heroRect = heroArt.closest(".hero").getBoundingClientRect();
  const width = portrait.offsetWidth;
  const height = portrait.offsetHeight;
  const corners = [[-width / 2, 0], [width / 2, 0], [-width / 2, height], [width / 2, height]];
  const offsets = [-maxBadgeTilt, maxBadgeTilt].flatMap((cardAngle) => {
    const radians = cardAngle * Math.PI / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    return corners.map(([x, y]) => ({
      x: x * cosine - y * sine,
      y: x * sine + y * cosine
    }));
  });
  const minOffsetX = Math.min(...offsets.map((point) => point.x));
  const maxOffsetX = Math.max(...offsets.map((point) => point.x));
  const minOffsetY = Math.min(...offsets.map((point) => point.y));
  const maxOffsetY = Math.max(...offsets.map((point) => point.y));
  const margin = 6;
  const left = heroRect.left + margin - artRect.left;
  const right = heroRect.right - margin - artRect.left;
  const top = heroRect.top + margin - artRect.top;
  const bottom = heroRect.bottom - margin - artRect.top;

  return {
    minX: left - minOffsetX,
    maxX: right - maxOffsetX,
    minY: top - minOffsetY,
    maxY: bottom - maxOffsetY
  };
}

function clampBadgePosition(position) {
  const bounds = getBadgeCenterBounds();
  return {
    x: bounds.minX <= bounds.maxX
      ? clamp(position.x, bounds.minX, bounds.maxX)
      : (bounds.minX + bounds.maxX) / 2,
    y: bounds.minY <= bounds.maxY
      ? clamp(position.y, bounds.minY, bounds.maxY)
      : (bounds.minY + bounds.maxY) / 2
  };
}

function getBadgePositionAtSwing(angle, length = badgeCurrentLength) {
  return {
    x: badgeAnchor.x + Math.sin(angle) * length,
    y: badgeAnchor.y + Math.cos(angle) * length
  };
}

function initializeBadgePhysics() {
  const artRect = heroArt.getBoundingClientRect();
  if (!artRect.width || !artRect.height) return;

  portrait.style.setProperty("--badge-x", "0px");
  portrait.style.setProperty("--badge-y", "0px");
  portrait.style.setProperty("--badge-angle", "0deg");
  badgeScrollOffsetY = 0;
  const portraitStyle = window.getComputedStyle(portrait);
  badgeBase = {
    x: Number.parseFloat(portraitStyle.left),
    y: Number.parseFloat(portraitStyle.top)
  };
  badgePosition = { ...badgeBase };
  badgeLengthVelocity = 0;
  badgeSwingVelocity = 0;
  badgeAngle = 0;
  badgeAngularVelocity = 0;

  const neckRect = lanyardNeck.getBoundingClientRect();
  badgeAnchor = {
    x: neckRect.left + neckRect.width / 2 - artRect.left,
    y: neckRect.bottom - artRect.top - 2
  };
  badgeLength = Math.hypot(badgePosition.x - badgeAnchor.x, badgePosition.y - badgeAnchor.y);
  badgeCurrentLength = badgeLength;
  badgeSwingAngle = Math.atan2(badgePosition.x - badgeAnchor.x, badgePosition.y - badgeAnchor.y);
  badgeDragTargetAngle = badgeSwingAngle;
  badgeDragTargetLength = badgeLength;
  const ropeRestLength = Math.max(24, badgeLength * 1.04);
  const segmentLength = ropeRestLength / (ropeSegments - 1);
  ropePoints = Array.from({ length: ropeSegments }, (_, index) => {
    const progress = index / (ropeSegments - 1);
    const x = badgeAnchor.x + (badgePosition.x - badgeAnchor.x) * progress;
    const y = badgeAnchor.y + (badgePosition.y - badgeAnchor.y) * progress + Math.sin(progress * Math.PI) * 5;
    return { x, y, previousX: x, previousY: y, segmentLength };
  });
  badgePhysicsReady = true;
  updateBadgeAppearance();
  drawLanyard();
}

function updateBadgeAppearance() {
  portrait.style.setProperty("--badge-x", `${badgePosition.x - badgeBase.x}px`);
  portrait.style.setProperty("--badge-y", `${badgePosition.y - badgeBase.y + badgeScrollOffsetY}px`);
  portrait.style.setProperty("--badge-angle", `${badgeAngle}deg`);
}

function updateBadgeScrollFollow() {
  if (!badgePhysicsReady || draggingBadge) return;

  const portraitRect = portrait.getBoundingClientRect();
  const naturalTop = portraitRect.top - badgeScrollOffsetY;
  const stickyTop = 24;
  const barrierTop = whoAmISection.getBoundingClientRect().top - portraitRect.height - 12;
  const targetTop = naturalTop < stickyTop ? Math.min(stickyTop, barrierTop) : naturalTop;
  const scrollOffset = targetTop - naturalTop;

  if (Math.abs(scrollOffset - badgeScrollOffsetY) < 0.25) return;
  badgeScrollOffsetY = scrollOffset;
  updateBadgeAppearance();
  wakeBadge();
}

function drawLanyard() {
  if (!ropePoints.length) return;
  let pathData = `M ${ropePoints[0].x.toFixed(1)} ${ropePoints[0].y.toFixed(1)}`;

  for (let index = 1; index < ropePoints.length - 1; index += 1) {
    const point = ropePoints[index];
    const nextPoint = ropePoints[index + 1];
    const midX = (point.x + nextPoint.x) / 2;
    const midY = (point.y + nextPoint.y) / 2;
    pathData += ` Q ${point.x.toFixed(1)} ${point.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const endPoint = ropePoints[ropePoints.length - 1];
  pathData += ` L ${endPoint.x.toFixed(1)} ${endPoint.y.toFixed(1)}`;
  lanyardPaths.forEach((path) => path.setAttribute("d", pathData));
}

function drawIntroLanyard() {
  const artRect = heroArt.getBoundingClientRect();
  const neckRect = lanyardNeck.getBoundingClientRect();
  const portraitRect = portrait.getBoundingClientRect();
  const anchor = {
    x: neckRect.left + neckRect.width / 2 - artRect.left,
    y: neckRect.bottom - artRect.top - 2
  };
  const endpoint = {
    x: portraitRect.left + portraitRect.width / 2 - artRect.left,
    y: portraitRect.top - artRect.top
  };
  const segmentLength = Math.hypot(endpoint.x - anchor.x, endpoint.y - anchor.y) / (ropeSegments - 1);

  ropePoints = Array.from({ length: ropeSegments }, (_, index) => {
    const progress = index / (ropeSegments - 1);
    const x = anchor.x + (endpoint.x - anchor.x) * progress;
    const y = anchor.y + (endpoint.y - anchor.y) * progress + Math.sin(progress * Math.PI) * Math.min(5, segmentLength);
    return { x, y };
  });
  drawLanyard();
}

function animateIntroLanyard() {
  introLanyardFrame = 0;
  if (!portrait.classList.contains("photo-snapped")) return;
  drawIntroLanyard();
  introLanyardFrame = window.requestAnimationFrame(animateIntroLanyard);
}

function simulateLanyard(delta) {
  const lastIndex = ropePoints.length - 1;
  const visualPosition = {
    x: badgePosition.x,
    y: badgePosition.y + badgeScrollOffsetY
  };
  const ropeRestLength = Math.max(24, Math.hypot(
    visualPosition.x - badgeAnchor.x,
    visualPosition.y - badgeAnchor.y
  ) * 1.04);
  const segmentLength = ropeRestLength / lastIndex;
  ropePoints.forEach((point) => {
    point.segmentLength = segmentLength;
  });
  ropePoints[0].x = badgeAnchor.x;
  ropePoints[0].y = badgeAnchor.y;
  ropePoints[lastIndex].x = visualPosition.x;
  ropePoints[lastIndex].y = visualPosition.y;

  for (let index = 1; index < lastIndex; index += 1) {
    const point = ropePoints[index];
    const velocityX = (point.x - point.previousX) * Math.pow(0.985, delta);
    const velocityY = (point.y - point.previousY) * Math.pow(0.985, delta);
    point.previousX = point.x;
    point.previousY = point.y;
    point.x += velocityX;
    point.y += velocityY + 0.12 * delta * delta;
  }

  for (let iteration = 0; iteration < 6; iteration += 1) {
    ropePoints[0].x = badgeAnchor.x;
    ropePoints[0].y = badgeAnchor.y;
    ropePoints[lastIndex].x = visualPosition.x;
    ropePoints[lastIndex].y = visualPosition.y;

    for (let index = 0; index < lastIndex; index += 1) {
      const start = ropePoints[index];
      const end = ropePoints[index + 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.hypot(dx, dy) || 1;
      const correction = (distance - start.segmentLength) / distance;
      const correctionX = dx * correction;
      const correctionY = dy * correction;

      if (index === 0) {
        end.x -= correctionX;
        end.y -= correctionY;
      } else if (index === lastIndex - 1) {
        start.x += correctionX;
        start.y += correctionY;
      } else {
        start.x += correctionX / 2;
        start.y += correctionY / 2;
        end.x -= correctionX / 2;
        end.y -= correctionY / 2;
      }
    }
  }
}

function animateBadge(timestamp) {
  badgeFrame = 0;
  if (!badgePhysicsReady) return;
  const delta = previousBadgeFrame ? Math.min((timestamp - previousBadgeFrame) / 16.67, 2) : 1;
  previousBadgeFrame = timestamp;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gravity = reducedMotion ? 0 : 0.18 / Math.max(badgeLength, 1);
  const dragDamping = reducedMotion ? 0.65 : 0.24;
  if (draggingBadge) {
    const spring = reducedMotion ? 0.12 : 0.018;
    badgeSwingVelocity += (
      (badgeDragTargetAngle - badgeSwingAngle) * spring
      - badgeSwingVelocity * dragDamping
      - gravity * Math.sin(badgeSwingAngle)
    ) * delta;
    badgeLengthVelocity += (
      (badgeDragTargetLength - badgeCurrentLength) * (reducedMotion ? 0.16 : 0.035)
      - badgeLengthVelocity * dragDamping
    ) * delta;
  } else if (reducedMotion) {
    badgeSwingVelocity += -badgeSwingAngle * 0.06 * delta;
    badgeLengthVelocity += (
      (badgeLength - badgeCurrentLength) * 0.08
      - badgeLengthVelocity * dragDamping
    ) * delta;
  } else {
    badgeSwingVelocity += -gravity * Math.sin(badgeSwingAngle) * delta;
    badgeLengthVelocity += (
      (badgeLength - badgeCurrentLength) * 0.012
      - badgeLengthVelocity * dragDamping
    ) * delta;
  }

  badgeSwingVelocity *= Math.pow(0.986, delta);
  badgeSwingAngle += badgeSwingVelocity * delta;
  badgeLengthVelocity *= Math.pow(0.986, delta);
  badgeCurrentLength = Math.max(1, badgeCurrentLength + badgeLengthVelocity * delta);
  badgePosition = getBadgePositionAtSwing(badgeSwingAngle);
  const boundedPosition = clampBadgePosition(badgePosition);
  if (boundedPosition.x !== badgePosition.x || boundedPosition.y !== badgePosition.y) {
    badgePosition = boundedPosition;
    badgeSwingAngle = Math.atan2(badgePosition.x - badgeAnchor.x, badgePosition.y - badgeAnchor.y);
    badgeCurrentLength = Math.hypot(badgePosition.x - badgeAnchor.x, badgePosition.y - badgeAnchor.y);
    badgeSwingVelocity = 0;
    badgeLengthVelocity = 0;
  }

  const targetAngle = clamp(-badgeSwingVelocity * 180, -maxBadgeTilt, maxBadgeTilt);
  badgeAngularVelocity += (targetAngle - badgeAngle) * 0.05 * delta;
  badgeAngularVelocity *= Math.pow(0.9, delta);
  badgeAngle = clamp(badgeAngle + badgeAngularVelocity * delta, -maxBadgeTilt, maxBadgeTilt);

  updateBadgeAppearance();
  simulateLanyard(delta);
  drawLanyard();

  const ropeMotion = ropePoints.reduce((motion, point) => {
    return motion + Math.abs(point.x - point.previousX) + Math.abs(point.y - point.previousY);
  }, 0);
  const isMoving = draggingBadge
    || Math.abs(badgeSwingVelocity) > 0.00025
    || Math.abs(badgeLengthVelocity) > 0.025
    || Math.abs(badgeSwingAngle) > 0.001
    || Math.abs(badgeCurrentLength - badgeLength) > 0.25
    || Math.abs(badgeAngularVelocity) > 0.05
    || ropeMotion > 0.5;

  if (isMoving) badgeFrame = window.requestAnimationFrame(animateBadge);
  else previousBadgeFrame = 0;
}

function wakeBadge() {
  if (!badgePhysicsReady) initializeBadgePhysics();
  if (!badgeFrame && badgePhysicsReady) badgeFrame = window.requestAnimationFrame(animateBadge);
}

function finishBadgeDrag(event) {
  if (!draggingBadge || (badgePointerId !== null && event.pointerId !== badgePointerId)) return;
  draggingBadge = false;
  portrait.classList.remove("is-dragging");
  if (portrait.hasPointerCapture(event.pointerId)) portrait.releasePointerCapture(event.pointerId);
  badgePointerId = null;
  updateBadgeScrollFollow();
  wakeBadge();
}

function finishPortraitIntro(event) {
  if (event.target !== portrait) return;
  document.body.classList.remove("cyber-intro");
  portrait.classList.remove("photo-snapped");
  if (!draggingBadge) {
    initializeBadgePhysics();
    updateBadgeScrollFollow();
  }
  portrait.removeEventListener("animationend", finishPortraitIntro);
}
portrait.addEventListener("animationend", finishPortraitIntro);

portrait.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 && event.pointerType === "mouse") return;
  wakeBadge();
  if (badgeScrollOffsetY) {
    badgePosition.y += badgeScrollOffsetY;
    badgeCurrentLength = Math.hypot(
      badgePosition.x - badgeAnchor.x,
      badgePosition.y - badgeAnchor.y
    );
    badgeSwingAngle = Math.atan2(
      badgePosition.x - badgeAnchor.x,
      badgePosition.y - badgeAnchor.y
    );
    badgeScrollOffsetY = 0;
    updateBadgeAppearance();
  }
  event.preventDefault();
  draggingBadge = true;
  badgePointerId = event.pointerId;
  portrait.classList.add("is-dragging");
  portrait.setPointerCapture(event.pointerId);

  const artRect = heroArt.getBoundingClientRect();
  const pointerX = event.clientX - artRect.left;
  const pointerY = event.clientY - artRect.top;
  badgePointerOffset = { x: badgePosition.x - pointerX, y: badgePosition.y - pointerY };
  badgeDragTargetAngle = badgeSwingAngle;
  badgeDragTargetLength = badgeCurrentLength;
  badgeSwingVelocity = 0;
  wakeBadge();
});

portrait.addEventListener("pointermove", (event) => {
  if (!draggingBadge || event.pointerId !== badgePointerId) return;
  const artRect = heroArt.getBoundingClientRect();
  const pointerX = event.clientX - artRect.left;
  const pointerY = event.clientY - artRect.top;
  const targetPosition = {
    x: pointerX + badgePointerOffset.x,
    y: pointerY + badgePointerOffset.y
  };
  const boundedTarget = clampBadgePosition(targetPosition);
  badgeDragTargetAngle = Math.atan2(
    boundedTarget.x - badgeAnchor.x,
    boundedTarget.y - badgeAnchor.y
  );
  badgeDragTargetLength = Math.hypot(
    boundedTarget.x - badgeAnchor.x,
    boundedTarget.y - badgeAnchor.y
  );
  wakeBadge();
});

portrait.addEventListener("pointerup", finishBadgeDrag);
portrait.addEventListener("pointercancel", finishBadgeDrag);
portrait.addEventListener("lostpointercapture", finishBadgeDrag);
portrait.addEventListener("keydown", (event) => {
  const movements = {
    ArrowLeft: [-18, 0],
    ArrowRight: [18, 0],
    ArrowUp: [0, -18],
    ArrowDown: [0, 18]
  };
  const movement = movements[event.key];
  if (!movement) return;
  event.preventDefault();
  wakeBadge();
  const direction = movement[0] || -movement[1];
  badgeSwingVelocity += direction * 0.012;
  wakeBadge();
});

window.addEventListener("resize", () => {
  if (!badgePhysicsReady || draggingBadge) return;
  initializeBadgePhysics();
  updateBadgeScrollFollow();
});
window.addEventListener("scroll", updateBadgeScrollFollow, { passive: true });

