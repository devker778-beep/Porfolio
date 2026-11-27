const widget = document.querySelector("#old-tv-widget");
const canvas = widget.querySelector(".old-tv-canvas");
const status = widget.querySelector(".old-tv-status");
const messages = [
  "WHO AM I?",
  "IDENTITY ONLINE",
  "SIGNAL FOUND",
  "STAY CURIOUS",
  "SELF.EXE READY",
  "WELCOME, TRAVELER",
  "MEMORY RESTORED",
  "YOUR STORY MATTERS"
];
const screenCanvas = document.createElement("canvas");
screenCanvas.width = 640;
screenCanvas.height = 500;
const screenContext = screenCanvas.getContext("2d");
let activeMessage = messages[Math.floor(Math.random() * messages.length)];
let nextMessageAt = 0;
let lastScreenUpdate = 0;
let turnStartedAt = 0;
let turnDirection = 1;
const turnDuration = 900;
const idleRotationDuration = 3600;

function startTurn() {
  turnStartedAt = performance.now();
  turnDirection = Math.random() < 0.5 ? -1 : 1;
  status.textContent = "Turning the old television.";
}

function clickRotationOffset(time, angle) {
  if (!turnStartedAt) return 0;
  const progress = Math.min((time - turnStartedAt) / turnDuration, 1);
  if (progress === 1) {
    turnStartedAt = 0;
    status.textContent = "Television ready. Click to turn again.";
    return 0;
  }
  return Math.sin(progress * Math.PI) * turnDirection * angle;
}

function idleRotation(time) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  return Math.sin(time * Math.PI * 2 / idleRotationDuration) * 0.12;
}

function roundedRectPath(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawScreen(time) {
  if (time >= nextMessageAt) {
    activeMessage = messages[Math.floor(Math.random() * messages.length)];
    nextMessageAt = time + 1800 + Math.random() * 2400;
  }

  const { width, height } = screenCanvas;
  const context = screenContext;
  context.clearRect(0, 0, width, height);
  roundedRectPath(context, 8, 8, width - 16, height - 16, 54);
  context.fillStyle = "#031309";
  context.fill();
  context.save();
  context.clip();

  const glow = context.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.75);
  glow.addColorStop(0, "#0b3b1a");
  glow.addColorStop(1, "#020805");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.font = "600 21px 'JetBrains Mono', monospace";
  context.fillStyle = "rgba(104, 255, 143, .72)";
  context.textAlign = "left";
  context.fillText("CHANNEL 01  /  LIVE", 44, 58);
  context.textAlign = "right";
  context.fillText("REC", width - 46, 58);
  context.fillStyle = "rgba(105, 255, 139, .25)";
  context.fillRect(42, 75, width - 84, 2);

  context.font = "500 18px 'JetBrains Mono', monospace";
  context.fillStyle = "rgba(92, 255, 129, .43)";
  for (let row = 0; row < 7; row += 1) {
    const digits = Array.from({ length: 28 }, () => Math.random() < 0.5 ? "0" : "1").join("");
    context.fillText(digits, 50, 124 + row * 30);
  }

  context.textAlign = "center";
  context.shadowColor = "#59ff83";
  context.shadowBlur = 20;
  context.font = "700 31px 'JetBrains Mono', monospace";
  context.fillStyle = "#a0ffb3";
  context.fillText(activeMessage, width / 2, 365, width - 76);
  context.shadowBlur = 0;

  context.fillStyle = "rgba(105, 255, 139, .25)";
  context.fillRect(42, 400, width - 84, 2);
  context.font = "500 15px 'JetBrains Mono', monospace";
  context.fillStyle = "rgba(105, 255, 139, .68)";
  context.fillText("0 1 0 1 1 0 1 0  /  SIGNAL STABLE", width / 2, 438);

  context.strokeStyle = "rgba(89, 255, 131, .75)";
  context.lineWidth = 3;
  roundedRectPath(context, 9, 9, width - 18, height - 18, 54);
  context.stroke();
  context.restore();
}

function startScreenFallback() {
  const context = canvas.getContext("2d");
  if (!context) {
    status.textContent = "The television could not be displayed.";
    return;
  }

  let startedAt = 0;
  function drawFallback(time) {
    const width = canvas.clientWidth * window.devicePixelRatio;
    const height = canvas.clientHeight * window.devicePixelRatio;
    if (!width || !height) {
      window.requestAnimationFrame(drawFallback);
      return;
    }

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    context.clearRect(0, 0, width, height);
    canvas.style.transform = `rotateY(${idleRotation(time) + clickRotationOffset(time, 0.22)}rad)`;
    context.save();
    context.scale(width / 300, height / 260);
    context.shadowColor = "#59ff83";
    context.shadowBlur = 24;
    roundedRectPath(context, 23, 24, 254, 206, 35);
    const bodyGradient = context.createLinearGradient(25, 30, 265, 220);
    bodyGradient.addColorStop(0, "#126a32");
    bodyGradient.addColorStop(1, "#052512");
    context.fillStyle = bodyGradient;
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = "#59ff83";
    context.stroke();
    context.shadowBlur = 0;
    context.drawImage(screenCanvas, 43, 46, 170, 142);
    context.fillStyle = "#4cff79";
    context.beginPath();
    context.arc(239, 94, 10, 0, Math.PI * 2);
    context.arc(239, 132, 7, 0, Math.PI * 2);
    context.fill();
    context.restore();

    if (time - startedAt > 130) {
      drawScreen(time);
      startedAt = time;
    }

    window.requestAnimationFrame(drawFallback);
  }

  widget.addEventListener("click", startTurn);
  status.textContent = "Television ready. Click to turn.";
  window.requestAnimationFrame(drawFallback);
}

async function initializeOldTelevision() {
  status.textContent = "Loading the old television.";
  try {
    const [THREE, { ColladaLoader }] = await Promise.all([
      import("three"),
      import("three/addons/loaders/ColladaLoader.js")
    ]);

    const loader = new ColladaLoader();
    const { scene: model } = await loader.loadAsync("old-tv/source/model.dae");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.16, 4.6);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0x62ad78, 1.1));

    const keyLight = new THREE.DirectionalLight(0x72d98a, 1.9);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x13d65a, 6, 8);
    rimLight.position.set(2, 1.5, 2);
    scene.add(rimLight);

    const television = new THREE.Group();
    scene.add(television);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c5929,
      emissive: 0x03280f,
      emissiveIntensity: 0.25,
      metalness: 0.24,
      roughness: 0.46,
      side: THREE.DoubleSide
    });

    model.traverse((part) => {
      if (!part.isMesh) return;
      part.material = bodyMaterial;
      part.castShadow = true;
      part.receiveShadow = true;
    });

    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const normalization = 2.4 / Math.max(size.x, size.y, size.z);
    const sourceUnit = size.x / 2;
    model.scale.multiplyScalar(normalization);
    model.position.set(
      -center.x * normalization,
      -center.y * normalization,
      -center.z * normalization
    );
    television.add(model);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2 * sourceUnit, 0.94 * sourceUnit),
      new THREE.MeshBasicMaterial({
        map: screenTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false
      })
    );
    screen.position.set(
      (-0.2 * sourceUnit - center.x) * normalization,
      (0.1 * sourceUnit - center.y) * normalization,
      (0.795 * sourceUnit - center.z) * normalization
    );
    screen.scale.setScalar(normalization);
    television.add(screen);

    function resizeRenderer() {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resizeRenderer();
    window.addEventListener("resize", resizeRenderer);

    widget.addEventListener("click", startTurn);

    function animate(now) {
      window.requestAnimationFrame(animate);
      if (now - lastScreenUpdate >= 130) {
        drawScreen(now);
        screenTexture.needsUpdate = true;
        lastScreenUpdate = now;
      }

      television.rotation.y = idleRotation(now) + clickRotationOffset(now, 0.22);
      television.position.y = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : Math.sin(now * 0.001) * 0.02;

      renderer.render(scene, camera);
    }

    status.textContent = "Television ready. Click to turn.";
    window.requestAnimationFrame(animate);
  } catch (error) {
    console.error("The 3D television could not be initialized; showing the canvas fallback.", error);
    status.textContent = "The 3D TV is unavailable. Showing a simplified television.";
    startScreenFallback();
  }
}

initializeOldTelevision();
