import type { ReactNode } from "react";

export interface Option {
  id: number;
  label: string;
}

interface RadioGroupProps {
  legend: ReactNode;
  name: string;
  options: Option[];
  value: number | null;
  onChange: (id: number) => void;
  describedBy?: string;
}

export function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
  describedBy,
}: RadioGroupProps) {
  return (
    <fieldset
      className="border-0 p-0"
      aria-describedby={describedBy}
    >
      <legend className="mb-3 font-display text-lg font-semibold">{legend}</legend>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const inputId = `${name}-${option.id}`;
          const checked = value === option.id;
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                checked
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-[var(--color-border)] hover:bg-surface-muted"
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="mt-1 h-4 w-4 accent-brand-primary"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
