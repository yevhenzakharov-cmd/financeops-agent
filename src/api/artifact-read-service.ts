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
