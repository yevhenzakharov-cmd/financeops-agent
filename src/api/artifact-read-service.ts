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
