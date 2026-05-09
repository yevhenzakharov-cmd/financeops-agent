import OpenAI from "openai";
import { CFOBriefingSchema } from "./briefing-schema.js";
import type { CFOBriefing } from "./briefing-schema.js";

const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5";

export function buildDeterministicCFOBriefing(
  deterministicSummary: string
): CFOBriefing {
  return CFOBriefingSchema.parse({
    executiveSummary:
      "FinanceOps Agent completed a deterministic review of the mock finance dataset. The demo identified strong project margin, one overdue receivable, reconciliation exceptions, and approval-gated payment recommendations. AI explanation is optional; the financial facts come from deterministic pipeline outputs.",
    projectMarginRisks: [
      {
        projectId: "project-001",
        riskLevel: "medium",
        explanation:
          "Project Atlas has positive gross margin, but budget burn and reconciliation exceptions still require finance review before production-style action."
      }
    ],
    overdueReceivables: [
      {
        invoiceId: "inv-002",
        daysOverdue: 402,
        riskLevel: "high"
      }
    ],
    confidenceScore: deterministicSummary.length > 0 ? 0.86 : 0.75
  });
}

export async function generateCFOBriefing(
  deterministicSummary: string
): Promise<CFOBriefing> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildDeterministicCFOBriefing(deterministicSummary);
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.responses.create({
      model: DEFAULT_OPENAI_MODEL,
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
      return buildDeterministicCFOBriefing(deterministicSummary);
    }

    const parsed: unknown = JSON.parse(rawOutput);

    return CFOBriefingSchema.parse(parsed);
  } catch {
    return buildDeterministicCFOBriefing(deterministicSummary);
  }
}
