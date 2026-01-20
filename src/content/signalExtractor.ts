export interface JobSignals {
  title: string | null
  company: string | null
  location: string | null
  postedText: string | null
  applicantCount: number | null
  exposedFields: {
    company: boolean
    location: boolean
    applicantCount: boolean
  }
}

function getText(el: Element | null) {
  return el?.textContent?.trim() || null
}

function extractApplicantCount(): number | null {
  const el = document.querySelector(
    '[aria-label*="people clicked apply"], [aria-label*="applicant"]'
  )

  const label = el?.getAttribute("aria-label")
  if (!label) return null

  const match = label.match(/(\d+)/)
  return match ? Number(match[1]) : null
}
function extractMeta(): {
  location: string | null
  postedText: string | null
} {
  const spans = Array.from(
    document.querySelectorAll(
      ".jobs-unified-top-card__primary-description span"
    )
  )

  let location = null
  let postedText = null

  for (const s of spans) {
    const t = s.textContent?.trim()
    if (!t) continue

    if (!postedText && /(ago|reposted)/i.test(t)) {
      postedText = t
    }

    if (
      !location &&
      /(india|remote|canada|germany|united)/i.test(t)
    ) {
      location = t
    }
  }

  return { location, postedText }
}

export function extractJobSignals(): JobSignals {
  const title = document.querySelector("h1")?.textContent?.trim() || null

  const company =
    document
      .querySelector('h4 a span, a[href*="/company/"] span')
      ?.textContent?.trim() || null

  const { location, postedText } = extractMeta()
  const applicantCount = extractApplicantCount()

  return {
    title,
    company,
    location,
    postedText,
    applicantCount,
    exposedFields: {
      company: company !== null,
      location: location !== null,
      applicantCount: applicantCount !== null
    }
  }
}
