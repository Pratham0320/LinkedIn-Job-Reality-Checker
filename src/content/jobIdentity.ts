export function resolveCurrentJobId(): string | null {
  const url = new URL(window.location.href)

  // Case 1: collections pages
  const fromQuery = url.searchParams.get("currentJobId")
  if (fromQuery) return fromQuery

  // Case 2: direct job view
  const match = url.pathname.match(/\/jobs\/view\/(\d+)/)
  if (match) return match[1]

  return null
}
