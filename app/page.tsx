import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <Card className="py-10">
        <article className="prose max-w-none text-lg text-[var(--color-foreground)]">
          <h1 className="font-display text-4xl leading-snug sm:text-5xl">Could you become a UK citizen?</h1>
          <p>
            Take the <strong>ACTUAL Life in the UK</strong> test and find out!
          </p>
          <blockquote className="text-base text-muted-foreground">
            <em>Life in the UK</em> is an official test you must pass to gain British citizenship. It&apos;s famous
            for having nothing to do with real life in the UK — most of your British friends couldn’t pass it without
            studying.
          </blockquote>
          <p>
            Our <strong>ACTUAL Life in the UK</strong> test has no 1988 Olympics, no Tower of London construction: only
            REAL classics from the REAL United Kingdom!
          </p>
        </article>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button className="flag-button" asChild>
            <Link href="/quiz">Take the Test</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
