import Link from "next/link";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "#quiz", label: "Quiz" },
  { href: "#results", label: "Results" },
  { href: "#feedback", label: "Feedback" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border,#e4e4ef)] bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Unofficial Life in the UK
        </Link>
        <nav className="hidden gap-6 text-sm font-medium sm:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={item.href} className="text-muted-foreground hover:text-brand-primary">
              {item.label}
            </a>
          ))}
        </nav>
        <Button asChild variant="secondary" size="sm">
          <Link href="#quiz">Start Quiz</Link>
        </Button>
      </div>
    </header>
  );
}
