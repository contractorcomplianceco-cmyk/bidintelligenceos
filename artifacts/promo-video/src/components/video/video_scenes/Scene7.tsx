import { motion } from 'framer-motion';
import { EASE, CYAN, GREEN, TEAL, AMBER, RED, PANEL, PANEL2, BORDER, MUTED, DIM, Kicker } from './shared';

const ITEMS = [
  { icon: '🌤', text: 'Wind advisory Thursday — crane lift moved to Friday AM window', tone: AMBER },
  { icon: '📄', text: 'Crane street-use permit still in review — follow up with city desk', tone: RED },
  { icon: '👷', text: 'Volt Electrical crew confirmed on site 7:00 AM', tone: GREEN },
  { icon: '💰', text: 'Materials spend at 61% of budget — trending on plan', tone: CYAN },
  { icon: '📞', text: '2 bid follow-ups due today: Cedar Ridge Roof · Harbor Point TI', tone: TEAL },
];

export function Scene7() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center gap-[5vw] px-[9vw]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="w-[26vw] flex flex-col gap-[2.2vh]">
        <Kicker text="Daily Briefings" delay={0.3} />
        <motion.h2
          className="text-[2.6vw] font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
        >
          Your morning, <span style={{ color: CYAN }}>already sorted</span>
        </motion.h2>
        <motion.p
          className="text-[1.05vw]"
          style={{ color: MUTED }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Weather, permits, crews, costs, and follow-ups — triaged before your first coffee.
        </motion.p>
      </div>

      <motion.div
        className="w-[40vw] rounded-2xl border overflow-hidden"
        style={{ background: PANEL, borderColor: BORDER, boxShadow: '0 30px 80px -30px rgba(0,0,0,0.8)' }}
        initial={{ opacity: 0, x: 60, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
      >
        <div className="flex items-center justify-between px-[1.4vw] py-[1.4vh] border-b" style={{ borderColor: BORDER }}>
          <div>
            <div className="text-[1.05vw] font-semibold text-white">Morning Briefing</div>
            <div className="text-[0.72vw]" style={{ color: DIM }}>
              Tuesday · 3 jobs active · 2 bids pending
            </div>
          </div>
          <span
            className="px-[0.8vw] py-[0.4vh] rounded-full text-[0.7vw] font-semibold"
            style={{ color: CYAN, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.4)' }}
          >
            5 items
          </span>
        </div>
        <div className="p-[1.2vw] flex flex-col gap-[1vh]">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.text}
              className="flex items-center gap-[0.9vw] rounded-lg border px-[1vw] py-[1vh]"
              style={{ background: PANEL2, borderColor: BORDER }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 + i * 0.65, duration: 0.5, ease: EASE }}
            >
              <span
                className="w-[2vw] h-[2vw] rounded-lg flex items-center justify-center text-[0.9vw] shrink-0"
                style={{ background: `${it.tone}16`, border: `1px solid ${it.tone}50` }}
              >
                {it.icon}
              </span>
              <span className="text-[0.85vw] text-white/85 leading-snug">{it.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
