import type { ReactNode } from "react";

type Severity = "info" | "success" | "error";

interface AlertProps {
  severity?: Severity;
  children: ReactNode;
  className?: string;
}

const severityClasses: Record<Severity, string> = {
  info: "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-foreground)]",
  success:
    "border-[var(--color-success)] bg-[var(--color-success)] text-white",
  error: "border-[var(--color-error)] bg-[var(--color-error)] text-white",
};

export function Alert({ severity = "info", children, className = "" }: AlertProps) {
  const role = severity === "info" ? "status" : "alert";
  const ariaLive = severity === "info" ? "polite" : "assertive";
  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`border-l-4 px-4 py-3 text-sm ${severityClasses[severity]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
