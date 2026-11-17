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

    function playClickSound(event: MouseEvent) {
      if (!event.isTrusted || !(event.target instanceof Element)) return;

      const sound = soundFor(event.target.closest(soundControl));
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
      document.removeEventListener("click", playClickSound);
      playing?.pause();
    };
  }, []);

  return null;
}
