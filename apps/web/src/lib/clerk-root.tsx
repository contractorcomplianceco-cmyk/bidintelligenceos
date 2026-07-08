import { ClerkProvider } from "@clerk/clerk-react";
import type { ReactNode } from "react";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
const appUrl = import.meta.env.VITE_APP_URL?.trim() || (typeof window !== "undefined" ? window.location.origin : "");
const signInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL?.trim() || "/login";
const signUpUrl = import.meta.env.VITE_CLERK_SIGN_UP_URL?.trim() || "/register";

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
  return appUrl;
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
      afterSignInUrl={appUrl || "/"}
      afterSignUpUrl={appUrl || "/"}
      afterSignOutUrl={signInUrl.startsWith("http") ? signInUrl : "/login"}
    >
      {children}
    </ClerkProvider>
  );
}
