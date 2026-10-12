"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";

export type PerformanceMode = "auto" | "ultra" | "balanced" | "low-effects";

export interface VisualPreferences {
  mode: PerformanceMode;
  backgroundAnimation: boolean;
  heavyBlur: boolean;
  glassOpacity: number;
  blurStrength: number;
  glowStrength: number;
}

interface PerformanceContextValue {
  preferences: VisualPreferences;
  effectiveMode: Exclude<PerformanceMode, "auto">;
  backgroundAnimationEnabled: boolean;
  updatePreferences: (preferences: Partial<VisualPreferences>) => void;
}

const STORAGE_KEY = "motion-primitives-visual-preferences";
const DEFAULT_PREFERENCES: VisualPreferences = {
  mode: "auto",
  backgroundAnimation: true,
  heavyBlur: true,
  glassOpacity: 58,
  blurStrength: 18,
  glowStrength: 42,
};

const PerformanceContext = createContext<PerformanceContextValue | undefined>(
  undefined,
);

function isPerformanceMode(value: string | null): value is PerformanceMode {
  return (
    value === "auto" ||
    value === "ultra" ||
    value === "balanced" ||
    value === "low-effects"
  );
}

function readPreferences(): VisualPreferences {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_PREFERENCES;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.warn(
      "Saved visual preferences could not be read; defaults will be used.",
      error,
    );
    return DEFAULT_PREFERENCES;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return DEFAULT_PREFERENCES;
  }

  const value = parsed as Partial<VisualPreferences>;
  const mode = value.mode;
  return {
    mode: mode && isPerformanceMode(mode)
      ? mode
      : DEFAULT_PREFERENCES.mode,
    backgroundAnimation:
      typeof value.backgroundAnimation === "boolean"
        ? value.backgroundAnimation
        : DEFAULT_PREFERENCES.backgroundAnimation,
    heavyBlur:
      typeof value.heavyBlur === "boolean"
        ? value.heavyBlur
        : DEFAULT_PREFERENCES.heavyBlur,
    glassOpacity:
      typeof value.glassOpacity === "number" &&
      Number.isFinite(value.glassOpacity)
        ? Math.min(85, Math.max(25, value.glassOpacity))
        : DEFAULT_PREFERENCES.glassOpacity,
    blurStrength:
      typeof value.blurStrength === "number" &&
      Number.isFinite(value.blurStrength)
        ? Math.min(24, Math.max(0, value.blurStrength))
        : DEFAULT_PREFERENCES.blurStrength,
    glowStrength:
      typeof value.glowStrength === "number" &&
      Number.isFinite(value.glowStrength)
        ? Math.min(100, Math.max(0, value.glowStrength))
        : DEFAULT_PREFERENCES.glowStrength,
  };
}

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<VisualPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [needsLowEffects, setNeedsLowEffects] = useState(false);

  useEffect(() => {
    setPreferences(readPreferences());
    setReady(true);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () =>
      setPrefersReducedMotion(motionQuery.matches);
    const updateVisibility = () =>
      setIsPageVisible(document.visibilityState === "visible");

    updateMotionPreference();
    updateVisibility();
    setNeedsLowEffects(
      navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4,
    );
    motionQuery.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const effectiveMode: Exclude<PerformanceMode, "auto"> =
    preferences.mode === "auto"
      ? needsLowEffects || prefersReducedMotion
        ? "low-effects"
        : "balanced"
      : preferences.mode;
  const backgroundAnimationEnabled =
    preferences.backgroundAnimation &&
    effectiveMode !== "low-effects" &&
    isPageVisible &&
    !prefersReducedMotion;

  useEffect(() => {
    if (!ready) return;

    const root = document.documentElement;
    root.dataset.performanceMode = effectiveMode;
    root.dataset.backgroundAnimation = String(backgroundAnimationEnabled);
    root.dataset.heavyBlur = String(
      preferences.heavyBlur && effectiveMode !== "low-effects",
    );
    root.style.setProperty(
      "--glass-opacity",
      String(preferences.glassOpacity / 100),
    );
    root.style.setProperty("--glass-blur", `${preferences.blurStrength}px`);
    root.style.setProperty(
      "--glow-strength",
      String(preferences.glowStrength / 100),
    );
  }, [
    backgroundAnimationEnabled,
    effectiveMode,
    preferences.blurStrength,
    preferences.glassOpacity,
    preferences.glowStrength,
    preferences.heavyBlur,
    ready,
  ]);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences, ready]);

  const updatePreferences = useCallback(
    (updates: Partial<VisualPreferences>) => {
      setPreferences((current) => ({ ...current, ...updates }));
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      preferences,
      effectiveMode,
      backgroundAnimationEnabled,
      updatePreferences,
    }),
    [preferences, effectiveMode, backgroundAnimationEnabled, updatePreferences],
  );

  return (
    <PerformanceContext.Provider value={contextValue}>
      <MotionConfig reducedMotion={effectiveMode === "low-effects" ? "always" : "user"}>
        {children}
      </MotionConfig>
    </PerformanceContext.Provider>
  );
}

export function usePerformance(): PerformanceContextValue {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within PerformanceProvider");
  }
  return context;
}
