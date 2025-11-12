import Link from "next/link";
import { KoFiLink } from "@/components/cta/KoFiLink";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-surface text-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          A tongue-in-cheek quiz built with love. Have ideas?
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/feedback" className="underline-offset-4 hover:underline">
            Suggest questions / leave feedback
          </Link>
          <KoFiLink variant="link" />
        </div>
      </div>
    </footer>
  );
}
