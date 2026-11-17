import type { ReactNode } from "react";
import { AnimatedActionLink } from "./animated-action-link";
import { Art } from "./art";

const buttonTones = {
  outline:
    "studio-button-outline min-w-[calc(168*var(--u))] text-studio-ink font-bold",
  sage: "studio-button-sage min-w-[calc(193*var(--u))] bg-studio-sage text-white font-semibold",
  rose: "studio-button-rose min-w-[calc(193*var(--u))] bg-studio-rose text-white font-semibold",
};

function StudioButton({
  tone,
  href,
  children,
}: {
  tone: "outline" | "sage" | "rose";
  href: string;
  children: ReactNode;
}) {
  return (
    <AnimatedActionLink
      className={
        "studio-button relative inline-flex min-h-[calc(48*var(--u))] items-center justify-center rounded-[999px] border px-4 py-1 text-center text-[max(0.75rem,calc(16*var(--u)))] leading-[1.1511] whitespace-nowrap studio-mobile:min-h-11 " +
        buttonTones[tone]
      }
      href={href}
    >
      <span className="relative z-1">{children}</span>
      <Art
        name={"button-wave-" + tone + ".svg"}
        className="studio-button-glint"
      />
    </AnimatedActionLink>
  );
}

export function ConsultationLink({ header = false }: { header?: boolean }) {
  return (
    <StudioButton tone={header ? "outline" : "sage"} href="#contact">
      درخواست مشاوره
    </StudioButton>
  );
}

export function Actions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[calc(16*var(--u))]">
      <ConsultationLink />
      <StudioButton tone="rose" href="#work">
        نمونه کار ها
      </StudioButton>
    </div>
  );
}
