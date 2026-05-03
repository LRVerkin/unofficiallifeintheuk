import type { ElementType, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

export function Card({ as: Tag = "section", className = "", children, ...rest }: CardProps) {
  const base =
    "rounded-3xl border border-[var(--color-border)] bg-white px-6 py-6 shadow-[var(--shadow-card)]";
  return (
    <Tag className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
