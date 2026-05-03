import type { ReactNode } from "react";

interface TextAnswerProps {
  label: ReactNode;
  name: string;
  value: string;
  onChange: (next: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  maxLength?: number;
  autoFocus?: boolean;
  placeholder?: string;
}

export function TextAnswer({
  label,
  name,
  value,
  onChange,
  hint,
  error,
  maxLength,
  autoFocus,
  placeholder,
}: TextAnswerProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-display text-lg font-semibold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-[var(--color-muted-foreground)]">
          {hint}
        </p>
      )}
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={`rounded-2xl border bg-white px-4 py-3 text-base outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
          error
            ? "border-brand-primary"
            : "border-[var(--color-border)] focus:border-brand-primary"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-brand-primary">
          {error}
        </p>
      )}
    </div>
  );
}
