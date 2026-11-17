export function animatePress(element: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return null;

  const id = "studio-press";
  element
    .getAnimations()
    .find((animation) => animation.id === id)
    ?.cancel();

  return element.animate(
    [
      { scale: "1" },
      { scale: "0.91", offset: 0.25 },
      { scale: "1.045", offset: 0.65 },
      { scale: "1" },
    ],
    { id, duration: 320, easing: "ease-in-out" },
  );
}
