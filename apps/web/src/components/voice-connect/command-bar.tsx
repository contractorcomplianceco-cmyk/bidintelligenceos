import { useState } from "react";
import {
  Mic,
  Sparkles,
  X,
  ArrowRight,
  CornerDownLeft,
  ShieldCheck,
} from "lucide-react";
import { voiceCommands, VoiceCommand } from "@core/operations";
import { useToast } from "@/hooks/use-toast";
import { VoiceConnectMark } from "./logo";

export function VoiceConnectCommandBar() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [active, setActive] = useState<VoiceCommand | null>(null);
  const [listening, setListening] = useState(false);
  const { toast } = useToast();

  const run = (cmd: VoiceCommand) => {
    setActive(cmd);
    setInput(cmd.command);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const match =
      voiceCommands.find((c) =>
        c.command.toLowerCase().includes(input.trim().toLowerCase())
      ) ?? voiceCommands[0];
    setActive({ ...match, command: input.trim() || match.command });
  };

  const toggleMic = () => {
    setListening(true);
    setOpen(true);
    setTimeout(() => {
      setListening(false);
      run(voiceCommands[0]);
    }, 1400);
  };

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full border border-[#0BA3A8]/40 bg-[#08161c]/90 backdrop-blur-xl text-[#5eead4] shadow-[0_10px_40px_-10px_rgba(11,163,168,0.6)] hover:border-[#0BA3A8] transition-colors"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#0BA3A8]/15">
              <Mic className="w-3.5 h-3.5 text-[#0BA3A8]" />
              <span className="absolute inset-0 rounded-full ring-1 ring-[#0BA3A8]/40 animate-ping opacity-60" />
            </span>
            <span className="text-xs font-semibold tracking-wide">Ask VoiceConnect</span>
          </button>
        )}
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(92vw,420px)] animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="rounded-2xl border border-[#0BA3A8]/30 bg-[#08161c]/95 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-[#0BA3A8]/15 to-transparent">
              <div className="flex items-center gap-2.5">
                <VoiceConnectMark className="w-6 h-6" />
                <div>
                  <p className="text-sm font-bold text-white leading-none">VoiceConnect</p>
                  <p className="text-[10px] text-[#5eead4]/80 mt-1 tracking-wide">
                    Field-to-office command center
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  setActive(null);
                }}
                className="text-[#5eead4]/70 hover:text-white transition-colors"
                aria-label="Close VoiceConnect"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mic state */}
            <div className="px-4 pt-4">
              <button
                onClick={toggleMic}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border transition-all ${
                  listening
                    ? "border-[#0BA3A8] bg-[#0BA3A8]/15"
                    : "border-white/10 bg-[#0f2229] hover:border-[#0BA3A8]/50"
                }`}
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0BA3A8]/20">
                  <Mic className="w-4 h-4 text-[#0BA3A8]" />
                  {listening && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-[#0BA3A8]/50 animate-ping" />
                  )}
                </span>
                <span className="text-sm font-medium text-white">
                  {listening ? "Listening…" : "Tap to speak a command"}
                </span>
              </button>
            </div>

            {/* Response */}
            {active && (
              <div className="px-4 pt-4">
                <div className="rounded-xl border border-[#0BA3A8]/25 bg-[#0f2229] p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#0BA3A8]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5eead4]">
                      {active.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{active.response}</p>
                  <button
                    onClick={() =>
                      toast({
                        title: active.actionLabel,
                        description:
                          "VoiceConnect prepared this action. Review before it affects client-facing output.",
                      })
                    }
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0BA3A8] hover:text-[#5eead4] transition-colors"
                  >
                    {active.actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Suggested commands */}
            <div className="px-4 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A96B0] mb-2">
                Suggested commands
              </p>
              <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-thin pr-1">
                {voiceCommands.slice(0, 6).map((c) => (
                  <button
                    key={c.command}
                    onClick={() => run(c)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 bg-[#0f2229]/60 border border-transparent hover:border-[#0BA3A8]/30 hover:text-white transition-colors"
                  >
                    “{c.command}”
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={submit} className="p-4">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command…"
                  className="w-full rounded-lg bg-[#0A0E1A] border border-white/10 pl-3 pr-10 py-2.5 text-sm text-white placeholder:text-[#5b6680] focus:outline-none focus:border-[#0BA3A8]/60 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0BA3A8] hover:text-[#5eead4]"
                  aria-label="Send command"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#8A96B0]">
                <ShieldCheck className="w-3 h-3 text-[#0BA3A8]" />
                Decision-support guidance only. Review before sending client-facing output.
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
