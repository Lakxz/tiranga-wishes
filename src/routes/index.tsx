import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { WavingFlag, ChakraMark } from "@/components/WavingFlag";
import { burstConfetti, sideCannons } from "@/lib/celebrate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tiranga Wishes — 80th Independence Day of India" },
      {
        name: "description",
        content:
          "Enter your name, pick a patriotic poster theme and get a live animated 80th Independence Day postcard you can download.",
      },
      { property: "og:title", content: "Tiranga Wishes — 80th Independence Day of India" },
      {
        property: "og:description",
        content: "Personalised animated Independence Day postcards for India, free to download.",
      },
    ],
  }),
  component: Index,
});

const WISHES = [
  "May your dreams fly as high as the tricolour, and your courage run as deep as the Ganga.",
  "Eighty years of freedom, and a nation still writing its brightest chapter — with you in it.",
  "Freedom is a promise passed hand to hand. Today it rests warmly in yours.",
  "Saffron for your courage, white for your peace, green for everything you'll grow.",
  "May this land keep rising, and may you rise with it — proud, kind and unafraid.",
];

type ThemeId = "classic" | "midnight" | "khadi";

const THEMES: Record<
  ThemeId,
  {
    name: string;
    tagline: string;
    swatch: string;
    surface: string;
    cardClass: string;
    headingClass: string;
    bodyClass: string;
    eyebrowClass: string;
    footClass: string;
    chakraClass: string;
    layout: "split" | "stacked" | "banner";
  }
> = {
  classic: {
    name: "Tiranga Classic",
    tagline: "Warm parchment · side by side",
    swatch: "var(--gradient-tiranga)",
    surface: "var(--gradient-dawn)",
    cardClass: "border-saffron/30",
    headingClass: "text-navy",
    bodyClass: "text-foreground/80",
    eyebrowClass: "text-india-green",
    footClass: "text-navy/70",
    chakraClass: "text-navy",
    layout: "split",
  },
  midnight: {
    name: "Midnight Chakra",
    tagline: "Deep indigo · gold serif centre",
    swatch: "var(--gradient-midnight)",
    surface: "var(--gradient-midnight)",
    cardClass: "border-gold/40",
    headingClass: "text-gold",
    bodyClass: "text-khadi/85",
    eyebrowClass: "text-gold/80",
    footClass: "text-khadi/60",
    chakraClass: "text-gold",
    layout: "stacked",
  },
  khadi: {
    name: "Khadi Heritage",
    tagline: "Handloom texture · banner top",
    swatch: "var(--gradient-khadi)",
    surface: "var(--gradient-khadi)",
    cardClass: "border-ink-green/30 khadi-weave",
    headingClass: "text-ink-green",
    bodyClass: "text-ink/75",
    eyebrowClass: "text-saffron",
    footClass: "text-ink-green/70",
    chakraClass: "text-ink-green",
    layout: "banner",
  },
};

const Petals = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {Array.from({ length: 18 }).map((_, i) => {
      const colors = ["var(--saffron)", "var(--india-green)", "oklch(0.99 0 0)"];
      return (
        <span
          key={i}
          className="petal"
          style={{
            left: `${(i * 5.6 + 2) % 100}%`,
            width: `${6 + (i % 4) * 3}px`,
            height: `${6 + (i % 3) * 4}px`,
            background: colors[i % 3],
            animationDuration: `${11 + (i % 7) * 2.5}s`,
            animationDelay: `${-i * 1.4}s`,
            opacity: 0.7,
          }}
        />
      );
    })}
  </div>
);

function Index() {
  const [name, setName] = useState("");
  const [greetName, setGreetName] = useState<string | null>(null);
  const [wish, setWish] = useState(WISHES[0]);
  const [themeId, setThemeId] = useState<ThemeId>("classic");
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeId];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    setWish(WISHES[Math.floor(Math.random() * WISHES.length)]);
    setGreetName(clean);
    void burstConfetti({ x: 0.5, y: 0.55 });
    setTimeout(() => void sideCannons(), 300);
  };

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `independence-day-wish-${greetName?.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      void burstConfetti({ x: 0.5, y: 0.8 });
      void sideCannons();
    } finally {
      setBusy(false);
    }
  };

  const flagSize = theme.layout === "split" ? "w-36 sm:w-48" : "w-28 sm:w-36";

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:py-16">
      <Petals />

      <div className="relative mx-auto w-full max-w-3xl">
        <header className="text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-india-green sm:text-xs">
            15 August 2026 · Bharat
          </p>
          <h1 className="font-display mt-3 text-4xl leading-tight text-navy sm:text-6xl">
            <span className="text-saffron">80</span> Years of Freedom
          </h1>
          <div className="mx-auto mt-4 h-1 w-40 rounded-full" style={{ background: "var(--gradient-tiranga)" }} />
        </header>

        {!greetName ? (
          <section
            className="animate-rise mt-10 rounded-3xl border border-saffron/25 bg-parchment/80 p-6 backdrop-blur-sm sm:p-10"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="mx-auto w-40 sm:w-56">
              <WavingFlag />
            </div>
            <h2 className="mt-8 text-center text-xl font-semibold text-navy sm:text-2xl">
              Who are we celebrating with?
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter your name to unwrap your personal Independence Day postcard.
            </p>
            <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                maxLength={28}
                className="w-full rounded-full border border-saffron/40 bg-background px-5 py-3 text-base text-foreground outline-none transition focus:border-saffron focus:ring-4 focus:ring-saffron/20"
              />
              <button
                type="submit"
                className="rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: "var(--saffron)", boxShadow: "var(--shadow-glow)" }}
              >
                Celebrate
              </button>
            </form>
          </section>
        ) : (
          <section className="mt-10">
            <div className="mb-5">
              <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-navy/60">
                Choose your poster theme
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                  const t = THEMES[id];
                  const active = id === themeId;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setThemeId(id);
                        void burstConfetti({ x: 0.5, y: 0.35 });
                      }}
                      aria-pressed={active}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all hover:scale-[1.02] ${
                        active ? "border-saffron bg-saffron/10 ring-2 ring-saffron/30" : "border-navy/15 bg-parchment/70"
                      }`}
                    >
                      <span
                        className="h-8 w-8 shrink-0 rounded-full border border-navy/10"
                        style={{ background: t.swatch }}
                      />
                      <span>
                        <span className="block text-sm font-semibold text-navy">{t.name}</span>
                        <span className="block text-[0.7rem] text-navy/60">{t.tagline}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              ref={cardRef}
              key={themeId}
              className={`animate-rise relative overflow-hidden rounded-3xl border p-6 sm:p-10 ${theme.cardClass}`}
              style={{ background: theme.surface, boxShadow: "var(--shadow-card)" }}
            >
              <div className="absolute inset-x-0 top-0 h-2" style={{ background: "var(--gradient-tiranga)" }} />

              {theme.layout === "banner" && (
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className={`text-[0.6rem] uppercase tracking-[0.35em] ${theme.eyebrowClass}`}>1947</span>
                  <div className="h-px flex-1" style={{ background: "var(--gradient-tiranga)" }} />
                  <span className={`text-[0.6rem] uppercase tracking-[0.35em] ${theme.eyebrowClass}`}>2026</span>
                </div>
              )}

              <div
                className={
                  theme.layout === "split"
                    ? "flex flex-col items-center gap-6 sm:flex-row sm:gap-10"
                    : "flex flex-col items-center gap-5 text-center"
                }
              >
                <div className={`${flagSize} shrink-0`}>
                  <WavingFlag />
                </div>
                <div className={theme.layout === "split" ? "text-center sm:text-left" : "text-center"}>
                  <p className={`text-[0.65rem] uppercase tracking-[0.35em] ${theme.eyebrowClass}`}>
                    Happy Independence Day
                  </p>
                  <h2 className={`font-display mt-2 break-words text-3xl sm:text-5xl ${theme.headingClass}`}>
                    {greetName}
                  </h2>
                  <p className={`mt-4 text-base leading-relaxed sm:text-lg ${theme.bodyClass}`}>{wish}</p>
                  <div
                    className={`mt-5 flex items-center gap-3 ${
                      theme.layout === "split" ? "justify-center sm:justify-start" : "justify-center"
                    }`}
                  >
                    <ChakraMark className={`h-6 w-6 ${theme.chakraClass}`} />
                    <span className={`text-xs uppercase tracking-[0.3em] ${theme.footClass}`}>
                      Jai Hind · 1947–2026
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-2" style={{ background: "var(--gradient-tiranga)" }} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={download}
                disabled={busy}
                className="rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
                style={{ background: "var(--india-green)" }}
              >
                {busy ? "Preparing…" : "Download postcard"}
              </button>
              <button
                onClick={() => setWish(WISHES[Math.floor(Math.random() * WISHES.length)])}
                className="rounded-full border border-saffron/50 px-6 py-3 text-base font-semibold text-navy transition-colors hover:bg-saffron/10"
              >
                New wish
              </button>
              <button
                onClick={() => {
                  setGreetName(null);
                  setName("");
                }}
                className="rounded-full px-6 py-3 text-base font-medium text-navy/70 transition-colors hover:text-navy"
              >
                Change name
              </button>
            </div>
          </section>
        )}

        <footer className="mt-12 text-center text-xs text-navy/50">
          Made with love for India · 80th Independence Day
        </footer>
      </div>
    </main>
  );
}
