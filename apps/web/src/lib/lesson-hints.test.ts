import { evaluateAttempt, stageOneSentences, type Attempt, type SentenceDefinition } from "@html2pdf-pro/teaching-engine";
import { describe, expect, it } from "vitest";
import { MAX_HINT_LEVEL, buildHint, buildHints, resolveHintFocus } from "./lesson-hints";

function evaluate(sentence: SentenceDefinition, overrides: Partial<Attempt> = {}) {
  return evaluateAttempt(sentence, {
    sentenceId: sentence.id,
    elements: [],
    englishOrder: [],
    ...overrides
  });
}

function solvedElements(sentence: SentenceDefinition) {
  return sentence.elements.map((element) => ({
    code: element.code,
    text: element.text,
    tokenIds: element.tokenIds
  }));
}

const firstSentence = stageOneSentences[0]!;

describe("lesson hints", () => {
  it("focuses on labelling while elements are still unassigned", () => {
    const evaluation = evaluate(firstSentence);

    expect(resolveHintFocus(evaluation)).toBe("label");

    const hint = buildHint(firstSentence, evaluation, 1);

    expect(hint.level).toBe(1);
    expect(hint.focus).toBe("label");
    // The engine evaluates F first, so the method's process order drives the hint.
    expect(hint.body).toContain("F etiketini ara");
    expect(hint.body.length).toBeGreaterThan(30);
  });

  it("moves the focus to English order once every label is correct", () => {
    const evaluation = evaluate(firstSentence, { elements: solvedElements(firstSentence), englishOrder: ["Z2", "Ö"] });

    expect(resolveHintFocus(evaluation)).toBe("order");
    expect(buildHint(firstSentence, evaluation, 1).title).toContain("Sıra kuralı");
  });

  it("moves the focus to production once labels and order are correct", () => {
    const evaluation = evaluate(firstSentence, {
      elements: solvedElements(firstSentence),
      englishOrder: firstSentence.englishOrder,
      finalSentence: "wrong sentence"
    });

    expect(resolveHintFocus(evaluation)).toBe("final");
    expect(buildHint(firstSentence, evaluation, 1).title).toContain("Son cümleyi gözden geçir");
  });

  it("returns hints cumulatively and in ascending level order", () => {
    const evaluation = evaluate(firstSentence);

    expect(buildHints(firstSentence, evaluation, 0)).toHaveLength(0);
    expect(buildHints(firstSentence, evaluation, 1).map((hint) => hint.level)).toEqual([1]);
    expect(buildHints(firstSentence, evaluation, 3).map((hint) => hint.level)).toEqual([1, 2, 3]);
  });

  it("caps hints at the maximum level", () => {
    const evaluation = evaluate(firstSentence);

    expect(buildHints(firstSentence, evaluation, 9)).toHaveLength(MAX_HINT_LEVEL);
    expect(buildHint(firstSentence, evaluation, 9).level).toBe(MAX_HINT_LEVEL);
  });

  it("shows the label sequence without any English words at level 2", () => {
    const evaluation = evaluate(firstSentence);
    const hint = buildHint(firstSentence, evaluation, 2);

    expect(hint.body).toContain(firstSentence.englishOrder.join(" + "));

    for (const englishWord of firstSentence.targetSentence.replace(".", "").split(" ")) {
      expect(hint.body.split(" ")).not.toContain(englishWord);
    }
  });

  it("opens only the subject and ortaç slots at level 3", () => {
    const mustSentence = stageOneSentences.find((item) => item.elements.some((element) => element.text === "-malı"))!;
    const hint = buildHint(mustSentence, evaluate(mustSentence), 3);

    expect(hint.body).toContain('"You must" ile başlar');
    expect(hint.body).not.toContain(mustSentence.targetSentence);
  });

  it("describes past tense without inventing a modal", () => {
    const pastSentence = stageOneSentences.find((item) => item.elements.some((element) => element.text === "-di"))!;
    const hint = buildHint(pastSentence, evaluate(pastSentence), 3);

    expect(hint.body).toContain("geçmiş zaman");
    expect(hint.body).toContain("ikinci hâlini");
    expect(hint.body).not.toContain("will");
  });

  it("falls back safely when the subject or ortaç is outside the known table", () => {
    const unknown: SentenceDefinition = {
      ...firstSentence,
      elements: [
        { code: "Ö", text: "onlar", tokenIds: [] },
        { code: "F", text: "-mekte", tokenIds: ["t1"] },
        { code: "İm", text: "bırak", tokenIds: ["t1"] }
      ]
    };
    const hint = buildHint(unknown, evaluate(unknown), 3);

    expect(hint.body).toContain("Önce gizli özneyi İngilizceye taşı");
    expect(hint.body).not.toContain("must");
  });

  it("never exposes the target sentence for any sentence at any level", () => {
    for (const sentence of stageOneSentences) {
      const evaluation = evaluate(sentence);
      const bare = sentence.targetSentence.replace(/\.$/, "").toLocaleLowerCase("tr");

      for (const hint of buildHints(sentence, evaluation, MAX_HINT_LEVEL)) {
        const body = hint.body.toLocaleLowerCase("tr");

        expect(body, `${sentence.id} level ${hint.level}`).not.toContain(bare);
        expect(body, `${sentence.id} level ${hint.level}`).not.toContain(sentence.targetSentence.toLocaleLowerCase("tr"));
      }
    }
  });

  it("never exposes the imaj translation, which stays the participant's work", () => {
    for (const sentence of stageOneSentences.slice(0, 20)) {
      const hints = buildHints(sentence, evaluate(sentence), MAX_HINT_LEVEL);
      const englishWords = sentence.targetSentence.replace(/\.$/, "").split(" ");
      // Everything after the subject + carrier prefix must stay closed.
      const closedWords = englishWords.slice(2);

      for (const hint of hints) {
        for (const word of closedWords) {
          expect(hint.body.split(/[\s".,]+/), `${sentence.id} level ${hint.level}`).not.toContain(word);
        }
      }
    }
  });
});
