import { describe, expect, test } from "vitest";

import {
  getArtifactApiSurfaceSummary,
  getArtifactAuditDigest,
  getArtifactCompactRows,
  getArtifactCompactTableCsv,
  getArtifactCompactTableMarkdown,
  getArtifactCountByAvailability,
  getArtifactDataTypeMap,
  getArtifactDataTypes,
  getArtifactExistenceMap,
  getArtifactGeneratedAtMap,
  getArtifactManifest,
  getArtifactNames,
  getArtifactNamesCsv,
  getArtifactNamesText,
  getArtifactOperationalSummary,
  getArtifactPathMap,
  getArtifactPreviewMap,
  getArtifactReadinessReport,
  getArtifactRegistryEnvelope,
  getArtifactRegistrySnapshot,
  getArtifactRegistryVersion,
  getArtifactRouteCatalog,
  getArtifactSizeMap,
  getArtifactSummaryMap,
  isArtifactName,
  listArtifactMetadata,
  readArtifactByName,
  summarizeAllArtifacts,
  summarizeArtifact
} from "../../src/api/artifact-read-service.js";

describe("artifact read service", () => {
  test("exposes stable artifact names", () => {
    const names = getArtifactNames();

    expect(names).toEqual([
      "executionLedger",
      "approvalQueue",
      "paymentExecution",
      "clientOutputArtifact"
    ]);
  });

  test("validates known and unknown artifact names", () => {
    expect(isArtifactName("executionLedger")).toBe(true);
    expect(isArtifactName("approvalQueue")).toBe(true);
    expect(isArtifactName("notARealArtifact")).toBe(false);
  });

  test("lists artifact metadata without reading payload requirements", () => {
    const metadata = listArtifactMetadata();

    expect(metadata).toHaveLength(4);
    expect(metadata.every((item) => item.name.length > 0)).toBe(true);
    expect(metadata.every((item) => item.path.includes("outputs/"))).toBe(true);
    expect(metadata.every((item) => typeof item.exists === "boolean")).toBe(true);
  });

  test("reads a named artifact with stable envelope", () => {
    const artifact = readArtifactByName("executionLedger");

    expect(artifact.name).toBe("executionLedger");
    expect(artifact.path).toContain("latest-execution-ledger.json");
    expect(typeof artifact.exists).toBe("boolean");
    expect(artifact.exists ? artifact.data !== null : artifact.data === null).toBe(true);
  });

  test("summarizes one artifact with size and data type", () => {
    const summary = summarizeArtifact("approvalQueue");

    expect(summary.name).toBe("approvalQueue");
    expect(summary.path).toContain("latest-approval-queue.json");
    expect(typeof summary.exists).toBe("boolean");
    expect(summary.sizeBytes).toBeGreaterThanOrEqual(0);
    expect(typeof summary.dataType).toBe("string");
  });

  test("summarizes all artifacts", () => {
    const summaries = summarizeAllArtifacts();

    expect(summaries).toHaveLength(4);
    expect(summaries.map((item) => item.name)).toEqual(getArtifactNames());
  });

  test("builds registry snapshot with internally consistent counts", () => {
    const snapshot = getArtifactRegistrySnapshot();

    expect(snapshot.totalArtifacts).toBe(4);
    expect(snapshot.availableArtifacts + snapshot.missingArtifacts).toBe(snapshot.totalArtifacts);
    expect(snapshot.artifacts).toHaveLength(snapshot.totalArtifacts);
  });

  test("builds availability count summary", () => {
    const counts = getArtifactCountByAvailability();

    expect(counts.available + counts.missing).toBe(4);
    expect(counts.available).toBeGreaterThanOrEqual(0);
    expect(counts.missing).toBeGreaterThanOrEqual(0);
  });

  test("builds artifact maps with all expected keys", () => {
    const existenceMap = getArtifactExistenceMap();
    const pathMap = getArtifactPathMap();
    const sizeMap = getArtifactSizeMap();
    const summaryMap = getArtifactSummaryMap();

    for (const name of getArtifactNames()) {
      expect(name in existenceMap).toBe(true);
      expect(name in pathMap).toBe(true);
      expect(name in sizeMap).toBe(true);
      expect(name in summaryMap).toBe(true);
    }
  });

  test("builds generated-at, data-type, and preview maps", () => {
    const generatedAtMap = getArtifactGeneratedAtMap();
    const dataTypeMap = getArtifactDataTypeMap();
    const previewMap = getArtifactPreviewMap(80);

    for (const name of getArtifactNames()) {
      expect(name in generatedAtMap).toBe(true);
      expect(name in dataTypeMap).toBe(true);
      expect(name in previewMap).toBe(true);
      expect(previewMap[name].length).toBeLessThanOrEqual(80);
    }
  });

  test("exports artifact names as csv and text", () => {
    const csv = getArtifactNamesCsv();
    const text = getArtifactNamesText();

    expect(csv).toContain("executionLedger");
    expect(csv).toContain("approvalQueue");
    expect(csv.split(",").length).toBeGreaterThanOrEqual(4);
    expect(text).toContain("executionLedger");
    expect(text).toContain("approvalQueue");
  });

  test("builds compact rows and tables", () => {
    const rows = getArtifactCompactRows();
    const csv = getArtifactCompactTableCsv();
    const markdown = getArtifactCompactTableMarkdown();

    expect(rows).toHaveLength(4);
    expect(csv).toContain("name");
    expect(markdown).toContain("|");
    expect(markdown).toContain("executionLedger");
  });

  test("builds operational summary and readiness report", () => {
    const summary = getArtifactOperationalSummary();
    const readiness = getArtifactReadinessReport();

    expect(["healthy", "degraded"]).toContain(summary.health);
    expect(summary.totalArtifacts).toBe(4);
    expect(typeof readiness.ready).toBe("boolean");
    expect(readiness.missingArtifacts.length).toBeGreaterThanOrEqual(0);
  });

  test("builds manifest, digest, route catalog, and api surface summary", () => {
    const manifest = getArtifactManifest();
    const digest = getArtifactAuditDigest();
    const routes = getArtifactRouteCatalog();
    const surface = getArtifactApiSurfaceSummary();

    expect(manifest.artifacts).toHaveLength(4);
    expect(digest).toBeDefined();
    expect(routes.length).toBeGreaterThan(0);
    expect(routes.some((route) => route.path.startsWith("/artifacts"))).toBe(true);
    expect(surface).toBeDefined();
  });

  test("builds registry version and envelope", () => {
    const version = getArtifactRegistryVersion();
    const envelope = getArtifactRegistryEnvelope();

    expect(version.version).toBe("artifact-registry-v1");
    expect(envelope).toBeDefined();
    expect(Object.keys(envelope).length).toBeGreaterThan(0);
  });

  test("returns unique data types list", () => {
    const dataTypes = getArtifactDataTypes();

    expect(Array.isArray(dataTypes)).toBe(true);
    expect(new Set(dataTypes).size).toBe(dataTypes.length);
  });
});
