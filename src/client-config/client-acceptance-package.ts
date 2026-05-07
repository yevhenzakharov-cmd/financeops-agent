import { buildClientAcceptanceCriteriaReport } from "./client-acceptance-criteria.js";
import { buildClientBuildPackage } from "./client-build-package.js";
import { buildClientDemoScript } from "./client-demo-script.js";
import { buildClientTestScenarioPack } from "./client-test-scenarios.js";

export interface ClientAcceptancePackage {
  title: string;
  generatedAt: string;
  status: "accepted" | "accepted_with_warnings" | "blocked";
  clientName: string;
  summary: string;
  acceptanceCriteria: ReturnType<typeof buildClientAcceptanceCriteriaReport>;
  testScenarios: ReturnType<typeof buildClientTestScenarioPack>;
  demoScript: ReturnType<typeof buildClientDemoScript>;
  buildPackage: ReturnType<typeof buildClientBuildPackage>;
  handoffDecision: string;
}

export function buildClientAcceptancePackage(): ClientAcceptancePackage {
  const acceptanceCriteria = buildClientAcceptanceCriteriaReport();
  const testScenarios = buildClientTestScenarioPack();
  const demoScript = buildClientDemoScript();
  const buildPackage = buildClientBuildPackage();

  const status =
    acceptanceCriteria.overallStatus === "blocked"
      ? "blocked"
      : acceptanceCriteria.overallStatus === "warning"
        ? "accepted_with_warnings"
        : "accepted";

  const handoffDecision =
    status === "blocked"
      ? "Do not move to production build until blocked acceptance criteria are resolved."
      : status === "accepted_with_warnings"
        ? "Can proceed to mapping or limited pilot planning with documented warnings."
        : "Ready to proceed to implementation planning.";

  return {
    title: "Client Acceptance Package",
    generatedAt: new Date().toISOString(),
    status,
    clientName: buildPackage.clientName,
    summary:
      "Acceptance handoff combining demo script, scenario tests, acceptance criteria, and build package.",
    acceptanceCriteria,
    testScenarios,
    demoScript,
    buildPackage,
    handoffDecision
  };
}
