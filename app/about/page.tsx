import Link from "next/link";
import { Card } from "@/components/ui/Card";

const SOCIALS = [
  { label: "Louise on Twitter", href: "#" },
  { label: "Quentin on Twitter", href: "#" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-0">
      <Card className="space-y-4">
        <h1 className="font-display text-3xl">About the makers</h1>
        <p className="text-base text-muted-foreground">
          Unofficial Life in the UK is a side project by Louise &amp; Quentin. We wanted a quiz that captured the
          delightful clichés, pedantry, and chaos of day-to-day British life.
        </p>
        <p className="text-base text-muted-foreground">
          We&apos;re tinkering in our spare time—if you have ideas, feedback, or new questions, we&apos;d love to hear
          from you.
        </p>
        <div className="space-y-2">
          <h2 className="font-semibold">Say hello</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {SOCIALS.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold">Suggest questions or leave feedback</h2>
          <Link href="/feedback" className="text-brand-primary underline-offset-4 hover:underline">
            Head to the feedback form →
          </Link>
        </div>
      </Card>
    </div>
  );
}
