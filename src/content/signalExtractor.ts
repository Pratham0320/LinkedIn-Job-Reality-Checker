export interface JobSignals {
  title: string | null
  company: string | null
  location: string | null
  postedText: string | null
  applicantCount: number | null
}

function getMetaLine(): string | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>("span, div")
  )

  for (const el of candidates) {
    const text = el.textContent?.trim()
    if (!text) continue

    // Typical LinkedIn meta line pattern
    if (
      text.includes("·") &&
      (text.toLowerCase().includes("applicant") ||
       text.toLowerCase().includes("ago"))
    ) {
      return text
    }
  }

  return null
}

function extractApplicantCount(meta: string | null): number | null {
  if (!meta) return null

  // Handle "Over 100 applicants"
  const overMatch = meta.match(/over\s+(\d+)/i)
  if (overMatch) return Number(overMatch[1])

  // Handle "123 applicants"
  const exactMatch = meta.match(/(\d+)\s+applicant/i)
  if (exactMatch) return Number(exactMatch[1])

  return null
}

export function extractJobSignals(): JobSignals {
  const meta = getMetaLine()

  return {
    title: document.querySelector("h1")?.textContent?.trim() || null,

    company:
      document.querySelector('a[href*="/company/"]')?.textContent?.trim() ||
      null,

    location: meta ? meta.split("·")[0].trim() : null,

    postedText: meta
      ? meta.split("·").find(p => p.toLowerCase().includes("ago"))?.trim() || null
      : null,

    applicantCount: extractApplicantCount(meta)
  }
}
