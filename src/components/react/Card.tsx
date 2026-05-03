import type { ElementType, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

export function Card({ as: Tag = "section", className = "", children, ...rest }: CardProps) {
  const base =
    "border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-6";
  return (
    <Tag className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
