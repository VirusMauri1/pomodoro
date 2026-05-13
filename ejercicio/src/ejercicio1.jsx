import { useState, useEffect, useRef } from "react";

// NIVEL 1 — Timer básico

const TOTAL_TIME = 10; 
export default function PomodoroN1() {

  const [timeLeft, setTimeLeft]   = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const toggleTimer = () => setIsRunning(prev => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TOTAL_TIME);
  };

  const radius        = 82;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset  = circumference * (timeLeft / TOTAL_TIME);

  return (
    <div style={styles.card}>
      <p style={styles.levelLabel}>Nivel 1 — Guiado</p>

      <div style={styles.clockWrap}>
        <svg
          width="190"
          height="190"
          style={{ transform: "rotate(-90deg)" }}
          viewBox="0 0 190 190"
        >
          
          <circle
            cx="95" cy="95" r={radius}
            fill="none"
            stroke="#1e1e21"
            strokeWidth="6"
          />
          
          <circle
            cx="95" cy="95" r={radius}
            fill="none"
            stroke="#e8533a"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeOffset}
            style={{ transition: "stroke-dashoffset 0.8s linear" }}
          />
        </svg>

        <div style={styles.clockCenter}>
          <span style={styles.clockTime}>{formatTime(timeLeft)}</span>
          <span style={styles.clockNote}>Demo 10s — cambia TOTAL_TIME a 1500 para 25 min</span>
        </div>
      </div>

      <div style={styles.btnRow}>
        <button
          style={{
            ...styles.btn,
            ...(isRunning ? styles.btnPause : styles.btnStart),
          }}
          onClick={toggleTimer}
        >
          {isRunning ? "⏸ Pausar" : "▶ Iniciar"}
        </button>

        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={resetTimer}>
          ↺ Reiniciar
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#161618",
    border: "1px solid #2a2a2e",
    borderRadius: 20,
    padding: "36px 32px 32px",
    width: 380,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  levelLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: 2,
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 20,
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  clockTime: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 42,
    fontWeight: 700,
    color: "#f0f0f2",
    letterSpacing: -1,
    lineHeight: 1,
  },
  clockNote: {
    fontSize: 9,
    color: "#555",
    marginTop: 6,
    textAlign: "center",
    maxWidth: 130,
    lineHeight: 1.4,
  },
  btnRow: {
    display: "flex",
    gap: 10,
    width: "100%",
    justifyContent: "center",
  },
  btn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    padding: "10px 22px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 7,
    transition: "all 0.18s",
    flex: 1,
  },
  btnStart: {
    background: "#e8533a",
    color: "white",
  },
  btnPause: {
    background: "#333",
    color: "#f0f0f2",
  },
  btnSecondary: {
    background: "#1e1e21",
    color: "#888",
    border: "1px solid #2a2a2e",
    flex: "unset",
    padding: "10px 18px",
  },
};
