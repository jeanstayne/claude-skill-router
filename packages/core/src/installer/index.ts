// Installer module — Phase 4
// Safe installer with dry-run, backup, and cleanup

export { installSkillPack } from './installSkillPack.js';
export { cleanupUnusedSkills } from './cleanupUnusedSkills.js';
export { generateClaudeMdPatch } from './generateClaudeMdPatch.js';
export { installAutopilot } from './installAutopilot.js';
export { buildClaudeMdSnippet, checkClaudeMdSnippet } from './generateAutopilotClaudeMdSnippet.js';
export { backupProjectFiles } from './backupProjectFiles.js';
export { safeCopyFile, safeWriteFile, ensureDir } from './safeFs.js';
