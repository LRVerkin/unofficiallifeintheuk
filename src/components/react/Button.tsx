import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-brand-primary)] text-white shadow-[0_2px_0_var(--color-foreground)] hover:bg-[var(--color-brand-secondary)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-foreground)] border-2 border-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]",
  ghost:
    "text-[var(--color-brand-primary)] hover:bg-[var(--color-surface-muted)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  return (
    <button
      type={type}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
