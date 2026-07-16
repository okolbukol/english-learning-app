import { describe, expect, it } from "vitest";
import { evaluateAttempt } from "./evaluate";
import { stageOneSentences } from "./stage-one-content";

describe("stage one transfer coverage", () => {
  it("transfers every content-bank solution through the evaluator", () => {
    for (const sentence of stageOneSentences) {
      const result = evaluateAttempt(sentence, {
        sentenceId: sentence.id,
        elements: sentence.elements.map((element) => ({
          code: element.code,
          text: element.text,
          tokenIds: element.tokenIds
        })),
        englishOrder: sentence.englishOrder,
        finalSentence: sentence.targetSentence
      });

      expect(result.isCorrect, sentence.id).toBe(true);
      expect(result.score.total, sentence.id).toBe(100);
    }
  });

  it("keeps N2/Z2 confusion detectable across transferred content", () => {
    const sentence = stageOneSentences.find(
      (item) => item.elements.some((element) => element.code === "N2") && item.elements.some((element) => element.code === "Z2")
    );

    expect(sentence).toBeTruthy();

    if (!sentence) {
      return;
    }

    const n2 = sentence.elements.find((element) => element.code === "N2");
    const z2 = sentence.elements.find((element) => element.code === "Z2");

    expect(n2).toBeTruthy();
    expect(z2).toBeTruthy();

    if (!n2 || !z2) {
      return;
    }

    const result = evaluateAttempt(sentence, {
      sentenceId: sentence.id,
      elements: [
        ...sentence.elements
          .filter((element) => element.code !== "N2" && element.code !== "Z2")
          .map((element) => ({ code: element.code, text: element.text, tokenIds: element.tokenIds })),
        { code: "N2", text: z2.text, tokenIds: z2.tokenIds },
        { code: "Z2", text: n2.text, tokenIds: n2.tokenIds }
      ],
      englishOrder: sentence.englishOrder,
      finalSentence: sentence.targetSentence
    });

    expect(result.isCorrect).toBe(false);
    expect(result.steps.some((step) => step.errorType === "n2_z2_confusion")).toBe(true);
    expect(result.steps.some((step) => step.coach?.miniPractice.includes("N2/Z2"))).toBe(true);
  });
});
