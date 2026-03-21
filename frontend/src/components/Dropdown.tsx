"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
};

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Seç…",
  searchable = false,
  searchPlaceholder = "Ara…",
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Auto-focus search input when opening
  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, searchable]);

  // Scroll to first-letter match when NOT in search mode
  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (filtered.length > 0) {
        select(filtered[0].value);
      }
      return;
    }
  }

  // For non-searchable dropdowns: typing a letter scrolls to first match
  useEffect(() => {
    if (!open || searchable) return;
    function onKey(e: KeyboardEvent) {
      if (e.key.length !== 1 || !listRef.current) return;
      const ch = e.key.toLowerCase();
      const buttons = listRef.current.querySelectorAll<HTMLButtonElement>("button[data-label]");
      for (const btn of Array.from(buttons)) {
        if (btn.dataset.label?.toLowerCase().startsWith(ch)) {
          btn.scrollIntoView({ block: "nearest" });
          btn.focus();
          break;
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, searchable]);

  function select(val: string) {
    onChange(val);
    close();
  }

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-500/15 ${
          open
            ? "border-violet-500 bg-white ring-4 ring-violet-500/15 dark:border-violet-400 dark:bg-violet-950/40"
            : "border-violet-200/50 bg-white hover:border-violet-400 hover:bg-violet-50/70 hover:shadow-md hover:ring-2 hover:ring-violet-300/35 dark:border-violet-500/20 dark:bg-violet-950/20 dark:hover:border-violet-400 dark:hover:bg-violet-950/45 dark:hover:ring-violet-500/25"
        } ${value ? "text-stone-800 dark:text-zinc-100" : "text-stone-400 dark:text-zinc-500"}`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-violet-400 transition-transform duration-200 dark:text-violet-400/80 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col rounded-2xl border border-violet-200/60 bg-white shadow-[0_16px_48px_rgba(139,92,246,0.18)] dark:border-violet-500/25 dark:bg-[#1a1528] dark:shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
          style={{ animation: "dropdown-in 160ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Search input */}
          {searchable && (
            <div className="border-b border-violet-100 p-2 dark:border-violet-500/15">
              <div className="flex items-center gap-2 rounded-xl border border-violet-200/50 bg-violet-50/60 px-3 py-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/15 dark:border-violet-500/20 dark:bg-violet-950/30">
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-violet-400 dark:text-violet-400/70"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="6" />
                  <path d="M15 15l3 3" />
                </svg>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="shrink-0 text-stone-400 transition hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    aria-label="Temizle"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 1l10 10M11 1L1 11" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options list */}
          <div ref={listRef} role="listbox" className="max-h-60 overflow-y-auto overscroll-contain py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-center text-sm text-stone-400 dark:text-zinc-500">
                Sonuç bulunamadı
              </p>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-label={opt.label}
                    onClick={() => select(opt.value)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                      isSelected
                        ? "bg-violet-600 font-semibold text-white"
                        : "text-stone-700 hover:bg-violet-100 dark:text-zinc-200 dark:hover:bg-violet-500/20"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <svg
                        className="h-4 w-4 shrink-0 opacity-90"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2.5 8l4 4 7-7" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
