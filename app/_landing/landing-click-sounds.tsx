"use client";

import { useEffect } from "react";

const sounds = {
  project: "/audio/landing/wind-click.wav",
  "back-to-top": "/audio/landing/wind-click-long.wav",
};

const soundControl = "[data-click-sound]";

function soundFor(control: Element | null) {
  const sound = control?.getAttribute("data-click-sound");
  if (sound === "project" || sound === "back-to-top") return sound;
}

function isLongScroll(target: Element) {
  const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (
    !link ||
    (link.target && link.target !== "_self") ||
    link.hasAttribute("download")
  ) {
    return false;
  }

  const destination = document.getElementById(link.hash.slice(1));
  const scroller = document.scrollingElement;
  if (!destination || !scroller) return false;

  const { scrollTop, scrollHeight, clientHeight } = scroller;
  const margin =
    Number.parseFloat(getComputedStyle(destination).scrollMarginBlockStart) ||
    0;
  const top = scrollTop + destination.getBoundingClientRect().top - margin;
  const nextTop = Math.max(0, Math.min(top, scrollHeight - clientHeight));
  return Math.abs(nextTop - scrollTop) >= clientHeight;
}

export function LandingClickSounds() {
  useEffect(() => {
    const clips = new Map<keyof typeof sounds, HTMLAudioElement>();
    let playing: HTMLAudioElement | undefined;

    function getClip(sound: keyof typeof sounds) {
      let clip = clips.get(sound);
      if (!clip) {
        clip = new Audio(sounds[sound]);
        clips.set(sound, clip);
      }
      return clip;
    }

    const preload = new IntersectionObserver(
      (entries, observer) => {
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;

          const sound = soundFor(target);
          if (sound) getClip(sound);
          observer.unobserve(target);
        }
      },
      { rootMargin: "480px 0px" },
    );
    document
      .querySelectorAll(soundControl)
      .forEach((control) => preload.observe(control));

    function prepareScrollSound() {
      getClip("back-to-top");
    }

    // Section links in the header can use the same clip before the footer is visible.
    if (document.readyState === "complete") prepareScrollSound();
    else window.addEventListener("load", prepareScrollSound, { once: true });

    function playClickSound(event: MouseEvent) {
      if (
        !event.isTrusted ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const control = soundFor(event.target.closest(soundControl));
      const sound =
        control === "project"
          ? control
          : isLongScroll(event.target)
            ? "back-to-top"
            : undefined;
      if (!sound) return;

      const clip = getClip(sound);
      if (playing) {
        playing.pause();
        playing.currentTime = 0;
      }
      playing = clip;
      void clip.play().catch(() => {});
    }

    document.addEventListener("click", playClickSound);
    return () => {
      preload.disconnect();
      window.removeEventListener("load", prepareScrollSound);
      document.removeEventListener("click", playClickSound);
      playing?.pause();
    };
  }, []);

  return null;
}
