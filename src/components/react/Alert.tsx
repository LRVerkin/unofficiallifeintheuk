import type { ReactNode } from "react";

type Severity = "info" | "success" | "error";

interface AlertProps {
  severity?: Severity;
  children: ReactNode;
  className?: string;
}

const severityClasses: Record<Severity, string> = {
  info: "border-[var(--color-border)] bg-surface-muted text-[var(--color-foreground)]",
  success: "border-brand-secondary/40 bg-brand-secondary/5 text-brand-secondary",
  error: "border-brand-primary/40 bg-brand-primary/5 text-brand-primary",
};

export function Alert({ severity = "info", children, className = "" }: AlertProps) {
  const role = severity === "info" ? "status" : "alert";
  const ariaLive = severity === "info" ? "polite" : "assertive";
  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`rounded-2xl border px-4 py-3 text-sm ${severityClasses[severity]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
