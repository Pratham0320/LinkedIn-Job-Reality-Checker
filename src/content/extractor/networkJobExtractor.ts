export interface JobSignals {
  title: string | null
  company: string | null
  location: string | null
  postedText: string | null
  applicantCount: number | null
  reposted: boolean
  promoted: boolean
}

export function extractFromNetwork(raw: any): JobSignals {
  const job = raw?.data?.jobPosting;

  if (!job) {
    return {
      title: null,
      company: null,
      location: null,
      postedText: null,
      applicantCount: null,
      reposted: false,
      promoted: false,
    };
  }

  return {
    title: job.title ?? null,
    company: job.companyDetails?.company?.name ?? null,
    location: job.formattedLocation ?? null,
    postedText: job.listedAt ? new Date(job.listedAt).toISOString() : null,
    applicantCount: job.applies?.numApplied ?? null,
    reposted: Boolean(job.reposted),
    promoted: Boolean(job.promoted),
  };
}
