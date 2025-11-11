import Link from "next/link";

const NAV_LINKS = [
  { href: "#quiz", label: "Take the Test" },
  { href: "#results", label: "Results" },
  { href: "#feedback", label: "Feedback" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-surface sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-surface-dark/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Unofficial Life in the UK
        </Link>
        <nav className="hidden gap-6 text-sm font-medium sm:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-brand-primary">
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href="#quiz"
          className="rounded-full border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white"
        >
          Start Quiz
        </Link>
      </div>
    </header>
  );
}
