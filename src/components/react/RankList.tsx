import { useMemo, useRef, useState } from "react";
import type { Option } from "./RadioGroup";

interface RankListProps {
  legend: string;
  items: Option[];
  value: number[];
  onChange: (next: number[]) => void;
}

function moveItem(value: number[], index: number, delta: 1 | -1): number[] {
  const next = [...value];
  const target = index + delta;
  if (target < 0 || target >= next.length) return value;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function RankList({ legend, items, value, onChange }: RankListProps) {
  const [announcement, setAnnouncement] = useState("");
  // Stable focus target so re-renders don't blur the user's button.
  const lastFocusedKey = useRef<string | null>(null);

  const orderedItems = useMemo(() => {
    const lookup = new Map(items.map((item) => [item.id, item] as const));
    const ordered: Option[] = [];
    for (const id of value) {
      const item = lookup.get(id);
      if (item) ordered.push(item);
    }
    // Append any items that weren't in `value` (defensive — keeps the list rendered
    // even if `value` is shorter than `items`).
    for (const item of items) {
      if (!value.includes(item.id)) ordered.push(item);
    }
    return ordered;
  }, [items, value]);

  function move(index: number, delta: 1 | -1, label: string) {
    const next = moveItem(value, index, delta);
    if (next === value) return;
    onChange(next);
    setAnnouncement(`Moved ${label} to position ${index + delta + 1} of ${value.length}.`);
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 font-display text-lg font-semibold">{legend}</legend>
      <ol className="flex flex-col gap-2" aria-label={legend}>
        {orderedItems.map((item, index) => {
          const upKey = `up-${item.id}`;
          const downKey = `down-${item.id}`;
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted font-mono text-sm font-semibold"
              >
                {index + 1}
              </span>
              <span className="flex-1">{item.label}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    lastFocusedKey.current = `up-${value[index - 1] ?? item.id}`;
                    move(index, -1, item.label);
                  }}
                  disabled={index === 0}
                  aria-label={`Move ${item.label} up`}
                  data-key={upKey}
                  autoFocus={lastFocusedKey.current === upKey}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-base disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-muted"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => {
                    lastFocusedKey.current = `down-${value[index + 1] ?? item.id}`;
                    move(index, 1, item.label);
                  }}
                  disabled={index === orderedItems.length - 1}
                  aria-label={`Move ${item.label} down`}
                  data-key={downKey}
                  autoFocus={lastFocusedKey.current === downKey}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-base disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-muted"
                >
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </fieldset>
  );
}
