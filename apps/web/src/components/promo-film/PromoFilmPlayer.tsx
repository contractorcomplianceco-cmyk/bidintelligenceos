import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import VideoTemplate from "./components/video/VideoTemplate";
import "./promo-film.css";

/**
 * Inline cinematic promo film — the original Replit 10-scene animated film
 * restored inside the main app (no separate promo artifact).
 */
export function PromoFilmPlayer({
  allowSound,
  replayKey = 0,
  onEnded,
}: {
  allowSound: boolean;
  replayKey?: number;
  onEnded?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(!allowSound);

  useEffect(() => {
    setMuted(!allowSound);
  }, [allowSound, replayKey]);

  useEffect(() => {
    const audio = rootRef.current?.querySelector("audio");
    if (!audio) return;
    audio.muted = muted;
    if (!muted) {
      audio.volume = 1;
      void audio.play().catch(() => {
        audio.muted = true;
        setMuted(true);
        void audio.play().catch(() => undefined);
      });
    } else {
      void audio.play().catch(() => undefined);
    }
  }, [muted, replayKey]);

  return (
    <div
      ref={rootRef}
      className="promo-film-root relative w-full h-full aspect-video bg-[#0A0E1A] overflow-hidden"
      data-testid="promo-film-player"
    >
      <div className="absolute inset-0">
        <VideoTemplate key={replayKey} loop={false} muted={muted} onEnded={onEnded} />
      </div>
      {muted && (
        <button
          type="button"
          onClick={() => setMuted(false)}
          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-black/75 px-3 py-1.5 text-xs font-semibold text-white"
          data-testid="button-promo-sound"
        >
          <Volume2 className="h-3.5 w-3.5" /> Tap for sound
        </button>
      )}
    </div>
  );
}
