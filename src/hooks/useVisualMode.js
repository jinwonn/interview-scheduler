import { useState } from "react"

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial])

  const transition = (initial) => {
    setMode(initial)
    const newHistory = history
    newHistory.push(initial)
    setHistory(newHistory)
  };

  const back = () => {
    if (history.length === 1) return;
    const previousMode = history[history.length - 2]
    const newHistory = history

    newHistory.pop()
    setHistory(newHistory)
    
    setMode(previousMode)
  }

  return {mode, transition, back};
}