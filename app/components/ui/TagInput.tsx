"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export default function TagInput({
  tags,
  onChange,
  suggestions = [],
  placeholder = "Type a tag...",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter suggestions: exclude already-added tags, match current input
  const filtered = useMemo(() => {
    const lower = input.trim().toLowerCase();
    const used = new Set(tags.map((t) => t.toLowerCase()));
    return suggestions
      .filter((s) => !used.has(s.toLowerCase()))
      .filter((s) => (lower ? s.toLowerCase().includes(lower) : true))
      .slice(0, 8);
  }, [input, tags, suggestions]);

  const addTag = useCallback(
    (raw: string) => {
      const tag = raw.trim().replace(/,/g, "");
      if (!tag) return;
      if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
      onChange([...tags, tag]);
      setInput("");
      setHighlightIndex(-1);
    },
    [tags, onChange],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(tags.filter((_, i) => i !== index));
    },
    [tags, onChange],
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Determine whether dropdown should open upward (near viewport bottom)
  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setDropUp(spaceBelow < 220);
  }, [isOpen]);

  // Trap scroll inside the dropdown — prevent page scroll bleed
  useEffect(() => {
    const list = listRef.current;
    if (!list || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = list;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
    };

    // Use non-passive listener so preventDefault works on wheel
    list.addEventListener("wheel", handleWheel, { passive: false });
    return () => list.removeEventListener("wheel", handleWheel);
  }, [isOpen, filtered]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[role=option]");
    items[highlightIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && filtered[highlightIndex]) {
        addTag(filtered[highlightIndex]);
      } else if (input.trim()) {
        addTag(input);
      }
      return;
    }

    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
      return;
    }

    if (e.key === "," && input.trim()) {
      e.preventDefault();
      addTag(input);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && filtered.length > 0) {
        setIsOpen(true);
      }
      setHighlightIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1,
      );
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // If the user pastes comma-separated tags, add them all
    if (value.includes(",")) {
      const parts = value.split(",");
      parts.forEach((part) => {
        if (part.trim()) addTag(part);
      });
      return;
    }

    setInput(value);
    setIsOpen(true);
    setHighlightIndex(-1);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Chips + input container */}
      <div
        className={`flex flex-wrap items-center gap-1.5 rounded-md border bg-[var(--bg)] px-2.5 py-2 cursor-text transition-colors ${
          isOpen
            ? "border-[var(--ring)] shadow-[0_0_0_1px_var(--ring)]"
            : "border-[var(--border)] focus-within:border-[var(--ring)] focus-within:shadow-[0_0_0_1px_var(--ring)]"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--text)]"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 3l6 6M9 3l-6 6" />
              </svg>
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filtered.length > 0) setIsOpen(true);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 border-none bg-transparent p-0 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] outline-none"
          autoComplete="off"
        />
      </div>

      {/* Suggestions dropdown — isolated scroll, smart positioning */}
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className={`absolute left-0 right-0 z-50 max-h-48 overflow-auto rounded-md border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg overscroll-contain ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {filtered.map((suggestion, i) => (
            <li
              key={suggestion}
              role="option"
              aria-selected={i === highlightIndex}
              className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                i === highlightIndex
                  ? "bg-[var(--bg)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(suggestion);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
