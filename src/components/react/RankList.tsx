import { useLayoutEffect, useMemo, useRef, useState } from "react";
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
  const [pendingFocus, setPendingFocus] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const orderedItems = useMemo(() => {
    const lookup = new Map(items.map((item) => [item.id, item] as const));
    const ordered: Option[] = [];
    for (const id of value) {
      const item = lookup.get(id);
      if (item) ordered.push(item);
    }
    // Defensive: keep the list rendered if `value` is shorter than `items`.
    for (const item of items) {
      if (!value.includes(item.id)) ordered.push(item);
    }
    return ordered;
  }, [items, value]);

  // Focus the moved item's matching button after each reorder. If that button
  // is now disabled (we hit a boundary), fall back to the opposite-direction
  // button on the same row so keyboard focus stays on the moved item.
  useLayoutEffect(() => {
    if (!pendingFocus || !listRef.current) return;
    const root = listRef.current;
    const primary = root.querySelector<HTMLButtonElement>(
      `button[data-key="${pendingFocus}"]`,
    );
    let target = primary && !primary.disabled ? primary : null;
    if (!target) {
      const [direction, ...idParts] = pendingFocus.split("-");
      const id = idParts.join("-");
      const opposite = direction === "up" ? "down" : "up";
      target = root.querySelector<HTMLButtonElement>(
        `button[data-key="${opposite}-${id}"]`,
      );
    }
    target?.focus();
    setPendingFocus(null);
  }, [pendingFocus]);

  function move(index: number, delta: 1 | -1, item: Option) {
    const next = moveItem(value, index, delta);
    if (next === value) return;
    onChange(next);
    setAnnouncement(`Moved ${item.label} to position ${index + delta + 1} of ${value.length}.`);
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 font-display text-lg font-semibold">{legend}</legend>
      <ol ref={listRef} className="flex flex-col gap-2" aria-label={legend}>
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
                    setPendingFocus(upKey);
                    move(index, -1, item);
                  }}
                  disabled={index === 0}
                  aria-label={`Move ${item.label} up`}
                  data-key={upKey}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-base disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-muted"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingFocus(downKey);
                    move(index, 1, item);
                  }}
                  disabled={index === orderedItems.length - 1}
                  aria-label={`Move ${item.label} down`}
                  data-key={downKey}
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
