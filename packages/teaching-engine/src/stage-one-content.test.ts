import { describe, expect, it } from "vitest";
import { stageOneSentences } from "./stage-one-content";

describe("stage one content bank", () => {
  it("contains 100 unique supported Etap 1 sentences", () => {
    expect(stageOneSentences).toHaveLength(100);
    expect(new Set(stageOneSentences.map((sentence) => sentence.trSentence)).size).toBe(100);
    expect(stageOneSentences.every((sentence) => sentence.stage === 1 && sentence.supported)).toBe(true);
  });

  it("keeps every sentence aligned with the teaching engine labels", () => {
    for (const sentence of stageOneSentences) {
      const codes = new Set(sentence.elements.map((element) => element.code));

      expect(codes.has("Ö")).toBe(true);
      expect(codes.has("F")).toBe(true);
      expect(codes.has("İm")).toBe(true);
      expect(sentence.englishOrder.every((code) => codes.has(code))).toBe(true);
      expect(sentence.tokens.length).toBeGreaterThan(0);
      expect(sentence.targetSentence.endsWith(".")).toBe(true);
    }
  });
});
