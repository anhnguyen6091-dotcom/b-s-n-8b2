"use client";

import { createPortal } from "react-dom";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useTheme, DIRECTIONS, DIRECTION_META } from "@/lib/theme";
import {
  usePerformance,
  type PerformanceMode,
} from "@/lib/performance";

interface Command {
  label: string;
  keywords: string;
  action: () => void;
}

const PERFORMANCE_MODES: {
  value: PerformanceMode;
  label: string;
  description: string;
}[] = [
  { value: "auto", label: "Auto", description: "Adapts to your device" },
  { value: "ultra", label: "Ultra", description: "Full visual effects" },
  { value: "balanced", label: "Balanced", description: "A considered middle ground" },
  { value: "low-effects", label: "Low Effects", description: "Less blur and motion" },
];

export function ExperienceControls() {
  const { direction, setDirection, mode, toggleMode } = useTheme();
  const {
    preferences,
    effectiveMode,
    updatePreferences,
  } = usePerformance();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        setSettingsOpen(false);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (paletteOpen) {
      setQuery("");
      setActiveIndex(0);
      searchRef.current?.focus();
    } else {
      paletteTriggerRef.current?.focus({ preventScroll: true });
    }
  }, [paletteOpen]);

  const commands = useMemo<Command[]>(
    () => [
      {
        label: "Go to home",
        keywords: "home landing",
        action: () => window.location.assign("/"),
      },
      {
        label: "Browse components",
        keywords: "library components",
        action: () => window.location.assign("/components"),
      },
      {
        label: "Open showcase",
        keywords: "showcase gallery",
        action: () => window.location.assign("/showcase"),
      },
      {
        label: "Browse demos",
        keywords: "demos examples",
        action: () => window.location.assign("/demos"),
      },
      {
        label: "Open neural demo",
        keywords: "neural 3d network",
        action: () => window.location.assign("/neural"),
      },
      {
        label: "Scroll to components",
        keywords: "components section",
        action: () => document.querySelector("#components")?.scrollIntoView({ behavior: "smooth" }),
      },
      {
        label: "Scroll to design directions",
        keywords: "directions themes",
        action: () => document.querySelector("#directions")?.scrollIntoView({ behavior: "smooth" }),
      },
      {
        label: `Switch to ${mode === "dark" ? "light" : "dark"} theme`,
        keywords: "theme appearance light dark",
        action: toggleMode,
      },
      ...DIRECTIONS.map((item) => ({
        label: `Use ${DIRECTION_META[item].label} direction`,
        keywords: `direction design ${item}`,
        action: () => setDirection(item),
      })),
      ...PERFORMANCE_MODES.map((item) => ({
        label: `Set performance to ${item.label}`,
        keywords: `performance effects ${item.value}`,
        action: () => updatePreferences({ mode: item.value }),
      })),
      {
        label: `${preferences.backgroundAnimation ? "Pause" : "Enable"} background animation`,
        keywords: "animation motion background",
        action: () =>
          updatePreferences({
            backgroundAnimation: !preferences.backgroundAnimation,
          }),
      },
      {
        label: `${preferences.heavyBlur ? "Disable" : "Enable"} heavy blur`,
        keywords: "blur glass performance",
        action: () => updatePreferences({ heavyBlur: !preferences.heavyBlur }),
      },
      {
        label: "Open quick settings",
        keywords: "settings theme studio customize",
        action: () => setSettingsOpen(true),
      },
    ],
    [
      mode,
      preferences.backgroundAnimation,
      preferences.heavyBlur,
      setDirection,
      toggleMode,
      updatePreferences,
    ],
  );

  const filteredCommands = commands.filter((command) =>
    `${command.label} ${command.keywords}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const runCommand = (command: Command) => {
    setPaletteOpen(false);
    command.action();
  };

  const handlePaletteKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && filteredCommands.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % filteredCommands.length);
    } else if (event.key === "ArrowUp" && filteredCommands.length > 0) {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + filteredCommands.length) % filteredCommands.length,
      );
    } else if (event.key === "Enter" && filteredCommands[activeIndex]) {
      event.preventDefault();
      runCommand(filteredCommands[activeIndex]);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 sm:bottom-6 sm:right-6">
        <button
          ref={paletteTriggerRef}
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
          className="inline-flex h-10 items-center rounded-xl border border-border/60 bg-background/90 px-3 text-xs text-muted-foreground shadow-lg transition-colors hover:border-primary/50 hover:text-foreground sm:h-11"
        >
          <span className="hidden sm:inline">Search</span>
          <kbd className="sm:ml-2 rounded border border-border px-1.5 py-0.5">Ctrl K</kbd>
        </button>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open quick settings"
          aria-haspopup="dialog"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/60 bg-background/90 px-3 text-sm text-foreground shadow-lg transition-colors hover:border-primary/50 sm:h-11"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 6h6" />
          </svg>
          <span>Settings</span>
        </button>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <>
            {paletteOpen && (
              <div
                className="fixed inset-0 z-[110] flex items-start justify-center bg-black/65 px-4 pt-[14vh] backdrop-blur-sm"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setPaletteOpen(false);
                }}
              >
                <section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="command-palette-title"
                  className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[0_24px_100px_-24px_rgba(0,0,0,0.9)]"
                >
                  <h2 id="command-palette-title" className="sr-only">Command palette</h2>
                  <div className="flex items-center gap-3 border-b border-border/60 px-4">
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-foreground">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" />
                    </svg>
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handlePaletteKeyDown}
                      placeholder="Search pages, themes, and actions..."
                      aria-label="Search commands"
                      className="h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <kbd className="rounded border border-border px-1.5 py-1 text-[10px] text-muted-foreground">ESC</kbd>
                  </div>
                  <ul role="listbox" aria-label="Available commands" className="max-h-[min(55vh,24rem)] overflow-y-auto p-2">
                    {filteredCommands.length > 0 ? (
                      filteredCommands.map((command, index) => (
                        <li key={command.label}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => runCommand(command)}
                            aria-selected={index === activeIndex}
                            role="option"
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              index === activeIndex
                                ? "bg-primary/15 text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <span>{command.label}</span>
                            {index === activeIndex && <span aria-hidden="true" className="text-xs text-primary">Enter ↵</span>}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-8 text-center text-sm text-muted-foreground">No matching actions</li>
                    )}
                  </ul>
                  <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 text-[11px] text-muted-foreground">
                    <span>Navigate with ↑ ↓ · Run with Enter</span>
                    <span>{filteredCommands.length} actions</span>
                  </div>
                </section>
              </div>
            )}

            {settingsOpen && (
              <div
                className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setSettingsOpen(false);
                }}
              >
                <section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="quick-settings-title"
                  className="my-auto w-full max-w-2xl rounded-2xl border border-border/70 bg-background p-5 shadow-[0_24px_100px_-24px_rgba(0,0,0,0.9)] sm:p-7"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">Experience controls</p>
                      <h2 id="quick-settings-title" className="text-2xl font-semibold text-foreground">Quick settings</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Preferences stay on this device.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(false)}
                      aria-label="Close quick settings"
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m18 6-12 12M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6 grid gap-5 sm:grid-cols-2">
                    <fieldset>
                      <legend className="mb-2 text-sm font-medium text-foreground">Design direction</legend>
                      <div className="flex flex-wrap gap-2">
                        {DIRECTIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setDirection(item)}
                            aria-pressed={direction === item}
                            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                              direction === item
                                ? "border-primary bg-primary/15 text-foreground"
                                : "border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {DIRECTION_META[item].label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="mb-2 text-sm font-medium text-foreground">Color mode</legend>
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="rounded-xl border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50"
                      >
                        Switch to {mode === "dark" ? "light" : "dark"}
                      </button>
                    </fieldset>
                  </div>

                  <fieldset className="mb-6">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <legend className="text-sm font-medium text-foreground">Performance mode</legend>
                      <span className="text-xs text-muted-foreground">
                        {preferences.mode === "auto" ? `Auto · ${effectiveMode}` : "Manual"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {PERFORMANCE_MODES.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => updatePreferences({ mode: item.value })}
                          aria-pressed={preferences.mode === item.value}
                          className={`rounded-xl border p-3 text-left transition-colors ${
                            preferences.mode === item.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <span className="block text-sm font-medium text-foreground">{item.label}</span>
                          <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{item.description}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    <PreferenceSwitch
                      label="Background animation"
                      description="Pause motion in the hero and ambient layers"
                      checked={preferences.backgroundAnimation}
                      onChange={(backgroundAnimation) => updatePreferences({ backgroundAnimation })}
                      disabled={effectiveMode === "low-effects"}
                    />
                    <PreferenceSwitch
                      label="Heavy blur"
                      description="Use backdrop blur on glass surfaces"
                      checked={preferences.heavyBlur}
                      onChange={(heavyBlur) => updatePreferences({ heavyBlur })}
                      disabled={effectiveMode === "low-effects"}
                    />
                  </div>

                  <div className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
                    <RangePreference
                      label="Glass opacity"
                      value={preferences.glassOpacity}
                      min={25}
                      max={85}
                      unit="%"
                      onChange={(glassOpacity) => updatePreferences({ glassOpacity })}
                    />
                    <RangePreference
                      label="Blur strength"
                      value={preferences.blurStrength}
                      min={0}
                      max={24}
                      unit="px"
                      onChange={(blurStrength) => updatePreferences({ blurStrength })}
                      disabled={!preferences.heavyBlur || effectiveMode === "low-effects"}
                    />
                    <RangePreference
                      label="Glow intensity"
                      value={preferences.glowStrength}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={(glowStrength) => updatePreferences({ glowStrength })}
                    />
                  </div>
                  {effectiveMode === "low-effects" && (
                    <p className="mt-5 rounded-lg border border-border/60 bg-surface/60 px-3 py-2 text-xs text-muted-foreground">
                      Motion and heavy blur are reduced in Low Effects mode. Choose Ultra or Balanced to enable them.
                    </p>
                  )}
                  <p className="mt-5 text-[11px] text-muted-foreground">
                    Press <kbd className="rounded border border-border px-1">Ctrl K</kbd> to search pages and actions.
                  </p>
                </section>
              </div>
            )}
          </>,
          document.body,
        )}
    </>
  );
}

function PreferenceSwitch({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-border/60 bg-surface/40 p-3">
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="mt-1 block text-xs leading-4 text-muted-foreground">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))] disabled:cursor-not-allowed"
      />
    </label>
  );
}

function RangePreference({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`block ${disabled ? "opacity-50" : ""}`}>
      <span className="mb-2 flex justify-between gap-2 text-xs">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}{unit}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[hsl(var(--primary))] disabled:cursor-not-allowed"
      />
    </label>
  );
}
