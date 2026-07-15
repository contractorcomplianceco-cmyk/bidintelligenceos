/** Anonymous interactive demo (seed fixtures). */
export function isDemoSession(): boolean {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem("cca-demo-entered") === "1";
}

export function enterDemoSession(): void {
  sessionStorage.setItem("cca-demo-entered", "1");
}

export function clearDemoSession(): void {
  sessionStorage.removeItem("cca-demo-entered");
}

/** Live API data when authenticated; demo fixtures otherwise. */
export function useLiveData(isAuthenticated: boolean): boolean {
  // Signed-in users always use org data — demo session flag is for anonymous walkthrough only.
  return isAuthenticated;
}
