import { z } from "zod";

export const CFOBriefingSchema = z.object({
  executiveSummary: z.string(),

  projectMarginRisks: z.array(
    z.object({
      projectId: z.string(),
      riskLevel: z.enum(["low", "medium", "high"]),
      explanation: z.string()
    })
  ),

  overdueReceivables: z.array(
    z.object({
      invoiceId: z.string(),
      daysOverdue: z.number(),
      riskLevel: z.enum(["low", "medium", "high"])
    })
  ),

  confidenceScore: z.number().min(0).max(1)
});

export type CFOBriefing = z.infer<typeof CFOBriefingSchema>;
