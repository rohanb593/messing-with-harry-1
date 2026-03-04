"use client";

import { useEffect, useState } from "react";

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

function TimeBlock({ label, value }: { label: string; value: number }) {
  const padded = value.toString().padStart(2, "0");
  return (
    <div className="text-center">
      <div className="min-w-[6rem] rounded-2xl border border-red-600/60 bg-black/80 px-6 py-6 text-5xl font-extrabold text-red-500 shadow-[0_0_40px_rgba(220,38,38,0.9)]">
        {padded}
      </div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.35em] text-red-200/80">
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
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
  }, []);

  if (!timeLeft) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 font-sans text-2xl text-white">
        Loading...
      </main>
    );
  }

  const { hours, minutes, seconds, isOver } = timeLeft;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-red-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(239,68,68,0.3),_transparent_55%)]" />
      <div className="absolute inset-0 opacity-25 mix-blend-soft-light">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(15,23,42,0.9)_0,rgba(15,23,42,0.9)_1px,transparent_1px,transparent_3px)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.15),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(127,29,29,0.35),transparent_55%)]" />
      </div>

      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 text-center font-sans">
        <div className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-red-300/70">
            Palantir interview
          </p>
          <h1 className="text-4xl font-black uppercase tracking-[0.25em] text-red-500 drop-shadow-[0_0_30px_rgba(248,113,113,0.9)] sm:text-5xl md:text-6xl">
            Countdown to 2:00 PM
          </h1>
          <p className="mx-auto max-w-xl text-sm text-red-100/70">
            You&apos;ve got this.{" "}
            <span className="font-semibold text-red-400">Good luck!</span>
          </p>
        </div>

        {isOver ? (
          <div className="mt-6 flex flex-col items-center gap-8">
            <p className="text-[10vw] font-black leading-tight tracking-tight text-red-500 drop-shadow-[0_0_40px_rgba(248,113,113,0.8)] sm:text-[7vw] md:text-[5vw]">
              Good luck!
            </p>
            <p className="max-w-md text-lg font-medium text-red-100/90 sm:text-xl">
              Time for your Palantir interview. Take a breath, trust your prep, and go show them what you&apos;ve got. You&apos;re going to do great.
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300/90">
              You&apos;ve got this 💪
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-end gap-4 text-5xl font-extrabold tracking-[0.35em] sm:text-6xl md:text-7xl">
                <TimeBlock label="Hours" value={hours} />
                <span className="pb-10 text-5xl text-red-500/70 sm:text-6xl md:text-7xl">
                  :
                </span>
                <TimeBlock label="Minutes" value={minutes} />
                <span className="pb-10 text-5xl text-red-500/70 sm:text-6xl md:text-7xl">
                  :
                </span>
                <TimeBlock label="Seconds" value={seconds} />
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-red-200/70">
                2:00 PM Today • Local Time
              </p>
            </div>

            <p className="mt-4 text-sm text-red-200/70">
              Relax, stay calm, and trust your preparation.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
