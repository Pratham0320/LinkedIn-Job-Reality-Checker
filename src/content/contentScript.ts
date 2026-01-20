import { observeJobChanges } from "./domObserver"
import { extractJobSignals } from "./signalExtractor"

console.log("[Job Reality Checker] Initialized")

observeJobChanges((jobId) => {
  console.log("Job change detected, waiting for DOM stabilization...")

  setTimeout(() => {
    try {
      const signals = extractJobSignals()

      console.log("New job detected")
      console.log("Job ID:", jobId)
      console.log("Signals:", signals)
    } catch (err) {
      console.error("[Job Reality Checker] Signal extraction failed", err)
    }
  }, 800) // critical delay
})
