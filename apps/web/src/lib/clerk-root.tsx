import { ClerkProvider } from "@clerk/clerk-react";
import type { ReactNode } from "react";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
/** Origin only (no path). Absolute URLs must NEVER be passed as afterSignInUrl — Clerk/router
 *  may treat them as a path (`/https://…cagteam.net`), and Express then 404s because `.net`
 *  looks like a static-asset extension. */
const appOrigin =
  import.meta.env.VITE_APP_URL?.trim().replace(/\/$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");
const signInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL?.trim() || "/login";
const signUpUrl = import.meta.env.VITE_CLERK_SIGN_UP_URL?.trim() || "/register";

/** Prefer Bid Intelligence list after Clerk returns (Command Center `/` also works). */
export const POST_AUTH_PATH = "/bids";

export function isClerkFrontendEnabled() {
  return Boolean(publishableKey);
}

export function clerkSignInUrl() {
  return signInUrl;
}

export function clerkSignUpUrl() {
  return signUpUrl;
}

export function clerkAppUrl() {
  return appOrigin;
}

/** Absolute return URL for hosted Accounts portal `redirect_url` (safe HTTP redirect). */
export function clerkPostAuthUrl() {
  return `${appOrigin || (typeof window !== "undefined" ? window.location.origin : "")}${POST_AUTH_PATH}`;
}

export function usesHostedAccountPortal() {
  return signInUrl.startsWith("http");
}

export function ClerkRootProvider({ children }: { children: ReactNode }) {
  if (!publishableKey) return <>{children}</>;
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={POST_AUTH_PATH}
      afterSignUpUrl={POST_AUTH_PATH}
      signInFallbackRedirectUrl={POST_AUTH_PATH}
      signUpFallbackRedirectUrl={POST_AUTH_PATH}
      afterSignOutUrl={signInUrl.startsWith("http") ? signInUrl : "/login"}
    >
      {children}
    </ClerkProvider>
  );
}
