const TIRANGA = ["#FF9933", "#FFFFFF", "#138808", "#0A3A82"];

export async function burstConfetti(origin: { x: number; y: number } = { x: 0.5, y: 0.5 }) {
  const confetti = (await import("canvas-confetti")).default;
  confetti({ particleCount: 90, spread: 78, startVelocity: 45, origin, colors: TIRANGA, scalar: 0.9 });
  setTimeout(
    () => confetti({ particleCount: 60, spread: 110, decay: 0.92, origin, colors: TIRANGA, scalar: 1.1 }),
    150,
  );
}

export async function sideCannons() {
  const confetti = (await import("canvas-confetti")).default;
  const end = Date.now() + 900;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: TIRANGA });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: TIRANGA });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
