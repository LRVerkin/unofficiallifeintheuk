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
    "bg-brand-primary text-white hover:bg-brand-secondary focus-visible:outline-brand-primary",
  secondary:
    "border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus-visible:outline-brand-primary",
  ghost:
    "text-brand-secondary hover:bg-surface-muted focus-visible:outline-brand-secondary",
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
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
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
