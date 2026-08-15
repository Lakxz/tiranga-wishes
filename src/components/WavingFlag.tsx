import { useEffect, useRef } from "react";

const Chakra = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="7" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="6"
        stroke="currentColor"
        strokeWidth="2.5"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
  </svg>
);

const W = 600;
const H = 400;

/** Draws the flat tricolour (saffron / white+chakra / green) onto an offscreen canvas. */
function paintFlagTexture() {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const band = H / 3;

  g.fillStyle = "#FF9933";
  g.fillRect(0, 0, W, band);
  g.fillStyle = "#FFFFFF";
  g.fillRect(0, band, W, band);
  g.fillStyle = "#138808";
  g.fillRect(0, band * 2, W, band);

  // Ashoka Chakra
  const cx = W / 2;
  const cy = H / 2;
  const r = band * 0.42;
  g.strokeStyle = "#0A3A82";
  g.fillStyle = "#0A3A82";
  g.lineWidth = r * 0.09;
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.arc(cx, cy, r * 0.14, 0, Math.PI * 2);
  g.fill();
  g.lineWidth = r * 0.05;
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI) / 12;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94);
    g.stroke();
  }
  return c;
}

/**
 * Cloth simulation: the flag is sliced into vertical strips. Each strip is
 * displaced and vertically scaled by travelling sine waves whose amplitude
 * grows with distance from the hoist (the pole edge stays pinned), producing
 * the way real fabric ripples as wind rolls across it. Per-strip lighting is
 * derived from the wave slope so folds catch and lose light.
 */
export const WavingFlag = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const texture = paintFlagTexture();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(width * (H / W)));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const STRIP = 2; // px per slice — small enough to look continuous

    const draw = (time: number) => {
      const t = reduce ? 0 : time / 1000;
      ctx.clearRect(0, 0, width, height);

      const pad = height * 0.14; // room for the cloth to swing vertically
      const cloth = height - pad * 2;

      for (let x = 0; x < width; x += STRIP) {
        const u = x / width; // 0 at hoist, 1 at fly end

        // amplitude grows away from the pole (cloth is clamped at the hoist)
        const amp = Math.pow(u, 1.6) * height * 0.16;
        const phase = u * 7.5;

        // two travelling waves of different speed/length = organic, non-looping motion
        const wave =
          Math.sin(phase - t * 3.1) * 0.7 +
          Math.sin(phase * 0.55 - t * 1.9 + 1.3) * 0.45 +
          Math.sin(phase * 1.9 - t * 4.4) * 0.12;

        const offset = wave * amp + Math.sin(t * 1.2) * u * height * 0.03;

        // slope drives foreshortening (cloth turning away) and shading
        const slope =
          (Math.cos(phase - t * 3.1) * 0.7 + Math.cos(phase * 0.55 - t * 1.9 + 1.3) * 0.25) * u;
        const squeeze = 1 - Math.abs(slope) * 0.16;

        const stripH = cloth * squeeze;
        const y = pad + (cloth - stripH) / 2 + offset;

        ctx.drawImage(
          texture,
          (x / width) * W,
          0,
          (STRIP / width) * W,
          H,
          x,
          y,
          STRIP + 1,
          stripH,
        );

        // fold lighting
        const light = slope * 0.55;
        ctx.fillStyle =
          light > 0 ? `rgba(255,255,255,${light * 0.45})` : `rgba(20,10,0,${-light * 0.5})`;
        ctx.fillRect(x, y, STRIP + 1, stripH);
      }

      // soft shadow along the hoist
      const grad = ctx.createLinearGradient(0, 0, width * 0.12, 0);
      grad.addColorStop(0, "rgba(0,0,0,0.22)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width * 0.12, height);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ display: "block", filter: "drop-shadow(0 14px 22px rgba(10,40,90,0.28))" }}
        role="img"
        aria-label="Waving flag of India"
      />
    </div>
  );
};

export const ChakraMark = Chakra;
