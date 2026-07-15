import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { POST_AUTH_PATH } from "@/lib/clerk-root";

/** Clerk OAuth / SSO handshake. Without this route, `/sso-callback` hits the SPA 404 page. */
export default function SsoCallback() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6 text-slate-300">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Completing sign in…
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl={POST_AUTH_PATH}
        signUpFallbackRedirectUrl={POST_AUTH_PATH}
      />
    </div>
  );
}
