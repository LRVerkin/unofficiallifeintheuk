import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "success" | "warning" | "danger";

const variantClasses: Record<AlertVariant, string> = {
  default: "bg-surface-muted text-[var(--color-foreground)] border-[var(--color-border,#e5e7eb)]",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  danger: "bg-rose-50 text-rose-900 border-rose-200",
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-2xl border px-4 py-3 text-sm", variantClasses[variant], className)}
      {...props}
    />
  );
}
