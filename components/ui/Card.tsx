import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[var(--color-border, #e5e7eb)] bg-white p-6 shadow-card",
        className,
      )}
      {...props}
    />
  );
}
