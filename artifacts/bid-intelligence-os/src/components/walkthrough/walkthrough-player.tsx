import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { WALKTHROUGH_SCENES } from "./scenes";

type Status = "idle" | "playing" | "paused" | "done";

const AUDIO_BASE = `${import.meta.env.BASE_URL}walkthrough/`;
const FALLBACK_MS = 15000;

export function WalkthroughPlayer() {
  const [status, setStatus] = useState<Status>("idle");
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackRef = useRef<number | null>(null);
  const currentRef = useRef(0);

  const clearFallback = () => {
    if (fallbackRef.current !== null) {
      window.clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }
  };

  const playScene = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      currentRef.current = index;
      setCurrent(index);
      setProgress(0);
      clearFallback();
      // Fallback advances the scene if audio never fires "ended"
      fallbackRef.current = window.setTimeout(() => advance(index), FALLBACK_MS);
      if (audio) {
        audio.src = `${AUDIO_BASE}${WALKTHROUGH_SCENES[index].id}.mp3`;
        audio.muted = muted;
        audio.currentTime = 0;
        audio.play().catch(() => {
          /* fallback timer will advance */
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [muted]
  );

  const advance = useCallback(
    (fromIndex: number) => {
      // Ignore stale callbacks (e.g. a fallback firing after "ended" already advanced)
      if (fromIndex !== currentRef.current) return;
      clearFallback();
      if (fromIndex < WALKTHROUGH_SCENES.length - 1) {
        playScene(fromIndex + 1);
      } else {
        setStatus("done");
        setProgress(1);
      }
    },
    [playScene]
  );

  const start = () => {
    setStatus("playing");
    playScene(0);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (status === "idle" || status === "done") {
      start();
      return;
    }
    if (status === "playing") {
      audio?.pause();
      clearFallback();
      setStatus("paused");
    } else if (status === "paused") {
      audio?.play().catch(() => {});
      // restart fallback for the remaining portion of the scene
      fallbackRef.current = window.setTimeout(() => advance(current), FALLBACK_MS);
      setStatus("playing");
    }
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => advance(current);
    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
    };
  }, [current, advance]);

  useEffect(() => () => clearFallback(), []);

  const Active = WALKTHROUGH_SCENES[current].Component;
  const started = status !== "idle";

  return (
    <div className="relative w-full">
      <audio ref={audioRef} preload="auto" />

      {/* Screen */}
      <div className="relative w-full aspect-video rounded-2xl border border-white/10 bg-[#0A0E1A] overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        <AnimatePresence mode="popLayout">
          <Active key={WALKTHROUGH_SCENES[current].id} />
        </AnimatePresence>

        {/* Idle poster / play overlay */}
        <AnimatePresence>
          {!started && (
            <motion.button
              type="button"
              onClick={start}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0E1A]/70 backdrop-blur-[2px] group"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              aria-label="Play product walkthrough"
            >
              <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#38BDF8] text-[#0A0E1A] shadow-[0_0_50px_rgba(56,189,248,0.5)] transition-transform group-hover:scale-105">
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
                <span className="absolute inset-0 rounded-full border border-[#38BDF8] animate-ping opacity-40" />
              </span>
              <span className="mt-5 text-sm font-semibold tracking-wide text-white">
                Watch the 50-second walkthrough
              </span>
              <span className="mt-1 text-xs text-[#8A96B0]">Narrated product tour</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Caption */}
        {started && (
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4 pt-10 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/70 to-transparent">
            <AnimatePresence mode="wait">
              <motion.p
                key={current}
                className="max-w-3xl text-[clamp(0.75rem,1.5vw,0.95rem)] text-[#e2e8f0] leading-snug"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {WALKTHROUGH_SCENES[current].caption}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Controls */}
      {started && (
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0F1830] border border-[#1C253B] text-white hover:border-[#38BDF8]/50 transition-colors"
            aria-label={
              status === "done"
                ? "Replay walkthrough"
                : status === "playing"
                ? "Pause walkthrough"
                : "Play walkthrough"
            }
          >
            {status === "done" ? (
              <RotateCcw className="w-4 h-4" />
            ) : status === "playing" ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Scene progress segments */}
          <div className="flex-1 flex items-center gap-1.5">
            {WALKTHROUGH_SCENES.map((s, i) => (
              <div
                key={s.id}
                className="h-1 flex-1 rounded-full bg-[#1C253B] overflow-hidden"
              >
                <div
                  className="h-full bg-[#38BDF8] transition-[width] duration-150 ease-linear"
                  style={{
                    width:
                      i < current
                        ? "100%"
                        : i === current
                        ? `${Math.round(progress * 100)}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          <span className="text-xs text-[#5b6680] tabular-nums">
            {Math.min(current + 1, WALKTHROUGH_SCENES.length)} / {WALKTHROUGH_SCENES.length}
          </span>

          <button
            type="button"
            onClick={toggleMute}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0F1830] border border-[#1C253B] text-[#8A96B0] hover:text-white hover:border-[#38BDF8]/50 transition-colors"
            aria-label={muted ? "Unmute narration" : "Mute narration"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
