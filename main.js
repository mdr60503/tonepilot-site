const canvas = document.getElementById('balanceScene');
const ctx = canvas?.getContext('2d');

function resize() {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw(time = 0) {
  if (!canvas || !ctx) return;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h * 0.38;
  const radius = Math.min(w, h) * 0.24;
  const pulse = Math.sin(time * 0.0014) * 4;

  ctx.save();
  ctx.translate(cx, cy);

  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const outer = radius + pulse + (i === 3 ? 12 : 0);
    const x = Math.cos(angle) * outer;
    const y = Math.sin(angle) * outer;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.strokeStyle = i === 3 ? 'rgba(239, 107, 85, 0.42)' : 'rgba(244, 239, 228, 0.16)';
    ctx.lineWidth = i === 3 ? 2 : 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, i === 3 ? 8 : 5, 0, Math.PI * 2);
    ctx.fillStyle = i === 1 ? 'rgba(230, 162, 71, 0.82)' : i === 3 ? 'rgba(239, 107, 85, 0.86)' : 'rgba(106, 166, 255, 0.72)';
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.58 + pulse, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(244, 239, 228, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(244, 239, 228, 0.9)';
  ctx.fill();
  ctx.restore();

  requestAnimationFrame(draw);
}

if (canvas && ctx) {
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}
