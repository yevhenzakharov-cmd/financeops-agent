import fs from "fs";

import { ARTIFACT_PATHS, type ArtifactName } from "./artifact-paths.js";

export interface ArtifactReadResult {
  name: ArtifactName;
  path: string;
  exists: boolean;
  data: unknown | null;
}

export function readArtifactByName(name: ArtifactName): ArtifactReadResult {
  const artifactPath = ARTIFACT_PATHS[name];

  if (!fs.existsSync(artifactPath)) {
    return {
      name,
      path: artifactPath,
      exists: false,
      data: null
    };
  }

  return {
    name,
    path: artifactPath,
    exists: true,
    data: JSON.parse(fs.readFileSync(artifactPath, "utf-8"))
  };
}


export function listArtifactMetadata(): Array<{
  name: ArtifactName;
  path: string;
  exists: boolean;
}> {
  return Object.entries(ARTIFACT_PATHS).map(([name, artifactPath]) => ({
    name: name as ArtifactName,
    path: artifactPath,
    exists: fs.existsSync(artifactPath)
  }));
}


export function isArtifactName(value: string): value is ArtifactName {
  return Object.prototype.hasOwnProperty.call(ARTIFACT_PATHS, value);
}


export function readAllArtifactMetadata(): Array<{
  name: ArtifactName;
  path: string;
  exists: boolean;
}> {
  return listArtifactMetadata();
}


export function summarizeArtifact(name: ArtifactName): {
  name: ArtifactName;
  path: string;
  exists: boolean;
  dataType: string;
  sizeBytes: number;
} {
  const artifact = readArtifactByName(name);
  const serialized = artifact.data === null ? "" : JSON.stringify(artifact.data);

  return {
    name: artifact.name,
    path: artifact.path,
    exists: artifact.exists,
    dataType: artifact.data === null ? "null" : Array.isArray(artifact.data) ? "array" : typeof artifact.data,
    sizeBytes: Buffer.byteLength(serialized, "utf-8")
  };
}


export function summarizeAllArtifacts(): Array<ReturnType<typeof summarizeArtifact>> {
  return Object.keys(ARTIFACT_PATHS).map((name) =>
    summarizeArtifact(name as ArtifactName)
  );
}


export function getArtifactNames(): ArtifactName[] {
  return Object.keys(ARTIFACT_PATHS) as ArtifactName[];
}


export function getAvailableArtifactNames(): ArtifactName[] {
  return summarizeAllArtifacts()
    .filter((artifact) => artifact.exists)
    .map((artifact) => artifact.name);
}


export function getMissingArtifactNames(): ArtifactName[] {
  return summarizeAllArtifacts()
    .filter((artifact) => !artifact.exists)
    .map((artifact) => artifact.name);
}


export function getArtifactRegistrySnapshot(): {
  totalArtifacts: number;
  availableArtifacts: number;
  missingArtifacts: number;
  artifacts: Array<ReturnType<typeof summarizeArtifact>>;
} {
  const artifacts = summarizeAllArtifacts();
  const availableArtifacts = artifacts.filter((artifact) => artifact.exists).length;

  return {
    totalArtifacts: artifacts.length,
    availableArtifacts,
    missingArtifacts: artifacts.length - availableArtifacts,
    artifacts
  };
}


export function getTotalArtifactSizeBytes(): number {
  return summarizeAllArtifacts().reduce(
    (total, artifact) => total + artifact.sizeBytes,
    0
  );
}


export function getLargestArtifactSummary(): ReturnType<typeof summarizeArtifact> | null {
  const artifacts = summarizeAllArtifacts();

  if (artifacts.length === 0) {
    return null;
  }

  return artifacts.reduce((largest, artifact) =>
    artifact.sizeBytes > largest.sizeBytes ? artifact : largest
  );
}


export function getSmallestArtifactSummary(): ReturnType<typeof summarizeArtifact> | null {
  const artifacts = summarizeAllArtifacts();

  if (artifacts.length === 0) {
    return null;
  }

  return artifacts.reduce((smallest, artifact) =>
    artifact.sizeBytes < smallest.sizeBytes ? artifact : smallest
  );
}


export function getAverageArtifactSizeBytes(): number {
  const artifacts = summarizeAllArtifacts();

  if (artifacts.length === 0) {
    return 0;
  }

  return Math.round(
    artifacts.reduce((total, artifact) => total + artifact.sizeBytes, 0) /
      artifacts.length
  );
}


export function getArtifactSummaryMap(): Record<ArtifactName, ReturnType<typeof summarizeArtifact>> {
  return Object.fromEntries(
    summarizeAllArtifacts().map((artifact) => [artifact.name, artifact])
  ) as Record<ArtifactName, ReturnType<typeof summarizeArtifact>>;
}


export function getArtifactExistenceMap(): Record<ArtifactName, boolean> {
  return Object.fromEntries(
    listArtifactMetadata().map((artifact) => [artifact.name, artifact.exists])
  ) as Record<ArtifactName, boolean>;
}


export function getArtifactPathMap(): Record<ArtifactName, string> {
  return Object.fromEntries(
    listArtifactMetadata().map((artifact) => [artifact.name, artifact.path])
  ) as Record<ArtifactName, string>;
}


export function getArtifactSizeMap(): Record<ArtifactName, number> {
  return Object.fromEntries(
    summarizeAllArtifacts().map((artifact) => [artifact.name, artifact.sizeBytes])
  ) as Record<ArtifactName, number>;
}


export function getArtifactCountByAvailability(): {
  available: number;
  missing: number;
} {
  const artifacts = summarizeAllArtifacts();

  return {
    available: artifacts.filter((artifact) => artifact.exists).length,
    missing: artifacts.filter((artifact) => !artifact.exists).length
  };
}


export function getArtifactOperationalSummary(): {
  health: "healthy" | "degraded";
  totalArtifacts: number;
  availableArtifacts: number;
  missingArtifacts: number;
  totalSizeBytes: number;
  averageSizeBytes: number;
  largestArtifact: ReturnType<typeof summarizeArtifact> | null;
  smallestArtifact: ReturnType<typeof summarizeArtifact> | null;
} {
  const registry = getArtifactRegistrySnapshot();

  return {
    health: registry.missingArtifacts === 0 ? "healthy" : "degraded",
    totalArtifacts: registry.totalArtifacts,
    availableArtifacts: registry.availableArtifacts,
    missingArtifacts: registry.missingArtifacts,
    totalSizeBytes: getTotalArtifactSizeBytes(),
    averageSizeBytes: getAverageArtifactSizeBytes(),
    largestArtifact: getLargestArtifactSummary(),
    smallestArtifact: getSmallestArtifactSummary()
  };
}


export function getArtifactDiagnostics(): {
  generatedAt: string;
  operationalSummary: ReturnType<typeof getArtifactOperationalSummary>;
  registry: ReturnType<typeof getArtifactRegistrySnapshot>;
} {
  return {
    generatedAt: new Date().toISOString(),
    operationalSummary: getArtifactOperationalSummary(),
    registry: getArtifactRegistrySnapshot()
  };
}


export function getArtifactReadinessReport(): {
  ready: boolean;
  message: string;
  missingArtifacts: ArtifactName[];
} {
  const missingArtifacts = getMissingArtifactNames();

  return {
    ready: missingArtifacts.length === 0,
    message:
      missingArtifacts.length === 0
        ? "All expected artifacts are available."
        : "One or more expected artifacts are missing.",
    missingArtifacts
  };
}


export function getArtifactNamesCsv(): string {
  return getArtifactNames().join(",");
}


export function getArtifactNamesText(): string {
  return getArtifactNames().join("\n");
}


export function getArtifactGeneratedAtMap(): Record<ArtifactName, string | null> {
  return Object.fromEntries(
    Object.keys(ARTIFACT_PATHS).map((name) => {
      const artifact = readArtifactByName(name as ArtifactName);
      const data = artifact.data as { generatedAt?: unknown } | null;

      return [
        name,
        data && typeof data.generatedAt === "string" ? data.generatedAt : null
      ];
    })
  ) as Record<ArtifactName, string | null>;
}


export function getArtifactDataTypeMap(): Record<ArtifactName, string> {
  return Object.fromEntries(
    summarizeAllArtifacts().map((artifact) => [artifact.name, artifact.dataType])
  ) as Record<ArtifactName, string>;
}


export function getArtifactDataTypes(): string[] {
  return Array.from(new Set(summarizeAllArtifacts().map((artifact) => artifact.dataType)));
}


export function getArtifactPreviewMap(limit = 300): Record<ArtifactName, string> {
  return Object.fromEntries(
    Object.keys(ARTIFACT_PATHS).map((name) => {
      const artifact = readArtifactByName(name as ArtifactName);
      const preview = artifact.data === null
        ? ""
        : JSON.stringify(artifact.data, null, 2).slice(0, limit);

      return [name, preview];
    })
  ) as Record<ArtifactName, string>;
}


export function getArtifactReportHeader(): {
  service: string;
  generatedAt: string;
  artifactCount: number;
} {
  return {
    service: "FinanceOps Agent Artifact Registry",
    generatedAt: new Date().toISOString(),
    artifactCount: getArtifactNames().length
  };
}


export interface ArtifactCompactRow {
  name: ArtifactName;
  exists: boolean;
  path: string;
  dataType: string;
  sizeBytes: number;
}

export function getArtifactCompactRows(): ArtifactCompactRow[] {
  return summarizeAllArtifacts().map((artifact) => ({
    name: artifact.name,
    exists: artifact.exists,
    path: artifact.path,
    dataType: artifact.dataType,
    sizeBytes: artifact.sizeBytes
  }));
}


function escapeCsvValue(value: unknown): string {
  const stringValue = String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}


export function getArtifactCompactTableCsv(): string {
  const header = ["name", "exists", "path", "dataType", "sizeBytes"];
  const rows = getArtifactCompactRows().map((artifact) =>
    [
      artifact.name,
      artifact.exists,
      artifact.path,
      artifact.dataType,
      artifact.sizeBytes
    ]
      .map(escapeCsvValue)
      .join(",")
  );

  return [header.join(","), ...rows].join("\n");
}


export function getArtifactCompactTableMarkdown(): string {
  const rows = getArtifactCompactRows();

  return [
    "| Artifact | Exists | Type | Size Bytes | Path |",
    "|---|---:|---|---:|---|",
    ...rows.map(
      (artifact) =>
        `| ${artifact.name} | ${artifact.exists} | ${artifact.dataType} | ${artifact.sizeBytes} | ${artifact.path} |`
    )
  ].join("\n");
}


export function getArtifactManifest(): {
  generatedAt: string;
  artifacts: ArtifactCompactRow[];
  summary: ReturnType<typeof getArtifactOperationalSummary>;
} {
  return {
    generatedAt: new Date().toISOString(),
    artifacts: getArtifactCompactRows(),
    summary: getArtifactOperationalSummary()
  };
}


export function getArtifactAuditDigest(): {
  generatedAt: string;
  readiness: ReturnType<typeof getArtifactReadinessReport>;
  diagnostics: ReturnType<typeof getArtifactDiagnostics>;
} {
  return {
    generatedAt: new Date().toISOString(),
    readiness: getArtifactReadinessReport(),
    diagnostics: getArtifactDiagnostics()
  };
}


export function getArtifactRouteCatalog(): Array<{
  method: "GET";
  path: string;
  description: string;
}> {
  return [
    { method: "GET", path: "/artifacts", description: "List artifact registry entries." },
    { method: "GET", path: "/artifacts/status", description: "Check expected artifact file availability." },
    { method: "GET", path: "/artifacts/health", description: "Return artifact health summary." },
    { method: "GET", path: "/artifacts/registry", description: "Return full artifact registry snapshot." },
    { method: "GET", path: "/artifacts/:artifactName", description: "Read one named artifact." },
    { method: "GET", path: "/artifacts/:artifactName/raw", description: "Read one named artifact payload only." }
  ];
}


export function getArtifactRegistryVersion(): {
  version: string;
  generatedAt: string;
} {
  return {
    version: "artifact-registry-v1",
    generatedAt: new Date().toISOString()
  };
}


export function getArtifactRegistryEnvelope(): {
  version: ReturnType<typeof getArtifactRegistryVersion>;
  summary: ReturnType<typeof getArtifactOperationalSummary>;
  routes: ReturnType<typeof getArtifactRouteCatalog>;
} {
  return {
    version: getArtifactRegistryVersion(),
    summary: getArtifactOperationalSummary(),
    routes: getArtifactRouteCatalog()
  };
}


export function getArtifactApiSurfaceSummary(): {
  routeCount: number;
  routes: string[];
} {
  const routes = getArtifactRouteCatalog().map((route) => route.path);

  return {
    routeCount: routes.length,
    routes
  };
}
