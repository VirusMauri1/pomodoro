import { useState, useEffect, useRef } from "react";

const WORK_TIME  = 25 * 60; 
const BREAK_TIME = 5  * 60; 

export default function PomodoroN2() {
  const [timeLeft,  setTimeLeft]  = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode,      setMode]      = useState("work"); 
  const [sessions,  setSessions]  = useState([]);      
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (mode === "work") {
        setSessions(prev => [
          ...prev,
          {
            id:          Date.now(),
            type:        "work",
            duration:    WORK_TIME,
            completedAt: new Date(),
          },
        ]);
      }

      const nextMode = mode === "work" ? "break" : "work";
      const nextTime = nextMode === "work" ? WORK_TIME : BREAK_TIME;

      setMode(nextMode);
      setTimeLeft(nextTime);
      setIsRunning(true); 
    }
  }, [timeLeft]); 
  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const toggleTimer = () => setIsRunning(prev => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
    setMode("work");
    setSessions([]); 
  };

  const total       = mode === "work" ? WORK_TIME : BREAK_TIME;
  const radius      = 82;
  const circ        = 2 * Math.PI * radius;
  const offset      = circ * (timeLeft / total);
  const ringColor   = mode === "work" ? "#e8533a" : "#3acea0";

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <p style={styles.levelLabel}>Nivel 2 — Semi-guiado</p>

        <div
          style={{
            ...styles.modeBadge,
            background: mode === "work" ? "rgba(232,83,58,0.15)" : "rgba(58,206,160,0.15)",
            color:      mode === "work" ? "#e8533a" : "#3acea0",
          }}
        >
          <span style={{ ...styles.modeDot, background: mode === "work" ? "#e8533a" : "#3acea0" }} />
          {mode === "work" ? "🔥 Trabajo" : "☕ Descanso"}
        </div>

        <div style={styles.clockWrap}>
          <svg width="190" height="190" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 190 190">
            <circle cx="95" cy="95" r={radius} fill="none" stroke="#1e1e21" strokeWidth="6" />
            <circle
              cx="95" cy="95" r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - offset}
              style={{ transition: "stroke-dashoffset 0.8s linear, stroke 0.4s" }}
            />
          </svg>
          <div style={styles.clockCenter}>
            <span style={styles.clockTime}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div style={styles.btnRow}>
          <button
            style={{ ...styles.btn, ...(isRunning ? styles.btnPause : styles.btnStart) }}
            onClick={toggleTimer}
          >
            {isRunning ? "⏸ Pausar" : "▶ Iniciar"}
          </button>
          <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={resetTimer}>
            ↺ Reiniciar
          </button>
        </div>
      </div>

      {sessions.length > 0 && (
        <div style={styles.sessionWrap}>
          <p style={styles.sessionTitle}>Sesiones completadas</p>
          <div style={styles.sessionList}>
            {sessions.map((s, i) => (
              <div key={s.id} style={styles.sessionItem}>
                <span style={styles.sessionNum}>#{i + 1}</span>
                <span style={styles.sessionBadge}>trabajo</span>
                <span style={styles.sessionDur}>{formatTime(s.duration)}</span>
                <span style={styles.sessionTime}>
                  {s.completedAt.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: "#161618",
    border: "1px solid #2a2a2e",
    borderRadius: 20,
    padding: "36px 32px 32px",
    width: 380,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  levelLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: 2,
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 20,
  },
  modeBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 16px",
    borderRadius: 50,
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  modeDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  clockWrap: {
    position: "relative",
    width: 190,
    height: 190,
    margin: "8px 0 20px",
  },
  clockCenter: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  clockTime: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 42,
    fontWeight: 700,
    color: "#f0f0f2",
    letterSpacing: -1,
  },
  btnRow: {
    display: "flex",
    gap: 10,
    width: "100%",
  },
  btn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    padding: "10px 22px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    flex: 1,
  },
  btnStart:     { background: "#e8533a", color: "white" },
  btnPause:     { background: "#333",    color: "#f0f0f2" },
  btnSecondary: { background: "#1e1e21", color: "#888", border: "1px solid #2a2a2e", flex: "unset", padding: "10px 18px" },
  sessionWrap: {
    width: 380,
  },
  sessionTitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: 2,
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  sessionList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    maxHeight: 200,
    overflowY: "auto",
  },
  sessionItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#161618",
    border: "1px solid #2a2a2e",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#f0f0f2",
  },
  sessionNum: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    color: "#555",
    minWidth: 22,
  },
  sessionBadge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 50,
    background: "rgba(232,83,58,0.15)",
    color: "#e8533a",
    fontFamily: "'Space Mono', monospace",
    flex: 1,
  },
  sessionDur: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    color: "#888",
  },
  sessionTime: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    color: "#555",
  },
};
