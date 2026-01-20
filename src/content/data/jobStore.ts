export interface RawJobPayload {
  jobId: string
  raw: any
}

const store = new Map<string, any>();

export function saveJobData(jobId: string, data: any) {
  store.set(jobId, data);
}

export function getJobData(jobId: string) {
  return store.get(jobId) || null;
}
