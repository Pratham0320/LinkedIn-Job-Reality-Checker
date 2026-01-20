import { resolveCurrentJobId } from "./jobIdentity"

export function observeJobChanges(
  onJobChange: (jobId: string) => void
) {
  let lastJobId: string | null = null

  const check = () => {
    const currentJobId = resolveCurrentJobId()
    if (!currentJobId) return

    if (currentJobId !== lastJobId) {
      lastJobId = currentJobId
      onJobChange(currentJobId)
    }
  }

  // Initial
  check()

  // URL changes via SPA
  const observer = new MutationObserver(() => check())

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
