import type { JobAIResult } from "../types/JobAIResult";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

export async function analyzeJobScreenshot(
  imageBase64: string,
  apiKey: string
): Promise<JobAIResult> {
  const prompt = `
You are analyzing a screenshot of a LinkedIn job posting.

Extract ONLY the following fields.
If a field is not clearly visible, return null.
Do NOT guess.

Return STRICT JSON matching this schema:

{
  "title": string | null,
  "company": string | null,
  "location": string | null,
  "postedText": string | null,
  "isEasyApply": boolean,
  "isPromoted": boolean,
  "isReposted": boolean,
  "companyVerified": boolean | null,
  "seniorityLevel": "Intern" | "Junior" | "Mid" | "Senior" | "Unknown",
  "extractionConfidence": number
}

Rules:
- extractionConfidence is between 0 and 1
- If unsure → use null / false
- No explanations, no markdown, JSON only
`;

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/png",
                data: imageBase64,
              },
            },
          ],
        },
      ],
    }),
  });

  const json = await res.json();

  const rawText =
    json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini returned empty response");
  }

  try {
    return JSON.parse(rawText) as JobAIResult;
  } catch {
    throw new Error("Gemini response was not valid JSON");
  }
}
