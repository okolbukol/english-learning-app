import type { AiGuardrailResult, ElementCode } from "./types";

const SUPPORTED_LABELS: ElementCode[] = ["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"];

export interface AiGuardrailInput {
  revealsAnswerTooEarly: boolean;
  followsRequiredStepOrder: boolean;
  labelsUsed: string[];
  sentenceInMvpScope: boolean;
}

export function validateAiGuardrails(input: AiGuardrailInput): AiGuardrailResult {
  const violations: AiGuardrailResult["violations"] = [];

  if (input.revealsAnswerTooEarly) {
    violations.push("reveals_answer_too_early");
  }

  if (!input.followsRequiredStepOrder) {
    violations.push("wrong_step_order");
  }

  if (input.labelsUsed.some((label) => !SUPPORTED_LABELS.includes(label as ElementCode))) {
    violations.push("unsupported_labels");
  }

  if (!input.sentenceInMvpScope) {
    violations.push("outside_mvp_scope");
  }

  return {
    allowed: violations.length === 0,
    violations
  };
}
