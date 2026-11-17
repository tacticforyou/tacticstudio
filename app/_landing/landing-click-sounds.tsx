"use client";

import { useEffect } from "react";

const sounds = {
  project: "/audio/landing/wind-click.wav",
  "back-to-top": "/audio/landing/wind-click-long.wav",
};

export function LandingClickSounds() {
  useEffect(() => {
    const clips = new Map<keyof typeof sounds, HTMLAudioElement>();
    let playing: HTMLAudioElement | undefined;

    function playClickSound(event: MouseEvent) {
      if (!event.isTrusted || !(event.target instanceof Element)) return;

      const sound =
        event.target.closest<HTMLElement>("[data-click-sound]")?.dataset
          .clickSound;
      if (sound !== "project" && sound !== "back-to-top") return;

      let clip = clips.get(sound);
      if (!clip) {
        clip = new Audio(sounds[sound]);
        clips.set(sound, clip);
      }

      if (playing) {
        playing.pause();
        playing.currentTime = 0;
      }
      playing = clip;
      void clip.play().catch(() => {});
    }

    document.addEventListener("click", playClickSound);
    return () => {
      document.removeEventListener("click", playClickSound);
      playing?.pause();
    };
  }, []);

  return null;
}
