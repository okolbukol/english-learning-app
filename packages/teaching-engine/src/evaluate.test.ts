import { describe, expect, it } from "vitest";
import { evaluateAttempt } from "./evaluate";
import { getFixtureSentence } from "./fixtures";
import type { Attempt, SentenceDefinition } from "./types";

describe("teaching engine evaluation", () => {
  it("scores a fully correct guided attempt", () => {
    const sentence = getFixtureSentence("sent_0001");
    const attempt = correctAttemptFor(sentence);

    const result = evaluateAttempt(sentence, attempt);

    expect(result.isCorrect).toBe(true);
    expect(result.primaryError).toBeNull();
    expect(result.score.total).toBe(100);
  });

  it("classifies N2 and Z2 confusion without hiding the process score", () => {
    const sentence = getFixtureSentence("sent_0002");
    const attempt: Attempt = {
      sentenceId: sentence.id,
      elements: [
        { code: "F", text: "-malı", tokenIds: ["t3"] },
        { code: "İm", text: "kal", tokenIds: ["t3"] },
        { code: "Ö", text: "sen", tokenIds: [] },
        { code: "Z2", text: "evde", tokenIds: ["t2"] },
        { code: "N2", text: "Bugün", tokenIds: ["t1"] }
      ],
      englishOrder: ["Ö", "F", "İm", "N2", "Z2"],
      finalSentence: sentence.targetSentence
    };

    const result = evaluateAttempt(sentence, attempt);

    expect(result.isCorrect).toBe(false);
    expect(result.steps.some((step) => step.errorType === "n2_z2_confusion")).toBe(true);
    expect(result.score.processOrder).toBe(35);
    expect(result.score.total).toBeLessThan(100);
  });

  it("penalizes attempts that ask for translation before doing the work", () => {
    const sentence = getFixtureSentence("sent_0001");
    const attempt: Attempt = {
      sentenceId: sentence.id,
      elements: [],
      englishOrder: [],
      requestedTranslationBeforeWork: true
    };

    const result = evaluateAttempt(sentence, attempt);

    expect(result.primaryError).toBe("translation_too_early");
    expect(result.score.processOrder).toBe(20);
  });

  it("accepts configured English variants", () => {
    const sentence = {
      ...getFixtureSentence("sent_0001"),
      acceptedVariants: ["You must quickly leave a package at home today."]
    };
    const attempt = {
      ...correctAttemptFor(sentence),
      finalSentence: "You must quickly leave a package at home today."
    };

    const result = evaluateAttempt(sentence, attempt);

    expect(result.isCorrect).toBe(true);
    expect(result.score.finalSentence).toBe(10);
  });
});

function correctAttemptFor(sentence: SentenceDefinition): Attempt {
  return {
    sentenceId: sentence.id,
    elements: sentence.elements.map((element) => ({
      code: element.code,
      text: element.text,
      tokenIds: element.tokenIds
    })),
    englishOrder: sentence.englishOrder,
    finalSentence: sentence.targetSentence
  };
}
