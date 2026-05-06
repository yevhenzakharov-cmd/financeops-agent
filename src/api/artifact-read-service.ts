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
