# Ejercicio de Hooks — Pomodoro Timer

Ejercicio práctico para aprender a usar **useState**, **useEffect** y **useRef** en React mediante la construcción de un Pomodoro Timer con 3 niveles de dificultad.


## Niveles

### Nivel 1 — Guiado (`PomodoroN1.jsx`)
Timer básico de cuenta regresiva.

Lo que se practica:
- `useState` para `timeLeft` e `isRunning`
- `useRef` para guardar el ID del intervalo sin re-renders
- `useEffect` con `setInterval` + `clearInterval` en el cleanup
- Formatear segundos a `MM:SS` con `Math.floor` y `padStart`
- Botones de Iniciar/Pausar y Reiniciar

### Nivel 2 — Semi-guiado (`PomodoroN2.jsx`)
Agrega modos de trabajo y descanso, más un historial de sesiones.

Lo que se practica:
- Estado `mode` que alterna entre `"work"` y `"break"` automáticamente
- Estado `sessions` (array) con las sesiones completadas
- Dos `useEffect` separados con responsabilidades distintas: uno para el intervalo, otro para detectar cuándo llegó a cero
- Actualizar arrays de estado con spread `[...prev, nuevo]` sin mutar el original
- Renderizar el historial con `sessions.map()`

### Nivel 3 — Reto (`PomodoroN3.jsx`)
Versión completa con configuración, barra de progreso, sonido, estadísticas y guardado parcial.

Lo que se practica:
- Inputs configurables de minutos (trabajo/descanso) deshabilitados mientras corre el timer
- Tercer `useEffect` que sincroniza `timeLeft` cuando cambia la configuración y el timer está detenido
- Barra de progreso con la fórmula `((total - timeLeft) / total) * 100`
- Sonido al completar sesión con `new Audio(...).play()` dentro de un `try/catch`
- Estadísticas derivadas calculadas con `.filter()` y `.reduce()` — sin estado extra
- Guardar sesión parcial sin detener el timer (registra el tiempo transcurrido hasta ese momento)

---

## Archivos

```
ejercicio1.jsx   →   Nivel 1 (guiado)
ejercicio2.jsx   →   Nivel 2 (semi-guiado)
ejercicio3.jsx   →   Nivel 3 (reto)
http://localhost:5174/ →   Demo visual con los 3 niveles integrados
```

---

## Link del video 

[text](https://youtu.be/JfCJlQm8Otw)
