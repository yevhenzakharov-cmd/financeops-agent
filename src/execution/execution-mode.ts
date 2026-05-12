export type ExecutionMode =
  | "simulation"
  | "approval_required"
  | "auto_execute_safe";

const ALLOWED_EXECUTION_MODES: readonly ExecutionMode[] = [
  "simulation",
  "approval_required",
  "auto_execute_safe"
];

export function getExecutionMode(): ExecutionMode {
  const mode = process.env.EXECUTION_MODE;

  if (!mode) return "simulation";

  if (ALLOWED_EXECUTION_MODES.includes(mode as ExecutionMode)) {
    return mode as ExecutionMode;
  }

  return "simulation";
}
