import { Link } from "wouter";
import logo from "@/assets/bidintelligence-logo.png";

/**
 * Rose 2026-07-23: invitation-only stage.
 * Do not offer Clerk Account Portal sign-up or legacy self-register forms.
 */
export default function Register() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/80 p-8 text-center shadow-xl">
        <img
          src={logo}
          alt="BidIntelligenceOS"
          className="h-8 w-auto mb-6 mx-auto"
        />
        <h1 className="text-2xl font-bold text-white mb-3">Invitation only</h1>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Bid Intelligence is not open for public account creation. Contractor
          and company access is by invitation. Contact CCA if you were invited
          or need access.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-[#1C6FD6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1761bd]"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
