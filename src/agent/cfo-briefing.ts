import OpenAI from "openai";
import { CFOBriefingSchema, CFOBriefing } from "./briefing-schema.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateCFOBriefing(
  deterministicSummary: string
): Promise<CFOBriefing> {

  const response = await openai.responses.create({
    model: "gpt-5.5",
    input: `
You are a CFO-level financial analyst operating inside a governed finance system.

Return ONLY valid JSON.

The JSON structure MUST match exactly:

{
  "executiveSummary": string,
  "projectMarginRisks": [
    {
      "projectId": string,
      "riskLevel": "low" | "medium" | "high",
      "explanation": string
    }
  ],
  "overdueReceivables": [
    {
      "invoiceId": string,
      "daysOverdue": number,
      "riskLevel": "low" | "medium" | "high"
    }
  ],
  "confidenceScore": number
}

Rules:
- Do NOT include markdown
- Do NOT include commentary
- Confidence must be between 0 and 1

Financial Data:
${deterministicSummary}
`
  });

  const rawOutput = response.output_text;

  if (!rawOutput) {
    throw new Error("AI returned empty response");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawOutput);
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  return CFOBriefingSchema.parse(parsed);
}
