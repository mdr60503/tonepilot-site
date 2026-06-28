const canvas = document.getElementById("compassScene");
const context = canvas.getContext("2d");

const palette = [
  "98, 189, 197",
  "255, 157, 56",
  "141, 190, 133",
  "230, 120, 97",
  "232, 222, 197"
];

let width = 0;
let height = 0;
let ratio = 1;

function resizeCanvas() {
  ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.max(1, Math.floor(width * ratio));
  canvas.height = Math.max(1, Math.floor(height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function polarPoint(centerX, centerY, radius, angle) {
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius
  };
}

function strokeCircle(centerX, centerY, radius, color, alpha, lineWidth = 1) {
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.strokeStyle = `rgba(${color}, ${alpha})`;
  context.lineWidth = lineWidth;
  context.stroke();
}

function drawArc(centerX, centerY, radius, start, end, color, alpha, lineWidth) {
  context.beginPath();
  context.arc(centerX, centerY, radius, start, end);
  context.strokeStyle = `rgba(${color}, ${alpha})`;
  context.lineCap = "round";
  context.lineWidth = lineWidth;
  context.stroke();
}

function drawFlower(centerX, centerY, radius, breath, t) {
  const petalRadius = radius * (0.38 + breath * 0.018);
  const orbit = radius * (0.31 + breath * 0.012);
  const layers = [0, Math.PI / 6, Math.PI / 3];

  context.save();
  context.globalCompositeOperation = "screen";

  strokeCircle(centerX, centerY, petalRadius * 0.8, "238, 231, 216", 0.05, 1);

  layers.forEach((offset, layer) => {
    const layerAlpha = 0.055 - layer * 0.01;
    for (let i = 0; i < 12; i += 1) {
      const angle = offset + (i / 12) * Math.PI * 2 + Math.sin(t * 0.16 + layer) * 0.018;
      const point = polarPoint(centerX, centerY, orbit, angle);
      strokeCircle(point.x, point.y, petalRadius, palette[(i + layer) % palette.length], layerAlpha, 1.1);
    }
  });

  context.restore();
}

function drawCompass(centerX, centerY, radius, breath, t) {
  const compassRadius = radius * (0.66 + breath * 0.012);
  const arcWidth = Math.max(7, radius * 0.022);

  strokeCircle(centerX, centerY, radius * 0.76, "232, 222, 197", 0.08, 1);
  strokeCircle(centerX, centerY, radius * 0.46, "98, 189, 197", 0.055, 1);

  for (let i = 0; i < palette.length; i += 1) {
    const start = -Math.PI / 2 + i * (Math.PI * 2 / palette.length) + 0.14;
    const end = start + Math.PI * 2 / palette.length - 0.44;
    const color = palette[i];
    const clarity = 0.5 + Math.sin(t * 0.42 + i * 0.7) * 0.08;
    const nodeAngle = start + (end - start) * (0.48 + Math.sin(t * 0.18 + i) * 0.08);
    const node = polarPoint(centerX, centerY, compassRadius, nodeAngle);

    context.shadowColor = `rgba(${color}, ${0.24 + clarity * 0.18})`;
    context.shadowBlur = 18 + clarity * 20;
    drawArc(centerX, centerY, compassRadius, start, end, color, 0.4 + clarity * 0.22, arcWidth);

    context.shadowBlur = 0;
    drawArc(centerX, centerY, compassRadius - arcWidth * 1.8, start + 0.05, end - 0.07, color, 0.14, 2);

    context.beginPath();
    context.arc(node.x, node.y, 7.5 + breath * 1.6, 0, Math.PI * 2);
    context.fillStyle = `rgba(${color}, ${0.84})`;
    context.fill();
  }

  context.shadowBlur = 0;
  strokeCircle(centerX, centerY, radius * 0.14, "168, 173, 95", 0.34, 2);
  strokeCircle(centerX, centerY, radius * 0.07, "238, 231, 216", 0.22, radius * 0.026);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function draw(time) {
  const t = time * 0.001;
  const breath = 0.5 + Math.sin(t * 0.54) * 0.5;
  const centerX = width * 0.66;
  const centerY = height * 0.52;
  const radius = Math.min(width, height) * 0.34;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#11100d";
  context.fillRect(0, 0, width, height);

  drawFlower(centerX, centerY, radius, breath, t);
  drawCompass(centerX, centerY, radius, breath, t);

  if (!reduceMotion) {
    requestAnimationFrame(draw);
  }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (reduceMotion) {
  draw(0);
} else {
  requestAnimationFrame(draw);
}
