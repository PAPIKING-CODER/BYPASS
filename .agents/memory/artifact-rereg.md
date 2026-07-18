---
name: Artifact re-registration
description: How to restore a dropped artifact without losing code
---

If the bypass-dashboard (or any) artifact is removed from the registry but its directory still exists, the .replit-artifact/artifact.toml file is still on disk.

**How to apply:**
1. Write a sibling temp file: `artifacts/<slug>/.replit-artifact/artifact.edit.toml` with the desired content (can be the same as original, or with title/path changes).
2. Call `verifyAndReplaceArtifactToml({ tempFilePath: "..artifact.edit.toml", artifactTomlPath: "..artifact.toml" })` in CodeExecution.
3. Restart the managed workflow returned by the artifact system.

Do NOT call createArtifact — it fails when the directory already exists.
