import { describe, expect, it } from "vitest";
import { validateAiGuardrails } from "./ai-guardrails";

describe("AI guardrails", () => {
  it("allows an output that stays inside the engine rules", () => {
    const result = validateAiGuardrails({
      revealsAnswerTooEarly: false,
      followsRequiredStepOrder: true,
      labelsUsed: ["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"],
      sentenceInMvpScope: true
    });

    expect(result.allowed).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it("blocks unsupported labels and early answers", () => {
    const result = validateAiGuardrails({
      revealsAnswerTooEarly: true,
      followsRequiredStepOrder: true,
      labelsUsed: ["subject", "verb"],
      sentenceInMvpScope: true
    });

    expect(result.allowed).toBe(false);
    expect(result.violations).toContain("reveals_answer_too_early");
    expect(result.violations).toContain("unsupported_labels");
  });
});
