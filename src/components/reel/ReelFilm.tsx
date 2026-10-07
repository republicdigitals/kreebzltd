"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";

/**
 * The Quiet Standard — ~34s product film.
 * A single 1920×1080 stage, scaled to the window. Every scene is a
 * full-frame layer driven by one GSAP master timeline.
 *
 * ?t=<seconds>  — seek + hold a frame (for stills/review)
 * (default)     — plays through once, then holds the end card
 */

const W = 1920;
const H = 1080;

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[15px] font-sans font-medium tracking-[0.42em] uppercase text-[#c8a15e]">
      {children}
    </p>
  );
}

function Display({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-serif italic text-[#f4efe6] leading-[1.08]"
      style={{ fontSize: 76, fontVariationSettings: "'opsz' 144" }}
    >
      {children}
    </p>
  );
}

function Meta({ children }: { children: string }) {
  return (
    <p className="text-[13px] font-sans tracking-[0.3em] uppercase text-[#8a8578]">{children}</p>
  );
}

export default function ReelFilm() {
  const stageRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

      // Start every video muted/paused; each scene plays its own.
      q("video").forEach((v) => {
        const el = v as HTMLVideoElement;
        el.muted = true;
        el.playsInline = true;
      });
      const play = (sel: string) => () => {
        const v = q(sel)[0] as HTMLVideoElement | undefined;
        v?.play().catch(() => {});
      };
      const stop = (sel: string) => () => {
        const v = q(sel)[0] as HTMLVideoElement | undefined;
        v?.pause();
      };

      // Deterministic scene clock — every beat is positioned at an
      // absolute time so durations can't drift.
      const FADE = 0.55;
      let T = 0;
      const open = (name: string, hold: number) => {
        tl.call(stop(".reel-video"), undefined, T);
        tl.fromTo(
          q(`[data-scene="${name}"]`),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: FADE, ease: "power1.inOut" },
          T
        );
        const start = T;
        T += hold;
        return start;
      };
      const close = (name: string) =>
        tl.to(q(`[data-scene="${name}"]`), { autoAlpha: 0, duration: FADE, ease: "power1.inOut" }, T - FADE);

      // ── S1 · cold open — Lagos pull-back · 0→4.6 ────────────────────
      let s = open("s1", 4.6);
      tl.call(play(".v-lagoon"), undefined, s);
      tl.fromTo(q(".v-lagoon"), { scale: 1.08 }, { scale: 1, duration: 4.6, ease: "none" }, s);
      tl.fromTo(q(".s1-copy"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.1 }, s + 0.9);
      tl.to(q(".s1-copy"), { autoAlpha: 0, y: -16, duration: 0.6 }, s + 3.6);
      close("s1");

      // ── S2 · title card · 4.6→7.8 ───────────────────────────────────
      s = open("s2", 3.2);
      tl.fromTo(q(".s2-copy > *"), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.22 }, s + 0.35);
      tl.to(q(".s2-copy"), { autoAlpha: 0, y: -20, duration: 0.55 }, s + 2.5);
      close("s2");

      // ── S3 · discovery — properties UI push-in · 7.8→12.6 ───────────
      s = open("s3", 4.8);
      tl.fromTo(
        q(".f-properties"),
        { scale: 1, transformOrigin: "38% 52%" },
        { scale: 1.9, duration: 4.8, ease: "power1.inOut" },
        s
      );
      tl.fromTo(q(".s3-copy"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, s + 1.2);
      tl.to(q(".s3-copy"), { autoAlpha: 0, duration: 0.5 }, s + 4.1);
      close("s3");

      // ── S4 · the property — detail drift · 12.6→17.2 ────────────────
      s = open("s4", 4.6);
      tl.fromTo(
        q(".f-property"),
        { scale: 1.35, yPercent: -6, transformOrigin: "50% 38%" },
        { scale: 1.05, yPercent: 0, duration: 4.6, ease: "power1.inOut" },
        s
      );
      tl.fromTo(q(".s4-copy"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, s + 1.1);
      tl.to(q(".s4-copy"), { autoAlpha: 0, duration: 0.5 }, s + 3.9);
      close("s4");

      // ── S5 · Bourdillon — concept aerial · 17.2→22.2 ────────────────
      s = open("s5", 5.0);
      tl.call(play(".v-bourdillon"), undefined, s);
      tl.fromTo(q(".v-bourdillon"), { scale: 1.12 }, { scale: 1.02, duration: 5, ease: "none" }, s);
      tl.fromTo(q(".s5-copy > *"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.18 }, s + 0.9);
      tl.to(q(".s5-copy"), { autoAlpha: 0, duration: 0.5 }, s + 4.2);
      close("s5");

      // ── S6 · concierge — request flow · 22.2→27.8 ───────────────────
      s = open("s6", 5.6);
      tl.call(play(".v-desk"), undefined, s);
      tl.fromTo(q(".v-desk"), { scale: 1.05 }, { scale: 1.16, duration: 5.6, ease: "none" }, s);
      tl.fromTo(q(".req-card"), { autoAlpha: 0, x: -220 }, { autoAlpha: 1, x: 0, duration: 0.8 }, s + 0.7);
      tl.to(q(".req-card"), { x: 330, duration: 1.1, ease: "power3.inOut" }, s + 2.2);
      tl.to(q(".req-principal"), { autoAlpha: 1, scale: 1, duration: 0.45 }, s + 3.1);
      tl.to(q(".req-check"), { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, s + 3.7);
      tl.to(q(".req-card"), { autoAlpha: 0.35, duration: 0.5 }, s + 3.7);
      close("s6");

      // ── S7 · management — Ikoyi interior glide · 27.8→32.4 ──────────
      s = open("s7", 4.6);
      tl.call(play(".v-interior"), undefined, s);
      tl.fromTo(q(".v-interior"), { scale: 1.14 }, { scale: 1.03, duration: 4.6, ease: "none" }, s);
      tl.fromTo(q(".s7-copy > *"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.2 }, s + 0.9);
      tl.to(q(".s7-copy"), { autoAlpha: 0, duration: 0.5 }, s + 3.9);
      close("s7");

      // ── S8 · private aviation — quick beat · 32.4→36 ────────────────
      s = open("s8", 3.6);
      tl.call(play(".v-jet"), undefined, s);
      tl.fromTo(q(".v-jet"), { scale: 1.1, xPercent: -1.5 }, { scale: 1.02, xPercent: 0, duration: 3.6, ease: "none" }, s);
      tl.fromTo(q(".s8-copy"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, s + 0.6);
      tl.to(q(".s8-copy"), { autoAlpha: 0, duration: 0.45 }, s + 2.9);
      close("s8");

      // ── S9 · end card · 36→hold ─────────────────────────────────────
      s = open("s9", 3.4);
      tl.fromTo(q(".s9-mark"), { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 1, ease: "power3.out" }, s + 0.4);
      tl.fromTo(q(".s9-copy > *"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.16 }, s + 0.9);
      // holds — no close()

      // ── transport ───────────────────────────────────────────────────
      const t = params.get("t");
      if (t !== null) {
        tl.seek(Math.max(0, Number(t) || 0));
        tl.pause();
      } else {
        tl.play(0);
      }

      // expose for Playwright recording
      (window as unknown as { __reel?: { tl: gsap.core.Timeline } }).__reel = { tl };
    }, stage);

    return () => ctx.revert();
  }, [params]);

  return (
    <div className="absolute inset-0 grid place-items-center bg-[#0c0b09]">
      <div
        ref={stageRef}
        className="relative overflow-hidden bg-[#0c0b09]"
        style={{ width: W, height: H, transform: "scale(var(--reel-scale, 1))", transformOrigin: "center" }}
      >
        {/* S1 — Lagos pull-back */}
        <div data-scene="s1" className="absolute inset-0 invisible">
          <video className="reel-video v-lagoon absolute inset-0 h-full w-full object-cover" src="/video/reel/01-lagos-pullback.mp4" muted playsInline preload="auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/85 via-transparent to-[#0c0b09]/40" />
          <div className="s1-copy absolute bottom-24 left-24 space-y-5">
            <Eyebrow>KREEBZ LTD — LAGOS, NIGERIA</Eyebrow>
            <Display>A private property practice.</Display>
          </div>
        </div>

        {/* S2 — title card */}
        <div data-scene="s2" className="absolute inset-0 invisible grid place-items-center">
          <div className="s2-copy text-center space-y-7">
            <Eyebrow>THE QUIET STANDARD</Eyebrow>
            <Display>Everything handled properly.</Display>
          </div>
        </div>

        {/* S3 — properties UI */}
        <div data-scene="s3" className="absolute inset-0 invisible">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="f-properties absolute inset-0 h-full w-full object-cover" src="/reel-frames/ui-properties-cards.png" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/80 via-transparent to-transparent" />
          <div className="s3-copy absolute bottom-24 left-24 space-y-5">
            <Eyebrow>THE PORTFOLIO</Eyebrow>
            <Display>Every listing, physically inspected.</Display>
          </div>
        </div>

        {/* S4 — property detail UI */}
        <div data-scene="s4" className="absolute inset-0 invisible">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="f-property absolute inset-0 h-full w-full object-cover" src="/reel-frames/ui-property.png" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/75 via-transparent to-transparent" />
          <div className="s4-copy absolute bottom-24 left-24 space-y-5">
            <Eyebrow>VETTED · PRIVATE · DISCREET</Eyebrow>
            <Display>Locations shown to verified clients only.</Display>
          </div>
        </div>

        {/* S5 — Bourdillon */}
        <div data-scene="s5" className="absolute inset-0 invisible">
          <video className="reel-video v-bourdillon absolute inset-0 h-full w-full object-cover" src="/videos/morphix/bourdillon-concept-wide.mp4" muted playsInline preload="auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/85 via-transparent to-[#0c0b09]/30" />
          <div className="s5-copy absolute bottom-24 left-24 space-y-5">
            <Eyebrow>BOURDILLON — IKOYI</Eyebrow>
            <Display>Vision, then structure, then keys.</Display>
            <Meta>CONCEPT FILM — PROPOSED DESIGN, SUBJECT TO APPROVAL</Meta>
          </div>
        </div>

        {/* S6 — concierge request flow */}
        <div data-scene="s6" className="absolute inset-0 invisible">
          <video className="reel-video v-desk absolute inset-0 h-full w-full object-cover" src="/video/reel/06-concierge-desk.mp4" muted playsInline preload="auto" />
          <div className="absolute inset-0 bg-[#0c0b09]/55" />
          <div className="s6-copy absolute inset-0">
            <div className="absolute top-24 left-24 space-y-5">
              <Eyebrow>CONCIERGE</Eyebrow>
              <Display>Ask once. It&rsquo;s done.</Display>
            </div>
            {/* request card travels to the principal node */}
            <div className="req-card invisible absolute left-24 top-[58%] w-[380px] border border-[#2a261e] bg-[#14120f]/90 px-7 py-6 space-y-2 backdrop-blur-sm">
              <Meta>REQUEST — 21:14</Meta>
              <p className="font-serif italic text-[#f4efe6] text-[26px] leading-snug">
                &ldquo;A table for eight, Friday. Somewhere quiet.&rdquo;
              </p>
            </div>
            <div className="req-principal invisible absolute left-[560px] top-[62%] scale-90 border border-[#c8a15e]/40 bg-[#0c0b09]/80 px-6 py-4 backdrop-blur-sm">
              <Meta>YOUR PRINCIPAL</Meta>
            </div>
            <div className="req-check invisible absolute left-[560px] top-[76%] scale-75 border border-[#c8a15e] bg-[#c8a15e]/10 px-6 py-4">
              <p className="font-sans text-[15px] tracking-[0.3em] uppercase text-[#e6cf9f]">CONFIRMED</p>
            </div>
          </div>
        </div>

        {/* S7 — management */}
        <div data-scene="s7" className="absolute inset-0 invisible">
          <video className="reel-video v-interior absolute inset-0 h-full w-full object-cover" src="/video/reel/05-interior-ikoyi.mp4" muted playsInline preload="auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/85 via-transparent to-[#0c0b09]/30" />
          <div className="s7-copy absolute bottom-24 left-24 space-y-5">
            <Eyebrow>PROPERTY MANAGEMENT</Eyebrow>
            <Display>Own property in Lagos. Live anywhere.</Display>
            <Meta>ONE NAMED NUMBER · MONTHLY STATEMENTS · PHOTO REPORTS</Meta>
          </div>
        </div>

        {/* S8 — private aviation */}
        <div data-scene="s8" className="absolute inset-0 invisible">
          <video className="reel-video v-jet absolute inset-0 h-full w-full object-cover" src="/video/reel/04-jet-tarmac.mp4" muted playsInline preload="auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/80 via-transparent to-transparent" />
          <div className="s8-copy absolute bottom-24 left-24 space-y-5">
            <Eyebrow>PRIVATE AVIATION</Eyebrow>
            <Display>Wheels up.</Display>
          </div>
        </div>

        {/* S9 — end card */}
        <div data-scene="s9" className="absolute inset-0 invisible grid place-items-center">
          <div className="text-center space-y-9">
            <div className="s9-mark invisible mx-auto grid h-24 w-24 place-items-center border border-[#c8a15e]/50">
              <span className="font-serif italic text-[40px] text-[#c8a15e]">K</span>
            </div>
            <div className="s9-copy space-y-5">
              <p className="font-sans text-[17px] tracking-[0.5em] uppercase text-[#f4efe6]">KREEBZ LTD</p>
              <Meta>PROPERTY · MANAGEMENT · PRIVATE AVIATION</Meta>
              <p className="font-serif italic text-[30px] text-[#c8a15e]">+234 806 994 9948</p>
            </div>
          </div>
        </div>

        {/* persistent frame furniture */}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.55)]" />
      </div>

      {/* scale stage to window */}
      <style jsx global>{`
        :root {
          --reel-scale: min(calc(100vw / ${W}), calc(100vh / ${H}));
        }
      `}</style>
    </div>
  );
}
