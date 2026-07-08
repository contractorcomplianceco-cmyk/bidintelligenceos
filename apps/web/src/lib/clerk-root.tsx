import { ClerkProvider } from "@clerk/clerk-react";
import type { ReactNode } from "react";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();

export function isClerkFrontendEnabled() {
  return Boolean(publishableKey);
}

export function ClerkRootProvider({ children }: { children: ReactNode }) {
  if (!publishableKey) return <>{children}</>;
  return (
    <ClerkProvider publishableKey={publishableKey} signInUrl="/login" signUpUrl="/register" afterSignOutUrl="/login">
      {children}
    </ClerkProvider>
  );
}
