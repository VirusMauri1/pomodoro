import { useState, useEffect, useRef } from "react";

export default function PomodoroN3() {
  const [workMins,  setWorkMins]  = useState(25); 
  const [breakMins, setBreakMins] = useState(5);  

  const [timeLeft,  setTimeLeft]  = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode,      setMode]      = useState("work");
  const [sessions,  setSessions]  = useState([]);

  const [flash, setFlash] = useState(false); 

  const intervalRef = useRef(null);

  const workSecs  = workMins  * 60;
  const breakSecs = breakMins * 60;
  const totalSecs = mode === "work" ? workSecs : breakSecs;

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
      try {
        new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
      } catch (e) {
        console.warn("No se pudo reproducir el sonido:", e);
      }

      setFlash(true);
      setTimeout(() => setFlash(false), 2500);

      if (mode === "work") {
        setSessions(prev => [
          ...prev,
          {
            id:          Date.now(),
            type:        "work",
            duration:    workSecs,
            completedAt: new Date(),
          },
        ]);
      }

      const nextMode = mode === "work" ? "break" : "work";
      const nextTime = nextMode === "work" ? workSecs : breakSecs;
      setMode(nextMode);
      setTimeLeft(nextTime);
      setIsRunning(true);
    }
  }, [timeLeft]); 

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(mode === "work" ? workMins * 60 : breakMins * 60);
    }
  }, [workMins, breakMins]); 

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const toggleTimer = () => setIsRunning(prev => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(workMins * 60);
    setSessions([]);
  };

  const savePartial = () => {
    const elapsed = totalSecs - timeLeft;
    if (elapsed === 0) return; 

    setSessions(prev => [
      ...prev,
      {
        id:          Date.now(),
        type:        mode === "work" ? "work (parcial)" : "break (parcial)",
        duration:    elapsed,
        completedAt: new Date(),
      },
    ]);
  };

  const adjustMin = (setter, current, delta) => {
    const next = Math.max(1, Math.min(60, current + delta));
    setter(next);
  };

  const workSessions  = sessions.filter(s => s.type === "work");
  const totalWorkSecs = sessions.reduce(
    (acc, s) => (s.type === "work" ? acc + s.duration : acc),
    0
  );

  const progress   = totalSecs > 0 ? ((totalSecs - timeLeft) / totalSecs) * 100 : 0;
  const ringColor  = mode === "work" ? "#e8533a" : "#3acea0";
  const modeColors = {
    bg:    mode === "work" ? "rgba(232,83,58,0.15)"  : "rgba(58,206,160,0.15)",
    text:  mode === "work" ? "#e8533a"               : "#3acea0",
    dot:   mode === "work" ? "#e8533a"               : "#3acea0",
  };

  const radius = 82;
  const circ   = 2 * Math.PI * radius;
  const offset = circ * (timeLeft / (totalSecs || 1));

  return (
    <div style={styles.wrapper}>

      <div style={{
        ...styles.flash,
        transform: flash
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-80px)",
      }}>
        ✓ ¡Sesión completada!
      </div>

      <div style={styles.card}>
        <p style={styles.levelLabel}>Nivel 3 — Reto</p>

        <div style={styles.configRow}>
          <ConfigGroup
            label="Trabajo (min)"
            value={workMins}
            disabled={isRunning}
            onUp={()   => adjustMin(setWorkMins,  workMins,  1)}
            onDown={()  => adjustMin(setWorkMins,  workMins, -1)}
          />
          <ConfigGroup
            label="Descanso (min)"
            value={breakMins}
            disabled={isRunning}
            onUp={()   => adjustMin(setBreakMins, breakMins,  1)}
            onDown={()  => adjustMin(setBreakMins, breakMins, -1)}
          />
        </div>

        <div style={{ ...styles.modeBadge, background: modeColors.bg, color: modeColors.text }}>
          <span style={{ ...styles.modeDot, background: modeColors.dot }} />
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

        <div style={styles.progressWrap}>
          <div
            style={{
              ...styles.progressFill,
              width:      `${progress}%`,
              background: ringColor,
            }}
          />
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
          <button style={{ ...styles.btn, ...styles.btnSave }} onClick={savePartial}>
            💾 Guardar parcial
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={{ ...styles.statVal, color: "#e8533a" }}>{workSessions.length}</div>
            <div style={styles.statLabel}>Sesiones</div>
          </div>
          <div style={styles.statBox}>
            <div style={{ ...styles.statVal, color: "#3acea0" }}>{formatTime(totalWorkSecs)}</div>
            <div style={styles.statLabel}>Tiempo total</div>
          </div>
        </div>
      </div>

      {sessions.length > 0 && (
        <div style={styles.sessionWrap}>
          <p style={styles.sessionTitle}>Historial de sesiones</p>
          <div style={styles.sessionList}>
            {sessions.map((s, i) => {
              const isPartial = s.type.includes("parcial");
              const isWork    = s.type.includes("work");
              const badgeStyle = isPartial
                ? { background: "rgba(91,141,238,0.15)", color: "#5b8dee" }
                : isWork
                  ? { background: "rgba(232,83,58,0.15)", color: "#e8533a" }
                  : { background: "rgba(58,206,160,0.15)", color: "#3acea0" };

              return (
                <div key={s.id} style={styles.sessionItem}>
                  <span style={styles.sessionNum}>#{i + 1}</span>
                  <span style={{ ...styles.sessionBadge, ...badgeStyle }}>{s.type}</span>
                  <span style={styles.sessionDur}>{formatTime(s.duration)}</span>
                  <span style={styles.sessionTime}>
                    {s.completedAt.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigGroup({ label, value, disabled, onUp, onDown }) {
  return (
    <div style={cStyles.group}>
      <span style={cStyles.label}>{label}</span>
      <div style={cStyles.inputRow}>
        <span style={cStyles.val}>{value}</span>
        <div style={cStyles.spin}>
          <button style={cStyles.spinBtn} onClick={onUp}   disabled={disabled}>▲</button>
          <button style={cStyles.spinBtn} onClick={onDown}  disabled={disabled}>▼</button>
        </div>
      </div>
    </div>
  );
}

const cStyles = {
  group:    { flex: 1, display: "flex", flexDirection: "column", gap: 5 },
  label:    { fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#888", letterSpacing: 1, textTransform: "uppercase" },
  inputRow: { display: "flex", alignItems: "center", background: "#1e1e21", border: "1px solid #2a2a2e", borderRadius: 8, overflow: "hidden" },
  val:      { fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: "#f0f0f2", flex: 1, textAlign: "center", padding: "6px 0" },
  spin:     { display: "flex", flexDirection: "column" },
  spinBtn:  { width: 26, height: 18, background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" },
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
  },
  flash: {
    position: "fixed",
    top: 24,
    left: "50%",
    background: "#3acea0",
    color: "#0a2a1e",
    padding: "12px 24px",
    borderRadius: 50,
    fontWeight: 600,
    fontSize: 14,
    transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
    zIndex: 9999,
    pointerEvents: "none",
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
  configRow:  { display: "flex", gap: 16, width: "100%", marginBottom: 20 },
  modeBadge: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 16px", borderRadius: 50,
    fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
    letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16,
  },
  modeDot:    { width: 7, height: 7, borderRadius: "50%" },
  clockWrap: {
    position: "relative", width: 190, height: 190, margin: "8px 0 16px",
  },
  clockCenter: {
    position: "absolute", inset: 0, display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  clockTime: {
    fontFamily: "'Space Mono', monospace", fontSize: 42,
    fontWeight: 700, color: "#f0f0f2", letterSpacing: -1,
  },
  progressWrap: {
    width: "100%", height: 4, background: "#1e1e21",
    borderRadius: 4, marginBottom: 20, overflow: "hidden",
  },
  progressFill: {
    height: "100%", borderRadius: 4, transition: "width 0.8s linear, background 0.4s",
  },
  btnRow:       { display: "flex", gap: 10, width: "100%", flexWrap: "wrap" },
  btn: {
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
    padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer",
    flex: 1, minWidth: 80,
  },
  btnStart:     { background: "#e8533a", color: "white" },
  btnPause:     { background: "#333",    color: "#f0f0f2" },
  btnSecondary: { background: "#1e1e21", color: "#888", border: "1px solid #2a2a2e" },
  btnSave:      { background: "rgba(91,141,238,0.15)", color: "#5b8dee", border: "1px solid rgba(91,141,238,0.25)" },
  statsRow:     { display: "flex", gap: 12, width: "100%", marginTop: 20 },
  statBox: {
    flex: 1, background: "#1e1e21", border: "1px solid #2a2a2e",
    borderRadius: 10, padding: 12, textAlign: "center",
  },
  statVal:   { fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700 },
  statLabel: { fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginTop: 3 },
  sessionWrap:  { width: 380 },
  sessionTitle: {
    fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2,
    color: "#555", textTransform: "uppercase", marginBottom: 10,
  },
  sessionList: {
    display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto",
  },
  sessionItem: {
    display: "flex", alignItems: "center", gap: 12,
    background: "#161618", border: "1px solid #2a2a2e",
    borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f0f0f2",
  },
  sessionNum:   { fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#555", minWidth: 22 },
  sessionBadge: { fontSize: 11, padding: "2px 8px", borderRadius: 50, fontFamily: "'Space Mono', monospace", flex: 1 },
  sessionDur:   { fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#888" },
  sessionTime:  { fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#555" },
};
