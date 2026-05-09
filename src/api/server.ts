import fs from "fs";
import "dotenv/config";
import express from "express";
import { mockClientContract } from "../client-config/mock-client-contract.js";
import { summarizeClientImplementationContract } from "../client-config/client-contract-summary.js";
import { validateClientImplementationContract } from "../client-config/client-contract-validator.js";
import { buildClientAdapterPlan } from "../client-config/client-input-mapping-service.js";
import { buildClientOutputPlan } from "../client-config/client-output-plan-service.js";
import { buildClientImplementationPlan } from "../client-config/client-implementation-plan.js";
import { mockClientRequirementsIntake } from "../client-config/mock-client-requirements-intake.js";
import { buildClientRequirementsPlan } from "../client-config/client-requirements-plan.js";
import { validateClientRequirementsIntake } from "../client-config/client-requirements-validator.js";
import { buildClientOnboardingChecklist } from "../client-config/client-onboarding-checklist.js";
import {
  buildClientDataRequestPacket,
  buildClientGovernanceBrief,
  buildClientImplementationReadiness,
  buildClientOnboardingQuestionnaire,
  evaluateClientFieldCoverage,
  mockClientReadinessFixture,
  analyzeClientInputFieldCoverage,
  evaluateClientImplementationReadiness,
  buildClientAdapterBlueprint,
  buildClientBuildPackage,
  buildClientDeploymentChecklist,
  buildClientOutputDeliveryPlan,
  buildClientAcceptanceCriteriaReport,
  buildClientAcceptancePackage,
  buildClientDemoScript,
  buildClientTestScenarioPack,
  buildClientPilotPlan,
  buildClientPilotRiskRegister,
  buildClientPilotScope,
  buildClientPilotSuccessMetrics,
  buildClientProductionDemoScript,
  buildClientProductionHandoffPackage,
  buildClientProductionHandoffPlan,
  buildClientProductionHandoffRiskReport,
  buildClientProductionPrerequisites,
  buildClientGoLiveChecklist,
  buildClientGoLiveDecision,
  buildClientGoLivePackage,
  buildClientGoLiveRiskReport,
  buildClientLaunchBrief,
  buildClientBuyerBrief,
  buildClientCommercialPackage,
  buildClientCommercialReadinessScore,
  buildClientCommercialValueHypothesis,
  buildClientObjectionHandlingGuide,
  buildClientRoiModel,
  buildClientCommercialSummary,
  getClientSalesNarrative,
  getClientDemoAgenda,
  getClientFollowUpEmail,
  getClientBuyerFaq,
  getClientSalesHandoffPackage,
  buildClientReviewerAudit,
  buildClientReviewerDashboard,
  buildClientSampleInputFixtures,
  buildClientSecurityBoundary,
  buildClientValidationMatrix,
  buildClientPluginContractsPackage,
  validateClientPluginContractsPackage
} from "../client-config/index.js";
import { buildClientImplementationManifest, summarizeClientImplementationManifest, validateClientImplementationManifest } from "../client-config/client-implementation-manifest.js";
import { buildClientWorkOrder, summarizeClientWorkOrder, validateClientWorkOrder } from "../client-config/client-work-order.js";
import { buildClientRepoStarterPackage, summarizeClientRepoStarterPackage, validateClientRepoStarterPackage } from "../client-config/client-repo-starter.js";
import { buildClientAdapterRegistry, summarizeClientAdapterRegistry, validateClientAdapterRegistry } from "../client-config/client-adapter-registry.js";
import { buildClientImplementationRoadmap, summarizeClientImplementationRoadmap, validateClientImplementationRoadmap } from "../client-config/client-implementation-roadmap.js";
import { buildClientDeploymentProfile, summarizeClientDeploymentProfile, validateClientDeploymentProfile } from "../client-config/client-deployment-profile.js";
import { buildClientAcceptanceGate, summarizeClientAcceptanceGate, validateClientAcceptanceGate } from "../client-config/client-acceptance-gate.js";
import { buildClientDeliveryPackage, summarizeClientDeliveryPackage, validateClientDeliveryPackage } from "../client-config/client-delivery-package.js";
import { buildClientEnterpriseSalesBrief, summarizeClientEnterpriseSalesBrief, validateClientEnterpriseSalesBrief } from "../client-config/client-enterprise-sales-brief.js";
import { buildClientEnterpriseRedTeamReport, summarizeClientEnterpriseRedTeamReport, validateClientEnterpriseRedTeamReport } from "../client-config/client-enterprise-red-team.js";
import { buildClientDueDiligencePack, summarizeClientDueDiligencePack, validateClientDueDiligencePack } from "../client-config/client-due-diligence-pack.js";
import { buildClientControlMatrix, summarizeClientControlMatrix, validateClientControlMatrix } from "../client-config/client-control-matrix.js";
import { buildClientEvidenceBinder, summarizeClientEvidenceBinder, validateClientEvidenceBinder } from "../client-config/client-evidence-binder.js";
import { buildClientPilotDecisionPacket, summarizeClientPilotDecisionPacket, validateClientPilotDecisionPacket } from "../client-config/client-pilot-decision-packet.js";
import { buildClientPilotKickoffPackage, summarizeClientPilotKickoffPackage, validateClientPilotKickoffPackage } from "../client-config/client-pilot-kickoff-package.js";
import { buildClientPilotSowPackage, summarizeClientPilotSowPackage, validateClientPilotSowPackage } from "../client-config/client-pilot-sow-package.js";

import { getExecutionMode } from "../execution/execution-mode.js";
import { runFinanceOpsPipeline } from "../pipeline/run-financeops-pipeline.js";
import { executeApprovedPayment } from "../payments/payment-execution-service.js";
import { getLatestOutputArtifactPath } from "../output-adapters/output-artifact-store.js";
import { ARTIFACT_PATHS } from "./artifact-paths.js";
import { getArtifactApiSurfaceSummary, getArtifactAuditDigest, getArtifactCompactRows, getArtifactCompactTableCsv, getArtifactCompactTableMarkdown, getArtifactCountByAvailability, getArtifactDataTypeMap, getArtifactDataTypes, getArtifactDiagnostics, getArtifactExistenceMap, getArtifactGeneratedAtMap, getArtifactManifest, getArtifactNamesCsv, getArtifactNamesText, getArtifactOperationalSummary, getArtifactPathMap, getArtifactPreviewMap, getArtifactReadinessReport, getArtifactRegistryEnvelope, getArtifactRegistrySnapshot, getArtifactRegistryVersion, getArtifactReportHeader, getArtifactRouteCatalog, getArtifactSizeMap, getArtifactSummaryMap, getAvailableArtifactNames, getAverageArtifactSizeBytes, getLargestArtifactSummary, getMissingArtifactNames, getSmallestArtifactSummary, getTotalArtifactSizeBytes, isArtifactName, listArtifactMetadata, readArtifactByName, summarizeAllArtifacts } from "./artifact-read-service.js";
import { persistApiResponse } from "./api-output-writer.js";
import { registerStandardApiErrorHandlers } from "./error-response.js";
import { buildDemoAuthStatus, requireDemoApiKey } from "./demo-auth.js";
import { buildAuditVisibilityPackage, getAuditHealth, summarizeLatestAuditLog } from "./audit-read-service.js";
import { buildApiInventoryPackage, getApiInventoryRoutes } from "./api-inventory-service.js";
import { buildOpenApiDocument } from "./openapi-service.js";
import { buildRequestObservabilitySummary, createRequestObservabilityMiddleware, getRecentRequestObservations } from "./request-observability.js";
import { buildDemoRateLimitMiddleware, buildSecurityHeadersMiddleware, securityStatusHandler } from "./security-middleware.js";

const app = express();

app.disable("x-powered-by");
app.use(buildSecurityHeadersMiddleware());
app.use(buildDemoRateLimitMiddleware());
app.use(express.json());
app.use(createRequestObservabilityMiddleware());











app.get("/client-contract/mock-client/implementation-readiness", (_req, res) => {
  res.json({
    status: "success",
    readiness: evaluateClientImplementationReadiness(mockClientContract, mockClientRequirementsIntake)
  });
});

app.get("/client-contract/mock-client/governance-brief", (_req, res) => {
  res.json({
    status: "success",
    governanceBrief: buildClientGovernanceBrief(mockClientContract, mockClientRequirementsIntake)
  });
});

app.get("/client-contract/mock-client/data-request-packet", (_req, res) => {
  res.json({
    status: "success",
    packet: buildClientDataRequestPacket(mockClientContract, mockClientRequirementsIntake)
  });
});

app.get("/client-contract/mock-client/field-coverage", (_req, res) => {
  res.json({
    status: "success",
    fieldCoverage: analyzeClientInputFieldCoverage(mockClientContract)
  });
});

app.get("/client-contract/mock-client/output-plan", (_req, res) => {
  res.json({
    status: "success",
    plan: buildClientOutputPlan(mockClientContract)
  });
});

app.get("/client-contract/mock-client/input-adapter-plan", (_req, res) => {
  res.json({
    status: "success",
    plan: buildClientAdapterPlan(mockClientContract)
  });
});

app.get("/client-contract/mock-client/implementation-plan", (_req, res) => {
  res.json({
    status: "success",
    plan: buildClientImplementationPlan(mockClientContract)
  });
});

app.get("/client-contract/mock-client/validation", (_req, res) => {
  res.json({
    status: "success",
    validation: validateClientImplementationContract(mockClientContract)
  });
});

app.get("/client-contract/mock-client/summary", (_req, res) => {
  res.json({
    status: "success",
    summary: summarizeClientImplementationContract(mockClientContract)
  });
});






app.get("/client-requirements/mock-client/questionnaire", (_req, res) => {
  res.json({
    status: "success",
    questionnaire: buildClientOnboardingQuestionnaire(mockClientContract, mockClientRequirementsIntake)
  });
});

app.get("/client-requirements/mock-client/onboarding-checklist", (_req, res) => {
  res.json({
    status: "success",
    checklist: buildClientOnboardingChecklist(mockClientRequirementsIntake)
  });
});

app.get("/client-requirements/mock-client/plan", (_req, res) => {
  res.json({
    status: "success",
    plan: buildClientRequirementsPlan(mockClientRequirementsIntake)
  });
});

app.get("/client-requirements/mock-client/validation", (_req, res) => {
  res.json({
    status: "success",
    validation: validateClientRequirementsIntake(mockClientRequirementsIntake)
  });
});

app.get("/client-requirements/mock-client", (_req, res) => {
  res.json({
    status: "success",
    requirements: mockClientRequirementsIntake
  });
});

app.get("/client-contract/mock-client", (_req, res) => {
  res.json({
    status: "success",
    contract: mockClientContract
  });
});

















app.get("/client/pilot-sow-package", (_req, res) => {
  const sowPackage = buildClientPilotSowPackage();

  res.json({
    status: "success",
    result: sowPackage
  });
});

app.get("/client/pilot-sow-package/summary", (_req, res) => {
  const sowPackage = buildClientPilotSowPackage();

  res.json({
    status: "success",
    summary: summarizeClientPilotSowPackage(sowPackage)
  });
});

app.get("/client/pilot-sow-package/validation", (_req, res) => {
  const sowPackage = buildClientPilotSowPackage();

  res.json({
    status: "success",
    validation: validateClientPilotSowPackage(sowPackage)
  });
});

app.get("/client/pilot-kickoff-package", (_req, res) => {
  const kickoffPackage = buildClientPilotKickoffPackage();

  res.json({
    status: "success",
    result: kickoffPackage
  });
});

app.get("/client/pilot-kickoff-package/summary", (_req, res) => {
  const kickoffPackage = buildClientPilotKickoffPackage();

  res.json({
    status: "success",
    summary: summarizeClientPilotKickoffPackage(kickoffPackage)
  });
});

app.get("/client/pilot-kickoff-package/validation", (_req, res) => {
  const kickoffPackage = buildClientPilotKickoffPackage();

  res.json({
    status: "success",
    validation: validateClientPilotKickoffPackage(kickoffPackage)
  });
});

app.get("/client/pilot-decision-packet", (_req, res) => {
  const packet = buildClientPilotDecisionPacket();

  res.json({
    status: "success",
    result: packet
  });
});

app.get("/client/pilot-decision-packet/summary", (_req, res) => {
  const packet = buildClientPilotDecisionPacket();

  res.json({
    status: "success",
    summary: summarizeClientPilotDecisionPacket(packet)
  });
});

app.get("/client/pilot-decision-packet/validation", (_req, res) => {
  const packet = buildClientPilotDecisionPacket();

  res.json({
    status: "success",
    validation: validateClientPilotDecisionPacket(packet)
  });
});

app.get("/client/evidence-binder", (_req, res) => {
  const binder = buildClientEvidenceBinder();

  res.json({
    status: "success",
    result: binder
  });
});

app.get("/client/evidence-binder/summary", (_req, res) => {
  const binder = buildClientEvidenceBinder();

  res.json({
    status: "success",
    summary: summarizeClientEvidenceBinder(binder)
  });
});

app.get("/client/evidence-binder/validation", (_req, res) => {
  const binder = buildClientEvidenceBinder();

  res.json({
    status: "success",
    validation: validateClientEvidenceBinder(binder)
  });
});

app.get("/client/control-matrix", (_req, res) => {
  const matrix = buildClientControlMatrix();

  res.json({
    status: "success",
    result: matrix
  });
});

app.get("/client/control-matrix/summary", (_req, res) => {
  const matrix = buildClientControlMatrix();

  res.json({
    status: "success",
    summary: summarizeClientControlMatrix(matrix)
  });
});

app.get("/client/control-matrix/validation", (_req, res) => {
  const matrix = buildClientControlMatrix();

  res.json({
    status: "success",
    validation: validateClientControlMatrix(matrix)
  });
});

app.get("/client/due-diligence-pack", (_req, res) => {
  const pack = buildClientDueDiligencePack();

  res.json({
    status: "success",
    result: pack
  });
});

app.get("/client/due-diligence-pack/summary", (_req, res) => {
  const pack = buildClientDueDiligencePack();

  res.json({
    status: "success",
    summary: summarizeClientDueDiligencePack(pack)
  });
});

app.get("/client/due-diligence-pack/validation", (_req, res) => {
  const pack = buildClientDueDiligencePack();

  res.json({
    status: "success",
    validation: validateClientDueDiligencePack(pack)
  });
});

app.get("/client/enterprise-red-team", (_req, res) => {
  const report = buildClientEnterpriseRedTeamReport();

  res.json({
    status: "success",
    result: report
  });
});

app.get("/client/enterprise-red-team/summary", (_req, res) => {
  const report = buildClientEnterpriseRedTeamReport();

  res.json({
    status: "success",
    summary: summarizeClientEnterpriseRedTeamReport(report)
  });
});

app.get("/client/enterprise-red-team/validation", (_req, res) => {
  const report = buildClientEnterpriseRedTeamReport();

  res.json({
    status: "success",
    validation: validateClientEnterpriseRedTeamReport(report)
  });
});

app.get("/client/enterprise-sales-brief", (_req, res) => {
  const brief = buildClientEnterpriseSalesBrief();

  res.json({
    status: "success",
    result: brief
  });
});

app.get("/client/enterprise-sales-brief/summary", (_req, res) => {
  const brief = buildClientEnterpriseSalesBrief();

  res.json({
    status: "success",
    summary: summarizeClientEnterpriseSalesBrief(brief)
  });
});

app.get("/client/enterprise-sales-brief/validation", (_req, res) => {
  const brief = buildClientEnterpriseSalesBrief();

  res.json({
    status: "success",
    validation: validateClientEnterpriseSalesBrief(brief)
  });
});

app.get("/client/delivery-package", (_req, res) => {
  const deliveryPackage = buildClientDeliveryPackage();

  res.json({
    status: "success",
    result: deliveryPackage
  });
});

app.get("/client/delivery-package/summary", (_req, res) => {
  const deliveryPackage = buildClientDeliveryPackage();

  res.json({
    status: "success",
    summary: summarizeClientDeliveryPackage(deliveryPackage)
  });
});

app.get("/client/delivery-package/validation", (_req, res) => {
  const deliveryPackage = buildClientDeliveryPackage();

  res.json({
    status: "success",
    validation: validateClientDeliveryPackage(deliveryPackage)
  });
});

app.get("/client/acceptance-gate", (_req, res) => {
  const gate = buildClientAcceptanceGate();

  res.json({
    status: "success",
    result: gate
  });
});

app.get("/client/acceptance-gate/summary", (_req, res) => {
  const gate = buildClientAcceptanceGate();

  res.json({
    status: "success",
    summary: summarizeClientAcceptanceGate(gate)
  });
});

app.get("/client/acceptance-gate/validation", (_req, res) => {
  const gate = buildClientAcceptanceGate();

  res.json({
    status: "success",
    validation: validateClientAcceptanceGate(gate)
  });
});

app.get("/client/deployment-profile", (_req, res) => {
  const profile = buildClientDeploymentProfile();

  res.json({
    status: "success",
    result: profile
  });
});

app.get("/client/deployment-profile/summary", (_req, res) => {
  const profile = buildClientDeploymentProfile();

  res.json({
    status: "success",
    summary: summarizeClientDeploymentProfile(profile)
  });
});

app.get("/client/deployment-profile/validation", (_req, res) => {
  const profile = buildClientDeploymentProfile();

  res.json({
    status: "success",
    validation: validateClientDeploymentProfile(profile)
  });
});

app.get("/client/implementation-roadmap", (_req, res) => {
  const roadmap = buildClientImplementationRoadmap();

  res.json({
    status: "success",
    result: roadmap
  });
});

app.get("/client/implementation-roadmap/summary", (_req, res) => {
  const roadmap = buildClientImplementationRoadmap();

  res.json({
    status: "success",
    summary: summarizeClientImplementationRoadmap(roadmap)
  });
});

app.get("/client/implementation-roadmap/validation", (_req, res) => {
  const roadmap = buildClientImplementationRoadmap();

  res.json({
    status: "success",
    validation: validateClientImplementationRoadmap(roadmap)
  });
});

app.get("/client/adapter-registry", (_req, res) => {
  const registry = buildClientAdapterRegistry();

  res.json({
    status: "success",
    result: registry
  });
});

app.get("/client/adapter-registry/summary", (_req, res) => {
  const registry = buildClientAdapterRegistry();

  res.json({
    status: "success",
    summary: summarizeClientAdapterRegistry(registry)
  });
});

app.get("/client/adapter-registry/validation", (_req, res) => {
  const registry = buildClientAdapterRegistry();

  res.json({
    status: "success",
    validation: validateClientAdapterRegistry(registry)
  });
});

app.get("/client/repo-starter", (_req, res) => {
  const starterPackage = buildClientRepoStarterPackage();

  res.json({
    status: "success",
    result: starterPackage
  });
});

app.get("/client/repo-starter/summary", (_req, res) => {
  const starterPackage = buildClientRepoStarterPackage();

  res.json({
    status: "success",
    summary: summarizeClientRepoStarterPackage(starterPackage)
  });
});

app.get("/client/repo-starter/validation", (_req, res) => {
  const starterPackage = buildClientRepoStarterPackage();

  res.json({
    status: "success",
    validation: validateClientRepoStarterPackage(starterPackage)
  });
});

app.get("/client/work-order", (_req, res) => {
  const workOrder = buildClientWorkOrder();

  res.json({
    status: "success",
    result: workOrder
  });
});

app.get("/client/work-order/summary", (_req, res) => {
  const workOrder = buildClientWorkOrder();

  res.json({
    status: "success",
    summary: summarizeClientWorkOrder(workOrder)
  });
});

app.get("/client/work-order/validation", (_req, res) => {
  const workOrder = buildClientWorkOrder();

  res.json({
    status: "success",
    validation: validateClientWorkOrder(workOrder)
  });
});

app.get("/client/implementation-manifest", (_req, res) => {
  const manifest = buildClientImplementationManifest();

  res.json({
    status: "success",
    result: manifest
  });
});

app.get("/client/implementation-manifest/summary", (_req, res) => {
  const manifest = buildClientImplementationManifest();

  res.json({
    status: "success",
    summary: summarizeClientImplementationManifest(manifest)
  });
});

app.get("/client/implementation-manifest/validation", (_req, res) => {
  const manifest = buildClientImplementationManifest();

  res.json({
    status: "success",
    validation: validateClientImplementationManifest(manifest)
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "financeops-agent",
    mode: getExecutionMode()
  });
});

app.get("/system-summary", (_req, res) => {
  res.json({
    service: "FinanceOps Agent",
    description:
      "Governed autonomous FinanceOps agent for deterministic analysis, risk classification, action simulation, policy decisions, approval routing, ledger persistence, audit tracing, and AI CFO briefing.",
    capabilities: [
      "deterministic_margin_analysis",
      "budget_burn_risk_detection",
      "overdue_receivables_detection",
      "reconciliation_exception_detection",
      "finance_exception_classification",
      "financial_intervention_simulation",
      "intelligent_strategy_selection",
      "risk_appetite_governance",
      "approval_workflow_routing",
      "execution_ledger_persistence",
      "audit_log_persistence",
      "audit_visibility_endpoints",
      "ai_cfo_briefing",
      "api_response_persistence",
      "payment_recommendation_generation",
      "human_approved_mock_payment_execution",
      "payment_execution_audit_record_persistence",
      "client_output_artifact_generation",
      "client_output_artifact_persistence",
      "artifact_status_endpoint",
      "compact_dashboard_artifact_endpoint",
      "demo_verification_artifact_status_check",
      "artifact_metadata_utility_endpoints",
      "artifact_health_summary_endpoint",
      "artifact_name_discovery_endpoints",
      "artifact_registry_snapshot_endpoint",
      "artifact_registry_summary_endpoint",
      "artifact_size_extreme_endpoints",
      "artifact_map_utility_endpoints",
      "artifact_availability_count_endpoint",
      "artifact_operational_summary_endpoint",
      "artifact_diagnostics_endpoint",
      "artifact_readiness_endpoint",
      "artifact_names_text_export_endpoint",
      "artifact_names_csv_export_endpoint",
      "artifact_generated_at_map_endpoint",
      "artifact_data_type_map_endpoint",
      "artifact_preview_map_endpoint",
      "artifact_report_header_endpoint",
      "artifact_manifest_endpoint",
      "artifact_audit_digest_endpoint",
      "artifact_table_export_endpoints",
      "artifact_route_catalog_endpoint",
      "api_inventory_endpoint",
      "openapi_contract_endpoint",
      "client_validation_matrix_endpoint",
      "client_plugin_contracts_endpoint",
      "client_security_boundary_endpoint",
      "client_sample_input_fixtures_endpoint",
      "client_reviewer_dashboard_endpoint",
      "artifact_registry_version_endpoint",
      "artifact_registry_envelope_endpoint",
      "client_contract_profile_endpoint",
      "client_contract_validation_endpoint",
      "client_implementation_plan_endpoint",
      "client_input_adapter_plan_endpoint",
      "client_output_plan_endpoint",
      "client_requirements_intake_endpoint",
      "client_requirements_validation_endpoint",
      "client_requirements_plan_endpoint",
      "client_onboarding_checklist_endpoint",
      "client_onboarding_questionnaire_endpoint",
      "client_data_request_packet_endpoint",
      "client_field_coverage_endpoint",
      "client_governance_brief_endpoint",
      "client_implementation_readiness_endpoint",
      "client_implementation_manifest_endpoint"
    ],
    executionMode: getExecutionMode()
  });
});

app.post("/run-financeops-agent", requireDemoApiKey, async (_req, res) => {
  try {
    const result = await runFinanceOpsPipeline();

    const responseBody = {
      status: "success",
      result
    };

    persistApiResponse(responseBody);

    res.json(responseBody);
  } catch (error) {
    const responseBody = {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    };

    persistApiResponse(responseBody);

    res.status(500).json(responseBody);
  }
});

app.post("/payments/:paymentRecommendationId/approve-and-send", requireDemoApiKey, async (req, res) => {
  try {
    const result = await runFinanceOpsPipeline();
    const paymentRecommendation = result.paymentRecommendations.find(
      (recommendation) =>
        recommendation.id === req.params.paymentRecommendationId
    );

    if (!paymentRecommendation) {
      return res.status(404).json({
        status: "error",
        message: "Payment recommendation not found"
      });
    }

    const approvedBy =
      typeof req.body?.approvedBy === "string"
        ? req.body.approvedBy
        : "demo-controller";

    const idempotencyKey =
      typeof req.body?.idempotencyKey === "string"
        ? req.body.idempotencyKey
        : undefined;

    const executionResult = await executeApprovedPayment({
      recommendation: paymentRecommendation,
      approvedBy,
      approvalId: `approval-for-${paymentRecommendation.id}`,
      idempotencyKey
    });

    const responseBody = {
      status: "success",
      paymentRecommendation,
      executionResult
    };

    persistApiResponse(responseBody);

    return res.json(responseBody);
  } catch (error) {
    const responseBody = {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    };

    persistApiResponse(responseBody);

    return res.status(500).json(responseBody);
  }
});

const port = Number(process.env.PORT ?? 3001);











app.get("/openapi.json", (_req, res) => {
  res.json(buildOpenApiDocument());
});

app.get("/observability/request-summary", (_req, res) => {
  res.json({
    status: "success",
    result: buildRequestObservabilitySummary()
  });
});

app.get("/observability/recent-requests", (_req, res) => {
  res.json({
    status: "success",
    requests: getRecentRequestObservations(20)
  });
});

app.get("/api/inventory", (_req, res) => {
  res.json({
    status: "success",
    result: buildApiInventoryPackage()
  });
});

app.get("/api/routes", (_req, res) => {
  res.json({
    status: "success",
    routes: getApiInventoryRoutes()
  });
});

app.get("/audit/health", (_req, res) => {
  res.json({
    status: "success",
    health: getAuditHealth()
  });
});

app.get("/audit/summary", (_req, res) => {
  const summary = summarizeLatestAuditLog();

  res.json({
    status: summary ? "success" : "missing",
    summary
  });
});

app.get("/audit/visibility", (_req, res) => {
  res.json({
    status: "success",
    result: buildAuditVisibilityPackage()
  });
});

app.get("/security/http-hardening", securityStatusHandler);

app.get("/security/demo-auth-status", (_req, res) => {
  res.json({
    status: "success",
    auth: buildDemoAuthStatus()
  });
});

app.get("/artifacts", (_req, res) => {
  res.json({
    status: "success",
    artifacts: Object.entries(ARTIFACT_PATHS).map(([name, artifactPath]) => ({
      name,
      path: artifactPath
    }))
  });
});
















app.get("/artifacts/average-size", (_req, res) => {
  res.json({
    status: "success",
    averageSizeBytes: getAverageArtifactSizeBytes()
  });
});

app.get("/artifacts/smallest", (_req, res) => {
  res.json({
    status: "success",
    artifact: getSmallestArtifactSummary()
  });
});

app.get("/artifacts/largest", (_req, res) => {
  res.json({
    status: "success",
    artifact: getLargestArtifactSummary()
  });
});









app.get("/artifacts/readiness", (_req, res) => {
  res.json({
    status: "success",
    readiness: getArtifactReadinessReport()
  });
});

app.get("/artifacts/diagnostics", (_req, res) => {
  res.json({
    status: "success",
    diagnostics: getArtifactDiagnostics()
  });
});

app.get("/artifacts/operational-summary", (_req, res) => {
  res.json({
    status: "success",
    summary: getArtifactOperationalSummary()
  });
});






app.get("/artifacts/report-header", (_req, res) => {
  res.json({
    status: "success",
    report: getArtifactReportHeader()
  });
});

app.get("/artifacts/preview-map", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactPreviewMap()
  });
});

app.get("/artifacts/data-types", (_req, res) => {
  res.json({
    status: "success",
    dataTypes: getArtifactDataTypes()
  });
});

app.get("/artifacts/data-type-map", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactDataTypeMap()
  });
});

app.get("/artifacts/generated-at-map", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactGeneratedAtMap()
  });
});

app.get("/artifacts/availability-counts", (_req, res) => {
  res.json({
    status: "success",
    counts: getArtifactCountByAvailability()
  });
});

app.get("/artifacts/size-map", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactSizeMap()
  });
});

app.get("/artifacts/path-map", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactPathMap()
  });
});

app.get("/artifacts/existence-map", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactExistenceMap()
  });
});

app.get("/artifacts/summary-map", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactSummaryMap()
  });
});

app.get("/artifacts/size", (_req, res) => {
  res.json({
    status: "success",
    totalSizeBytes: getTotalArtifactSizeBytes()
  });
});

app.get("/artifacts/registry/summary", (_req, res) => {
  const registry = getArtifactRegistrySnapshot();

  res.json({
    status: "success",
    summary: {
      totalArtifacts: registry.totalArtifacts,
      availableArtifacts: registry.availableArtifacts,
      missingArtifacts: registry.missingArtifacts
    }
  });
});

app.get("/artifacts/registry", (_req, res) => {
  res.json({
    status: "success",
    registry: getArtifactRegistrySnapshot()
  });
});

app.get("/artifacts/missing-names", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getMissingArtifactNames()
  });
});

app.get("/artifacts/available-names", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getAvailableArtifactNames()
  });
});



app.get("/artifacts/names.txt", (_req, res) => {
  res.type("text/plain").send(getArtifactNamesText());
});

app.get("/artifacts/names.csv", (_req, res) => {
  res.type("text/csv").send(getArtifactNamesCsv());
});

app.get("/artifacts/names", (_req, res) => {
  res.json({
    status: "success",
    artifacts: Object.keys(ARTIFACT_PATHS)
  });
});

app.get("/artifacts/health", (_req, res) => {
  const summaries = summarizeAllArtifacts();
  const missing = summaries.filter((artifact) => !artifact.exists);

  res.json({
    status: missing.length === 0 ? "healthy" : "degraded",
    totalArtifacts: summaries.length,
    availableArtifacts: summaries.length - missing.length,
    missingArtifacts: missing.length
  });
});

app.get("/artifacts/summaries", (_req, res) => {
  res.json({
    status: "success",
    artifacts: summarizeAllArtifacts()
  });
});

app.get("/artifacts/missing", (_req, res) => {
  const missingArtifacts = listArtifactMetadata().filter((artifact) => !artifact.exists);

  res.json({
    status: "success",
    count: missingArtifacts.length,
    artifacts: missingArtifacts
  });
});

app.get("/artifacts/available", (_req, res) => {
  const availableArtifacts = listArtifactMetadata().filter((artifact) => artifact.exists);

  res.json({
    status: "success",
    count: availableArtifacts.length,
    artifacts: availableArtifacts
  });
});

app.get("/artifacts/count", (_req, res) => {
  res.json({
    status: "success",
    count: Object.keys(ARTIFACT_PATHS).length
  });
});

app.get("/artifacts/metadata", (_req, res) => {
  res.json({
    status: "success",
    artifacts: listArtifactMetadata()
  });
});

app.get("/artifacts/status", (_req, res) => {
  const artifacts = Object.fromEntries(
    Object.entries(ARTIFACT_PATHS).map(([name, artifactPath]) => [
      name,
      {
        path: artifactPath,
        exists: fs.existsSync(artifactPath)
      }
    ])
  );

  res.json({
    status: "success",
    artifacts
  });
});

app.get("/artifacts/latest-dashboard", (_req, res) => {
  try {
    const artifactPath = getLatestOutputArtifactPath();

    if (!fs.existsSync(artifactPath)) {
      res.status(404).json({
        status: "error",
        message:
          "No output artifact found. Run the FinanceOps agent before requesting the latest dashboard artifact."
      });
      return;
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    const payload = artifact.payload ?? {};

    res.json({
      status: "success",
      dashboard: {
        generatedAt: artifact.generatedAt,
        artifactType: artifact.artifactType,
        mode: payload.mode,
        project: payload.project,
        financeSummary: payload.financeSummary,
        governance: payload.governance,
        cfoBriefing: payload.cfoBriefing
          ? {
              executiveSummary: payload.cfoBriefing.executiveSummary,
              confidenceScore: payload.cfoBriefing.confidenceScore
            }
          : null
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.get("/artifacts/latest-output", (_req, res) => {
  try {
    const artifactPath = getLatestOutputArtifactPath();

    if (!fs.existsSync(artifactPath)) {
      res.status(404).json({
        status: "error",
        message:
          "No output artifact found. Run the FinanceOps agent before requesting the latest output artifact."
      });
      return;
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

    res.json({
      status: "success",
      artifact
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});













app.get("/artifacts/api-surface", (_req, res) => {
  res.json({
    status: "success",
    surface: getArtifactApiSurfaceSummary()
  });
});

app.get("/artifacts/registry-envelope", (_req, res) => {
  res.json({
    status: "success",
    envelope: getArtifactRegistryEnvelope()
  });
});

app.get("/artifacts/registry-version", (_req, res) => {
  res.json({
    status: "success",
    registry: getArtifactRegistryVersion()
  });
});

app.get("/artifacts/routes", (_req, res) => {
  res.json({
    status: "success",
    routes: getArtifactRouteCatalog()
  });
});

app.get("/artifacts/route-catalog", (_req, res) => {
  res.json({
    status: "success",
    routes: getArtifactRouteCatalog()
  });
});

app.get("/artifacts/audit-digest", (_req, res) => {
  res.json({
    status: "success",
    digest: getArtifactAuditDigest()
  });
});

app.get("/artifacts/manifest", (_req, res) => {
  res.json({
    status: "success",
    manifest: getArtifactManifest()
  });
});

app.get("/artifacts/table.md", (_req, res) => {
  res.type("text/markdown").send(getArtifactCompactTableMarkdown());
});

app.get("/artifacts/table.csv", (_req, res) => {
  res.type("text/csv").send(getArtifactCompactTableCsv());
});

app.get("/artifacts/table", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getArtifactCompactRows()
  });
});

app.get("/artifacts/:artifactName/metadata", (req, res) => {
  const artifactName = req.params.artifactName;

  if (!isArtifactName(artifactName)) {
    res.status(404).json({
      status: "error",
      message: `Unknown artifact: ${artifactName}`
    });
    return;
  }

  const artifact = readArtifactByName(artifactName);

  res.json({
    status: "success",
    metadata: {
      name: artifact.name,
      path: artifact.path,
      exists: artifact.exists
    }
  });
});


app.get("/client/onboarding-questionnaire", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientOnboardingQuestionnaire()
  });
});

app.get("/client/field-coverage", (_req, res) => {
  res.json({
    status: "success",
    result: evaluateClientFieldCoverage(mockClientReadinessFixture.fieldRequirements)
  });
});

app.get("/client/data-request-packet", (_req, res) => {
  const coverage = evaluateClientFieldCoverage(mockClientReadinessFixture.fieldRequirements);

  res.json({
    status: "success",
    result: buildClientDataRequestPacket(coverage)
  });
});

app.get("/client/governance-brief", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientGovernanceBrief(mockClientReadinessFixture.governanceRules)
  });
});

app.get("/client/implementation-readiness", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientImplementationReadiness(mockClientReadinessFixture)
  });
});



app.get("/client/adapter-blueprint", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientAdapterBlueprint()
  });
});

app.get("/client/output-delivery-plan", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientOutputDeliveryPlan()
  });
});

app.get("/client/deployment-checklist", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientDeploymentChecklist()
  });
});

app.get("/client/build-package", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientBuildPackage()
  });
});


app.get("/client/acceptance-criteria", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientAcceptanceCriteriaReport()
  });
});

app.get("/client/test-scenarios", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientTestScenarioPack()
  });
});

app.get("/client/demo-script", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientDemoScript()
  });
});

app.get("/client/acceptance-package", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientAcceptancePackage()
  });
});


app.get("/client/pilot-scope", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientPilotScope()
  });
});

app.get("/client/pilot-risk-register", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientPilotRiskRegister()
  });
});

app.get("/client/pilot-success-metrics", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientPilotSuccessMetrics()
  });
});

app.get("/client/pilot-plan", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientPilotPlan()
  });
});


app.get("/client/production-prerequisites", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientProductionPrerequisites()
  });
});

app.get("/client/production-risk-report", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientProductionHandoffRiskReport()
  });
});

app.get("/client/production-handoff-plan", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientProductionHandoffPlan()
  });
});

app.get("/client/production-demo-script", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientProductionDemoScript()
  });
});

app.get("/client/production-handoff-package", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientProductionHandoffPackage()
  });
});


app.get("/client/go-live-checklist", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientGoLiveChecklist()
  });
});

app.get("/client/go-live-risk-report", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientGoLiveRiskReport()
  });
});

app.get("/client/go-live-decision", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientGoLiveDecision()
  });
});

app.get("/client/launch-brief", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientLaunchBrief()
  });
});

app.get("/client/go-live-package", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientGoLivePackage()
  });
});


app.get("/client/commercial-value-hypothesis", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientCommercialValueHypothesis()
  });
});

app.get("/client/roi-model", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientRoiModel()
  });
});

app.get("/client/commercial-readiness-score", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientCommercialReadinessScore()
  });
});

app.get("/client/buyer-brief", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientBuyerBrief()
  });
});

app.get("/client/objection-handling", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientObjectionHandlingGuide()
  });
});

app.get("/client/commercial-package", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientCommercialPackage()
  });
});



app.get("/client/sales-narrative", (_req, res) => {
  res.json({ status: "success", result: getClientSalesNarrative() });
});

app.get("/client/demo-agenda", (_req, res) => {
  res.json({ status: "success", result: getClientDemoAgenda() });
});

app.get("/client/follow-up-email", (_req, res) => {
  res.json({ status: "success", result: getClientFollowUpEmail() });
});

app.get("/client/buyer-faq", (_req, res) => {
  res.json({ status: "success", result: getClientBuyerFaq() });
});




app.get("/client/sample-input-fixtures", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientSampleInputFixtures()
  });
});


app.get("/client/security-boundary", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientSecurityBoundary()
  });
});


app.get("/client/validation-matrix", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientValidationMatrix()
  });
});

app.get("/client/reviewer-dashboard", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientReviewerDashboard()
  });
});


app.get("/client/plugin-contracts", (_req, res) => {
  const packageResult = buildClientPluginContractsPackage();

  res.json({
    status: "success",
    result: packageResult,
    validation: validateClientPluginContractsPackage(packageResult)
  });
});

app.get("/client/reviewer-audit", (_req, res) => {
  res.json({ status: "success", result: buildClientReviewerAudit() });
});

app.get("/client/sales-handoff-package", (_req, res) => {
  res.json({ status: "success", result: getClientSalesHandoffPackage() });
});

app.get("/client/commercial-summary", (_req, res) => {
  res.json({
    status: "success",
    result: buildClientCommercialSummary()
  });
});

app.get("/artifacts/:artifactName", (req, res) => {
  const artifactName = req.params.artifactName;

  if (!isArtifactName(artifactName)) {
    res.status(404).json({
      status: "error",
      message: `Unknown artifact: ${artifactName}`
    });
    return;
  }

  const artifact = readArtifactByName(artifactName);

  if (!artifact.exists) {
    res.status(404).json({
      status: "error",
      artifact
    });
    return;
  }

  res.json({
    status: "success",
    artifact
  });
});

registerStandardApiErrorHandlers(app);

app.listen(port, () => {
  console.log(`FinanceOps Agent API running on http://localhost:${port}`);
});
