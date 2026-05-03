import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Option } from "./RadioGroup";

interface RankListProps {
  legend: string;
  items: Option[];
  value: number[];
  onChange: (next: number[]) => void;
  disabled?: boolean;
}

function moveItem(value: number[], from: number, to: number): number[] {
  if (from === to || from < 0 || to < 0 || from >= value.length || to >= value.length) {
    return value;
  }
  const next = [...value];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function RankList({ legend, items, value, onChange, disabled = false }: RankListProps) {
  const [announcement, setAnnouncement] = useState("");
  const [pendingFocus, setPendingFocus] = useState<string | null>(null);
  const [bumped, setBumped] = useState<{ id: number; dir: "up" | "down" } | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const orderedItems = useMemo(() => {
    const lookup = new Map(items.map((item) => [item.id, item] as const));
    const ordered: Option[] = [];
    for (const id of value) {
      const item = lookup.get(id);
      if (item) ordered.push(item);
    }
    for (const item of items) {
      if (!value.includes(item.id)) ordered.push(item);
    }
    return ordered;
  }, [items, value]);

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

  useLayoutEffect(() => {
    if (!bumped) return;
    const t = setTimeout(() => setBumped(null), 240);
    return () => clearTimeout(t);
  }, [bumped]);

  function move(index: number, delta: 1 | -1, item: Option) {
    const next = moveItem(value, index, index + delta);
    if (next === value) return;
    onChange(next);
    setBumped({ id: item.id, dir: delta === -1 ? "up" : "down" });
    setAnnouncement(
      `Moved ${item.label} to position ${index + delta + 1} of ${value.length}.`,
    );
  }

  function reorderByDrag(fromId: number, toId: number) {
    if (fromId === toId) return;
    const fromIndex = orderedItems.findIndex((it) => it.id === fromId);
    const toIndex = orderedItems.findIndex((it) => it.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const ids = orderedItems.map((it) => it.id);
    const next = moveItem(ids, fromIndex, toIndex);
    if (next === ids) return;
    onChange(next);
    const moved = orderedItems[fromIndex];
    setBumped({ id: moved.id, dir: toIndex > fromIndex ? "down" : "up" });
    setAnnouncement(
      `Moved ${moved.label} to position ${toIndex + 1} of ${ids.length}.`,
    );
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 font-display text-lg font-semibold">{legend}</legend>
      {!disabled && (
        <p className="mb-2 text-sm text-[var(--color-muted-foreground)]">
          Drag to reorder, or use the arrow buttons.
        </p>
      )}
      <ol ref={listRef} className="flex flex-col gap-2" aria-label={legend}>
        {orderedItems.map((item, index) => {
          const upKey = `up-${item.id}`;
          const downKey = `down-${item.id}`;
          const isBumped = bumped?.id === item.id;
          const isDragging = dragId === item.id;
          const isDropTarget = dropTargetId === item.id && dragId !== item.id;
          return (
            <li
              key={item.id}
              data-bumped={isBumped ? bumped?.dir : undefined}
              data-rank-dragging={isDragging ? "true" : undefined}
              data-rank-drop-target={isDropTarget ? "true" : undefined}
              draggable={!disabled}
              onDragStart={(event) => {
                if (disabled) return;
                setDragId(item.id);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(item.id));
              }}
              onDragOver={(event) => {
                if (disabled || dragId == null) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (dropTargetId !== item.id) setDropTargetId(item.id);
              }}
              onDragLeave={() => {
                if (dropTargetId === item.id) setDropTargetId(null);
              }}
              onDrop={(event) => {
                if (disabled || dragId == null) return;
                event.preventDefault();
                reorderByDrag(dragId, item.id);
                setDragId(null);
                setDropTargetId(null);
              }}
              onDragEnd={() => {
                setDragId(null);
                setDropTargetId(null);
              }}
              className={`flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 transition-colors ${
                disabled ? "" : "cursor-grab active:cursor-grabbing"
              }`}
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
                  disabled={disabled || index === 0}
                  aria-label={`Move ${item.label} up`}
                  data-key={upKey}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-base hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingFocus(downKey);
                    move(index, 1, item);
                  }}
                  disabled={disabled || index === orderedItems.length - 1}
                  aria-label={`Move ${item.label} down`}
                  data-key={downKey}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-base hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
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
