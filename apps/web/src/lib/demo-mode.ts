/**
 * DEMO_MODE — controls the first-visit guided walkthrough modal.
 *
 * Enabled via the VITE_DEMO_MODE env flag (defaults to on). Once a visitor
 * clicks "Enter Platform" inside the walkthrough, a localStorage flag keeps
 * the modal off for that browser permanently, even while the env flag
 * remains true.
 */

const STORAGE_KEY = "bios-walkthrough-complete";

export function isDemoModeEnabled(): boolean {
  const flag = import.meta.env.VITE_DEMO_MODE;
  // Default ON unless explicitly disabled.
  return flag !== "false" && flag !== "0";
}

export function hasCompletedWalkthrough(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWalkthroughComplete(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage unavailable — modal will show again next visit */
  }
}

export function shouldShowWalkthrough(): boolean {
  return isDemoModeEnabled() && !hasCompletedWalkthrough();
}
