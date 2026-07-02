import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const audio = rootRef.current?.querySelector("audio");
    if (!audio) return;
    audio.muted = !allowSound;
    if (allowSound) {
      audio.volume = 1;
      void audio.play().catch(() => {
        audio.muted = true;
        void audio.play().catch(() => undefined);
      });
    } else {
      void audio.play().catch(() => undefined);
    }
  }, [allowSound, replayKey]);

  return (
    <div
      ref={rootRef}
      className="promo-film-root relative w-full h-full aspect-video bg-[#0A0E1A] overflow-hidden"
      data-testid="promo-film-player"
    >
      <div className="absolute inset-0">
        <VideoTemplate key={replayKey} loop={false} muted={!allowSound} onEnded={onEnded} />
      </div>
    </div>
  );
}
