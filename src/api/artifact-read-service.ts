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
