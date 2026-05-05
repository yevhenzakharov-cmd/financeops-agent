export type ExecutionMode =
  | "simulation"
  | "approval_required"
  | "auto_execute_safe"
  | "full_autonomous";

export function getExecutionMode(): ExecutionMode {
  const mode = process.env.EXECUTION_MODE as ExecutionMode | undefined;

  if (!mode) return "simulation";

  return mode;
}
