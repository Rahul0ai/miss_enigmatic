import { useState, useEffect, useRef } from "react";
import wantedPosterAsset from "@/assets/wanted-poster.png.asset.json";
import luffyAsset from "@/assets/luffy.gif.asset.json";
import zoroAsset from "@/assets/zoro.gif.asset.json";
import sanjiAsset from "@/assets/sanji.gif.asset.json";
import frankyAsset from "@/assets/franky.gif.asset.json";
import seaStormAsset from "@/assets/sea-storm.jpg.asset.json";
import underwaterAsset from "@/assets/underwater.jpg.asset.json";
import barrelsAsset from "@/assets/barrels.jpg.asset.json";
import wantedWoodAsset from "@/assets/wanted-wood.jpg.asset.json";
import namiImg from "@/assets/nami.jpg";
import chopperImg from "@/assets/chopper.jpg";
import robinImg from "@/assets/robin.jpg";
import usoppImg from "@/assets/usopp.jpg";
import brookImg from "@/assets/brook.jpg";

type Chapter = {
  id: number;
  name: string;
  island: string;
  gif?: string;
  bg: string;
};

const CHAPTERS: Chapter[] = [
  { id: 1, name: "Set Sail", island: "Foosha Village", bg: seaStormAsset.url },
  { id: 2, name: "The Wanted Poster", island: "Loguetown", bg: wantedWoodAsset.url },
  { id: 3, name: "Meet the Crew", island: "Thousand Sunny", gif: luffyAsset.url, bg: underwaterAsset.url },
  { id: 4, name: "Treasure of Memories", island: "Skypiea", bg: barrelsAsset.url },
  { id: 5, name: "Marine Ambush", island: "Enies Lobby", bg: wantedWoodAsset.url },
  { id: 6, name: "The Grand Party", island: "Water 7", gif: frankyAsset.url, bg: seaStormAsset.url },
];

const CREW = [
  { name: "Luffy", role: "Captain of the Straw Hats", quote: "I'M GONNA BE KING OF THE PIRATES!", gif: luffyAsset.url, color: "oklch(0.65 0.22 25)" },
  { name: "Zoro", role: "The Swordsman", quote: "Nothing happened.", gif: zoroAsset.url, color: "oklch(0.55 0.15 145)" },
  { name: "Nami", role: "The Navigator", quote: "Leave the map to me!", gif: namiImg, color: "oklch(0.78 0.18 55)" },
  { name: "Sanji", role: "The Cook of the Sea", quote: "A real man never bullies a woman.", gif: sanjiAsset.url, color: "oklch(0.78 0.15 88)" },
  { name: "Usopp", role: "The Sniper", quote: "I am the great Captain Usopp!", gif: usoppImg, color: "oklch(0.6 0.18 60)" },
  { name: "Chopper", role: "The Doctor", quote: "Don't think you can compliment me!", gif: chopperImg, color: "oklch(0.75 0.15 20)" },
  { name: "Robin", role: "The Archaeologist", quote: "I want to live!", gif: robinImg, color: "oklch(0.5 0.12 300)" },
  { name: "Franky", role: "The Cyborg Shipwright", quote: "SUUUPER Birthday!", gif: frankyAsset.url, color: "oklch(0.62 0.18 230)" },
  { name: "Brook", role: "The Musician", quote: "Yohohoho! May I see your panties?", gif: brookImg, color: "oklch(0.7 0.05 280)" },
];

const MEMORIES = [
  { title: "The Devil Fruit of Friendship", text: "You bit into it years ago — the power you gained? Making every ordinary day feel like an adventure worth remembering." },
  { title: "Log Pose of the Heart", text: "No matter which island life sends me to, my compass always spins back toward our bond. That's the real Grand Line." },
  { title: "Nakama Forever", text: "Luffy has his crew. I have you. Through storms, laughter, and 3 AM ramen — you're my forever nakama." },
];

export function AdventureMap() {
  const [chapter, setChapter] = useState(0);
  const [unlocked, setUnlocked] = useState(1);
  const [showFinale, setShowFinale] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  const go = (i: number) => {
    if (i <= unlocked - 1) {
      setChapter(i);
      if (i + 1 > unlocked && i < CHAPTERS.length - 1) setUnlocked(i + 2);
      if (i === CHAPTERS.length - 1) setTimeout(() => setShowFinale(true), 1200);
    }
  };

  const advance = () => {
    const next = Math.min(chapter + 1, CHAPTERS.length - 1);
    setUnlocked((u) => Math.max(u, next + 1));
    setChapter(next);
    if (next === CHAPTERS.length - 1) setTimeout(() => setShowFinale(true), 1500);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ocean text-foreground">
      {/* Ambient background image per chapter */}
      <div
        key={chapter}
        className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-700 anim-reveal md:opacity-35"
        style={{ backgroundImage: `url(${CHAPTERS[chapter].bg})` }}
      />
      <div className="absolute inset-0 stars opacity-50 anim-spin-slow" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/95" />

      {/* Ambient audio (silent by default). We use Web Audio via a data-uri sine, muted; user can toggle. */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="fixed bottom-4 right-4 z-50 rounded-full border-2 border-gold bg-background/90 px-3 py-2 text-[10px] font-serif-cinzel uppercase tracking-widest text-gold backdrop-blur transition-all hover:bg-gold hover:text-background sm:top-4 sm:bottom-auto sm:text-xs"
        aria-label="Toggle sound"
      >
        <span className="hidden sm:inline">{muted ? "🔇 Silent Sea" : "🔊 Sea Shanty"}</span>
        <span className="sm:hidden">{muted ? "🔇" : "🔊"}</span>
      </button>

      {/* Chapter progress rail */}
      <ProgressRail chapter={chapter} unlocked={unlocked} onSelect={go} />

      {/* Chapter content */}
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 pb-24 pt-28 md:px-8 md:pt-32">
        {chapter === 0 && <ChapterIntro onAdvance={advance} />}
        {chapter === 1 && <ChapterWanted onAdvance={advance} />}
        {chapter === 2 && <ChapterCrew onAdvance={advance} />}
        {chapter === 3 && <ChapterTreasure onAdvance={advance} />}
        {chapter === 4 && <ChapterGame onAdvance={advance} />}
        {chapter === 5 && <ChapterParty onAdvance={() => setShowFinale(true)} />}
      </main>

      {showFinale && <FinaleOverlay onClose={() => setShowFinale(false)} />}
    </div>
  );
}

/* -------------------- Progress Rail -------------------- */
function ProgressRail({
  chapter,
  unlocked,
  onSelect,
}: {
  chapter: number;
  unlocked: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav className="fixed left-1/2 top-3 z-40 w-[calc(100%-1.5rem)] max-w-max -translate-x-1/2">
      <ol className="flex items-center justify-center gap-1 rounded-full border-2 border-gold/40 bg-background/90 px-2 py-1.5 backdrop-blur-md sm:gap-2 sm:px-4 sm:py-2 md:gap-4 md:px-6">
        {CHAPTERS.map((c, i) => {
          const locked = i >= unlocked;
          const active = i === chapter;
          return (
            <li key={c.id} className="flex items-center gap-2">
              <button
                onClick={() => onSelect(i)}
                disabled={locked}
                className={`group relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-display text-xs transition-all sm:h-8 sm:w-8 sm:text-sm ${
                  active
                    ? "border-gold-bright bg-gold text-background scale-125 shadow-[0_0_20px_var(--gold-bright)]"
                    : locked
                    ? "border-muted/40 bg-background/50 text-muted-foreground/40 cursor-not-allowed"
                    : "border-gold bg-background text-gold hover:scale-110"
                }`}
                aria-label={`Chapter ${c.id}: ${c.name}`}
                title={locked ? "Locked" : c.name}
              >
                {locked ? "🔒" : c.id}
                {active && <span className="absolute inset-0 rounded-full anim-pulse-ring" />}
              </button>
              {i < CHAPTERS.length - 1 && (
                <span className={`h-0.5 w-2 shrink-0 sm:w-4 md:w-8 ${i < unlocked - 1 ? "bg-gold" : "bg-muted/30"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------- Chapter 1: Intro -------------------- */
function ChapterIntro({ onAdvance }: { onAdvance: () => void }) {
  return (
    <div className="anim-reveal text-center">
      <p className="mb-4 font-serif-cinzel text-sm uppercase tracking-[0.4em] text-gold">
        Chapter I · Foosha Village
      </p>
      <h1 className="font-display text-5xl leading-none text-gold-bright drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] sm:text-6xl md:text-8xl lg:text-9xl anim-flicker">
        Happy Birthday
      </h1>
      <h2 className="mt-2 font-display text-3xl text-parchment drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] sm:text-4xl md:text-6xl">
        Captain <span className="text-gold-bright">Rupa</span>
      </h2>
      <div className="mx-auto my-8 h-px w-64 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="mx-auto max-w-2xl rounded-lg bg-background/80 px-4 py-3 font-body text-base italic text-parchment backdrop-blur-sm sm:text-lg md:text-xl">
        The seas have called your name. A treasure greater than One Piece itself
        awaits you — hidden across five islands of memory, laughter, and love.
        Set the sails, hoist the Jolly Roger… your adventure begins now.
      </p>
      <button
        onClick={onAdvance}
        className="group mt-10 relative inline-flex items-center gap-3 rounded-md border-2 border-gold bg-gradient-to-b from-blood to-blood/90 px-8 py-4 font-display text-xl uppercase tracking-widest text-parchment shadow-parchment transition-all hover:scale-105 hover:shadow-[0_0_40px_var(--gold-bright)] shine-sweep md:px-10 md:py-5 md:text-2xl"
      >
        <span>⚓ Set Sail</span>
      </button>
      <p className="mt-4 text-xs uppercase tracking-widest text-parchment/80">
        Click to begin the voyage
      </p>
    </div>
  );
}

/* -------------------- Chapter 2: Wanted Poster -------------------- */
function ChapterWanted({ onAdvance }: { onAdvance: () => void }) {
  const [stamped, setStamped] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStamped(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="anim-reveal grid gap-10 md:grid-cols-2 md:items-center">
      <div className="relative mx-auto max-w-sm">
        <div className="anim-float relative">
          <img
            src={wantedPosterAsset.url}
            alt="Wanted poster of Captain Rupa"
            className="w-full rounded-sm shadow-parchment"
          />
          {stamped && (
            <div
              className="anim-stamp pointer-events-none absolute -right-6 top-1/3 rounded-full border-4 border-blood px-4 py-2 font-display text-xl uppercase text-blood"
              style={{ background: "oklch(0.94 0.03 80 / 0.9)" }}
            >
              Captured Our Hearts
            </div>
          )}
          <div className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-gold shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
          <div className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-gold shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
        </div>
      </div>

      <div>
        <p className="mb-3 font-serif-cinzel text-sm uppercase tracking-[0.4em] text-gold">
          Chapter II · Loguetown
        </p>
        <h2 className="font-display text-4xl text-parchment md:text-6xl">
          Bounty: <span className="text-gold-bright">฿ 300,000,000</span>
        </h2>
        <p className="mt-6 rounded-lg bg-background/80 p-4 font-body text-base italic text-parchment backdrop-blur-sm md:text-lg">
          Wanted across every sea — for the crime of being the most legendary
          human to walk the Grand Line. Your smile is contraband. Your laugh
          could sink the Marines. Even Kaido's afraid of your birthday cake.
        </p>
        <ul className="mt-4 space-y-2 rounded-lg bg-background/80 p-4 font-serif-cinzel text-xs text-parchment backdrop-blur-sm sm:text-sm">
          <li>◆ Devil Fruit: Kind-Kind no Mi (Type: Paramecia)</li>
          <li>◆ Haki: Pure Golden Heart</li>
          <li>◆ Last Seen: Turning another year more incredible</li>
        </ul>
        <button
          onClick={onAdvance}
          className="mt-10 rounded-md border-2 border-gold bg-background/50 px-8 py-4 font-display text-xl uppercase tracking-widest text-gold-bright transition-all hover:bg-gold hover:text-background shine-sweep"
        >
          Board the Sunny →
        </button>
      </div>
    </div>
  );
}

/* -------------------- Chapter 3: Crew -------------------- */
function ChapterCrew({ onAdvance }: { onAdvance: () => void }) {
  return (
    <div className="anim-reveal w-full">
      <div className="mb-10 text-center">
        <p className="font-serif-cinzel text-sm uppercase tracking-[0.4em] text-gold">
          Chapter III · Thousand Sunny
        </p>
        <h2 className="mt-2 font-display text-4xl text-parchment md:text-6xl">
          Your Crew Has <span className="text-gold-bright">Assembled</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl rounded-lg bg-background/80 px-4 py-2 font-body italic text-parchment">
          The Straw Hats sailed the world to wish you happy birthday.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CREW.map((m, i) => (
          <div
            key={m.name}
            className="group relative overflow-hidden rounded-lg border-2 border-gold/40 bg-card p-5 shadow-parchment transition-all hover:scale-[1.03] hover:border-gold hover:shadow-[0_0_30px_var(--gold)]"
            style={{ animation: `reveal-up 0.6s ease-out ${i * 0.15}s both` }}
          >
            <div
              className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4"
              style={{ borderColor: m.color, boxShadow: `0 0 24px ${m.color}` }}
            >
              <img src={m.gif} alt={m.name} className="h-full w-full object-cover" />
            </div>
            <h3 className="text-center font-display text-2xl" style={{ color: m.color }}>
              {m.name}
            </h3>
            <p className="mt-1 text-center font-serif-cinzel text-xs uppercase tracking-widest text-parchment/90">
              {m.role}
            </p>
            <p className="mt-3 text-center font-body italic text-parchment">
              "{m.quote}"
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onAdvance}
          className="rounded-md border-2 border-gold bg-background/50 px-8 py-4 font-display text-xl uppercase tracking-widest text-gold-bright transition-all hover:bg-gold hover:text-background shine-sweep"
        >
          Dig for Treasure →
        </button>
      </div>
    </div>
  );
}

/* -------------------- Chapter 4: Treasure -------------------- */
function ChapterTreasure({ onAdvance }: { onAdvance: () => void }) {
  const [opened, setOpened] = useState<number[]>([]);
  const open = (i: number) => setOpened((o) => (o.includes(i) ? o : [...o, i]));
  const allOpen = opened.length === MEMORIES.length;

  return (
    <div className="anim-reveal w-full">
      <div className="mb-10 text-center">
        <p className="font-serif-cinzel text-sm uppercase tracking-[0.4em] text-gold">
          Chapter IV · Skypiea
        </p>
        <h2 className="mt-2 font-display text-4xl text-parchment md:text-6xl">
          The <span className="text-gold-bright">Poneglyphs</span> of Us
        </h2>
        <p className="mx-auto mt-3 max-w-2xl rounded-lg bg-background/80 px-4 py-2 font-body italic text-parchment">
          Tap each ancient stone to reveal its hidden truth.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MEMORIES.map((m, i) => {
          const isOpen = opened.includes(i);
          return (
            <button
              key={i}
              onClick={() => open(i)}
              style={isOpen ? { background: "oklch(0.93 0.05 78)" } : undefined}
              className={`group relative min-h-[220px] overflow-hidden rounded-lg border-2 p-5 text-left transition-all sm:min-h-[280px] sm:p-6 ${
                isOpen
                  ? "border-gold-bright shadow-[0_0_40px_var(--gold-bright)]"
                  : "border-gold/50 bg-background/90 hover:scale-[1.02] hover:border-gold shadow-parchment"
              }`}
            >
              {!isOpen ? (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <div className="text-6xl anim-sway">🗝️</div>
                  <p className="font-display text-2xl text-gold-bright">
                    Stone #{i + 1}
                  </p>
                  <p className="font-serif-cinzel text-xs uppercase tracking-widest text-parchment/80">
                    Tap to translate
                  </p>
                </div>
              ) : (
                <div className="anim-reveal">
                  <p className="font-serif-cinzel text-xs uppercase tracking-widest" style={{color:"oklch(0.30 0.05 40)"}}>
                    Poneglyph {i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-2xl" style={{color:"oklch(0.38 0.18 25)"}}>
                    {m.title}
                  </h3>
                  <p className="mt-4 font-body text-base italic leading-relaxed sm:text-lg" style={{color:"oklch(0.24 0.05 40)"}}>
                    {m.text}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onAdvance}
          disabled={!allOpen}
          className={`rounded-md border-2 px-8 py-4 font-display text-xl uppercase tracking-widest transition-all ${
            allOpen
              ? "border-gold bg-gold text-background hover:scale-105 shine-sweep"
              : "border-muted bg-background/40 text-muted-foreground/60 cursor-not-allowed"
          }`}
        >
          {allOpen ? "Sail to the Party →" : `Reveal all stones (${opened.length}/${MEMORIES.length})`}
        </button>
      </div>
    </div>
  );
}

/* -------------------- Chapter 5: Party -------------------- */
function ChapterParty({ onAdvance }: { onAdvance: () => void }) {
  return (
    <div className="anim-reveal w-full text-center">
      <p className="font-serif-cinzel text-sm uppercase tracking-[0.4em] text-gold">
        Chapter VI · Water 7
      </p>
      <h2 className="mt-2 font-display text-5xl text-gold-bright anim-flicker md:text-8xl">
        SUUUUPER!
      </h2>
      <p className="mx-auto mt-4 max-w-2xl rounded-lg bg-background/80 px-4 py-3 font-body text-base italic text-parchment md:text-xl">
        The whole crew is dancing. Franky broke out the cola. Chopper's on the
        cake. Nami's over-charging everyone for the fireworks. And it's all for
        <span className="text-gold-bright font-display"> you</span>.
      </p>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-xl border-4 border-gold shadow-[0_0_60px_var(--gold-bright)]">
        <img src={frankyAsset.url} alt="Franky celebrating" className="w-full" />
      </div>

      <button
        onClick={onAdvance}
        className="mt-10 rounded-md border-2 border-gold bg-gradient-to-b from-blood to-blood/70 px-10 py-5 font-display text-2xl uppercase tracking-widest text-parchment shadow-parchment transition-all hover:scale-105 shine-sweep"
      >
        🎂 Open Your Wish
      </button>
    </div>
  );
}

/* -------------------- Chapter 5: Mini-Game -------------------- */
function ChapterGame({ onAdvance }: { onAdvance: () => void }) {
  const GOAL = 10;
  const DURATION = 20;
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number; idx: number } | null>(null);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      setDone(true);
      setTarget(null);
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, time]);

  useEffect(() => {
    if (!running) return;
    const spawn = () => {
      setTarget({
        x: 8 + Math.random() * 80,
        y: 10 + Math.random() * 75,
        idx: Math.floor(Math.random() * CREW.length),
      });
    };
    spawn();
    const iv = setInterval(spawn, 900);
    return () => clearInterval(iv);
  }, [running]);

  const start = () => {
    setScore(0);
    setTime(DURATION);
    setDone(false);
    setRunning(true);
  };

  const hit = (idx: number) => {
    setScore((s) => s + (CREW[idx].name === "Luffy" ? 2 : 1));
    setTarget(null);
  };

  const won = score >= GOAL;

  return (
    <div className="anim-reveal w-full text-center">
      <p className="font-serif-cinzel text-sm uppercase tracking-[0.4em] text-gold">
        Chapter V · Enies Lobby
      </p>
      <h2 className="mt-2 font-display text-4xl text-parchment md:text-6xl">
        Catch the <span className="text-gold-bright">Crew!</span>
      </h2>
      <p className="mx-auto mt-3 max-w-2xl rounded-lg bg-background/80 px-4 py-2 font-body text-sm italic text-parchment sm:text-base">
        Tap any Straw Hat face for 1 point — catch Captain Luffy for 2. Score{" "}
        <span className="text-gold-bright">{GOAL}</span> in {DURATION}s to sail on!
      </p>

      <div className="mx-auto mt-6 flex max-w-xl items-center justify-between gap-2 rounded-md border-2 border-gold/60 bg-background/90 px-4 py-3 font-serif-cinzel text-xs uppercase tracking-widest text-parchment sm:px-6 sm:text-sm">
        <span>⏳ Time: <span className="text-gold-bright">{time}s</span></span>
        <span>💥 Score: <span className="text-gold-bright">{score}</span> / {GOAL}</span>
      </div>

      <div className="relative mx-auto mt-6 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl border-4 border-gold/60 bg-gradient-to-b from-ocean/60 to-background/80 shadow-parchment">
        {!running && !done && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-6xl anim-sway">⚔️</p>
            <button
              onClick={start}
              className="rounded-md border-2 border-gold bg-gradient-to-b from-blood to-blood/70 px-8 py-4 font-display text-xl uppercase tracking-widest text-parchment shine-sweep hover:scale-105 transition-all"
            >
              Battle Stations!
            </button>
          </div>
        )}
        {running && target && (
          <button
            onClick={() => hit(target.idx)}
            className="absolute transition-transform hover:scale-125"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            aria-label={CREW[target.idx].name}
          >
            <img
              src={CREW[target.idx].gif}
              alt={CREW[target.idx].name}
              className="h-16 w-16 rounded-full border-4 object-cover shadow-parchment md:h-20 md:w-20"
              style={{ borderColor: CREW[target.idx].color }}
            />
          </button>
        )}
        {done && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/70 p-6">
            <p className="font-display text-4xl text-gold-bright">
              {won ? "Victory! 🎉" : "So close! Try again!"}
            </p>
            <p className="font-body italic text-parchment/90">
              Final Score: <span className="text-gold-bright font-display">{score}</span>
            </p>
            <button
              onClick={start}
              className="rounded-md border-2 border-gold bg-background/50 px-6 py-3 font-serif-cinzel text-sm uppercase tracking-widest text-gold-bright hover:bg-gold hover:text-background transition-all"
            >
              Rematch
            </button>
          </div>
        )}
      </div>

      <div className="mt-10">
        <button
          onClick={onAdvance}
          disabled={!won}
          className={`rounded-md border-2 px-8 py-4 font-display text-xl uppercase tracking-widest transition-all ${
            won
              ? "border-gold bg-gold text-background hover:scale-105 shine-sweep"
              : "border-muted bg-background/40 text-muted-foreground/60 cursor-not-allowed"
          }`}
        >
          {won ? "On to the Party →" : `Defeat ${GOAL} to advance`}
        </button>
      </div>
    </div>
  );
}

/* -------------------- Finale overlay -------------------- */
function FinaleOverlay({ onClose }: { onClose: () => void }) {
  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
      hue: [30, 45, 0, 200, 340][i % 5],
    }))
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-md anim-reveal">
      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="absolute -top-6 h-3 w-2 rounded-sm"
            style={{
              left: `${p.left}%`,
              background: `oklch(0.75 0.2 ${p.hue})`,
              animation: `float-wave ${p.duration}s linear ${p.delay}s infinite`,
              transform: `translateY(110vh)`,
            }}
          />
        ))}
      </div>

      <div
        className="relative mx-3 my-6 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg p-5 shadow-parchment sm:mx-4 sm:p-10"
        style={{ background: "oklch(0.93 0.05 78)" }}
      >
        <p className="text-center font-serif-cinzel text-xs uppercase tracking-[0.4em]" style={{color:"var(--blood)"}}>
          A letter from the Straw Hat Captain
        </p>
        <h2 className="mt-3 text-center font-display text-3xl sm:text-5xl md:text-6xl" style={{color:"oklch(0.40 0.19 25)"}}>
          Happy Birthday, Rupa!
        </h2>
        <div className="mx-auto my-6 h-px w-40 bg-ink/40" />
        <div className="space-y-4 font-body text-[15px] leading-relaxed sm:text-base md:text-lg" style={{color:"oklch(0.24 0.05 40)"}}>
          <p>
            <strong>Oi, Rupaaa! 👒🍖</strong> Luffy here!! I was about to destroy the
            biggest mountain of meat 🤤🍗 when Rahul came running like his pants were on
            fire yelling, <strong>"IT'S RUPA'S BIRTHDAY!!"</strong> 🎉 So I swallowed my
            food in one bite (don't ask 😆) and rushed over to wish you!
          </p>
          <p>
            <strong>Happy Birthday, Miss 👧 Rupa! 🎂✨</strong> Today you're officially
            allowed to eat extra cake, laugh as loud as you want, and blame everything
            on <em>"it's my birthday!"</em> 🤭🍰
          </p>
          <p>
            Rahul talks about you so much I thought you were joining the Straw Hats!
            😂⚓ He says you're kind, cheerful, and your smile can brighten anyone's
            day... maybe not enough to stop Zoro from getting lost though. 🤣🗺️
          </p>
          <p>
            Keep chasing your dreams, eat your favorite food 🍕🍗, laugh a lot, make
            amazing memories, and if anyone steals your birthday cake... call me! 😎🍰
            (Though I might eat it first. 🤭🍖)
          </p>
          <p className="text-center font-display text-xl sm:text-2xl" style={{ color: "oklch(0.40 0.19 25)" }}>
            SHISHISHISHI!! 👒🎉<br />
            Happy Birthday, <strong>Miss 👧 Rupa!</strong> <br />
            Wishing you endless adventures, laughter, yummy food, and dreams that come true! ⚓🌈✨
          </p>
        </div>
        <p className="mt-6 text-right font-display text-xl sm:text-2xl" style={{color:"oklch(0.40 0.19 25)"}}>
          — Luffy & the Straw Hat Crew
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-md border-2 border-ink bg-transparent px-6 py-3 font-serif-cinzel text-sm uppercase tracking-widest transition-all hover:bg-ink hover:text-parchment"
            style={{color:"var(--ink)"}}
          >
            Sail Again
          </button>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.location.reload(); }}
            className="rounded-md border-2 bg-gradient-to-b from-blood to-blood/80 px-6 py-3 font-serif-cinzel text-sm uppercase tracking-widest text-parchment transition-all hover:scale-105 shine-sweep"
            style={{borderColor:"var(--blood)"}}
          >
            Restart Voyage
          </a>
        </div>
      </div>
    </div>
  );
}
