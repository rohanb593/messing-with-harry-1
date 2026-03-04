"use client";

import { useEffect, useState } from "react";

/** Demo mode: add ?demo=ended to the URL to see the "timer finished" screen */
function useDemoEnded(): boolean {
  const [demoEnded, setDemoEnded] = useState(false);
  useEffect(() => {
    setDemoEnded(
      typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("demo") === "ended"
    );
  }, []);
  return demoEnded;
}

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
};

function getTimeLeftToTodayAt2PM(): TimeLeft {
  const now = new Date();

  const target = new Date();
  target.setHours(14, 0, 0, 0); // 2:00 PM today, local time

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, isOver: false };
}

function TimeBlock({
  label,
  value,
  scary,
}: {
  label: string;
  value: number;
  scary?: boolean;
}) {
  const padded = value.toString().padStart(2, "0");
  return (
    <div className="text-center">
      <div
        className={`min-w-[4rem] px-3 py-4 text-3xl font-extrabold font-mono tabular-nums sm:min-w-[5rem] sm:px-4 sm:py-5 sm:text-4xl md:min-w-[6rem] md:px-6 md:py-6 md:text-5xl ${
          scary
            ? "rounded border border-red-600/50 bg-red-950/40 text-red-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.3),0_0_20px_rgba(180,50,50,0.25)] animate-countdown-pulse"
            : "rounded-2xl border border-red-600/60 bg-black/80 text-red-500 shadow-[0_0_40px_rgba(220,38,38,0.9)]"
        }`}
      >
        {padded}
      </div>
      <div
        className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] sm:mt-3 sm:text-xs sm:tracking-[0.35em] ${
          scary ? "text-red-300/80 font-mono" : "text-red-200/80"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const demoEnded = useDemoEnded();

  useEffect(() => {
    if (demoEnded) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isOver: true });
      return;
    }
    setTimeLeft(getTimeLeftToTodayAt2PM());

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        const next = getTimeLeftToTodayAt2PM();
        if (next.isOver && (!prev || !prev.isOver)) {
          clearInterval(intervalId);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [demoEnded]);

  if (!timeLeft) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 font-sans text-2xl text-white">
        Loading...
      </main>
    );
  }

  const { hours, minutes, seconds, isOver } = timeLeft;
  const showEnded = isOver || demoEnded;

  return (
    <main
      className={`relative flex min-h-[100dvh] min-h-screen flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 font-sans sm:py-8 ${
        showEnded
          ? "bg-black text-red-100"
          : "bg-[#1c0f0f] text-red-100"
      }`}
    >
      {/* Background: warm when ended, cold/ominous when counting down */}
      {showEnded ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(239,68,68,0.3),_transparent_55%)]" />
          <div className="absolute inset-0 opacity-25 mix-blend-soft-light">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(15,23,42,0.9)_0,rgba(15,23,42,0.9)_1px,transparent_1px,transparent_3px)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.15),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(127,29,29,0.35),transparent_55%)]" />
          </div>
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(180,50,50,0.2),transparent_50%),radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(0,0,0,0.5),transparent)]" />
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)]" />
          </div>
        </>
      )}

      <section className="relative z-10 flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 text-center sm:gap-10">
        <div className="space-y-2 sm:space-y-4">
          <p
            className={`text-[10px] font-mono uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.3em] ${
              showEnded ? "text-red-300/70" : "text-red-300/80"
            }`}
          >
            Palantir interview
          </p>
          <h1
            className={`text-2xl font-black uppercase tracking-[0.15em] sm:text-4xl sm:tracking-[0.25em] md:text-5xl lg:text-6xl ${
              showEnded
                ? "text-red-500 drop-shadow-[0_0_30px_rgba(248,113,113,0.9)]"
                : "text-red-400 font-mono tracking-[0.2em] drop-shadow-[0_0_20px_rgba(180,50,50,0.4)] sm:tracking-[0.4em]"
            }`}
          >
            {showEnded ? "Countdown to 2:00 PM" : "Time remaining"}
          </h1>
          {!showEnded && (
            <p className="mx-auto max-w-xl font-mono text-xs tracking-widest text-red-300/80 sm:text-sm">
              2:00 PM approaches
            </p>
          )}
          {showEnded && (
            <p className="mx-auto max-w-xl px-1 text-sm text-red-100/70 sm:px-0">
              You&apos;ve got this.{" "}
              <span className="font-semibold text-red-400">Good luck!</span>
            </p>
          )}
        </div>

        {showEnded ? (
          <div className="mt-4 flex flex-col items-center gap-4 sm:mt-6 sm:gap-8">
            {demoEnded && (
              <p className="text-[10px] font-mono uppercase tracking-widest text-red-400/70 sm:text-xs">
                Demo — timer ended
              </p>
            )}
            <p className="text-[clamp(2rem,12vw,5rem)] font-black leading-tight tracking-tight text-red-500 drop-shadow-[0_0_40px_rgba(248,113,113,0.8)]">
              Good luck!
            </p>
            <p className="max-w-md px-2 text-base font-medium leading-snug text-red-100/90 sm:px-0 sm:text-lg md:text-xl">
              Time for your Palantir interview. Take a breath, trust your prep, and go show them what you&apos;ve got. You&apos;re going to do great.
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-300/90 sm:text-sm sm:tracking-[0.2em]">
              You&apos;ve got this 💪
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex items-end gap-1.5 text-3xl font-extrabold tracking-[0.15em] sm:gap-4 sm:text-5xl sm:tracking-[0.35em] md:text-6xl lg:text-7xl">
                <TimeBlock label="Hours" value={hours} scary />
                <span className="pb-8 font-mono text-3xl text-red-400/70 sm:pb-10 sm:text-5xl md:text-6xl lg:text-7xl">
                  :
                </span>
                <TimeBlock label="Minutes" value={minutes} scary />
                <span className="pb-8 font-mono text-3xl text-red-400/70 sm:pb-10 sm:text-5xl md:text-6xl lg:text-7xl">
                  :
                </span>
                <TimeBlock label="Seconds" value={seconds} scary />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-300/80 sm:text-xs sm:tracking-[0.4em]">
                2:00 PM • Local time
              </p>
            </div>

            <p className="mt-3 font-mono text-xs tracking-wider text-red-300/80 sm:mt-4 sm:text-sm">
              Prepare yourself.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
