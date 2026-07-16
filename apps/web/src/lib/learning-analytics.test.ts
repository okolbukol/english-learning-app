import { evaluateAttempt, stageOneSentences } from "@html2pdf-pro/teaching-engine";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildTeachingAnalytics,
  buildUserReport,
  createSolvedSentenceRecord,
  createTestSession,
  serializeAnalyticsCsv,
  serializeAnalyticsJson,
  validateAnalyticsExport,
  type AnalyticsExport
} from "./learning-analytics";

describe("learning analytics", () => {
  it("creates a balanced 20-question test session", () => {
    const session = createTestSession(stageOneSentences, 20);

    expect(session).toHaveLength(20);
    expect(new Set(session.map((question) => question.sentence.lesson)).size).toBeGreaterThan(1);
    expect(session[0]?.order).toBe(1);
    expect(session[19]?.order).toBe(20);
  });

  it("builds user and teaching reports from solved records", () => {
    const sentence = stageOneSentences[0];

    expect(sentence).toBeTruthy();

    if (!sentence) {
      return;
    }

    const evaluation = evaluateAttempt(sentence, {
      sentenceId: sentence.id,
      elements: sentence.elements.map((element) => ({
        code: element.code,
        text: element.text,
        tokenIds: element.tokenIds
      })),
      englishOrder: sentence.englishOrder,
      finalSentence: sentence.targetSentence
    });
    const record = createSolvedSentenceRecord({
      sentence,
      evaluation,
      durationMs: 42000,
      attemptNumber: 1,
      hintCount: 0
    });
    const userReport = buildUserReport([record]);
    const teachingAnalytics = buildTeachingAnalytics([record]);

    expect(userReport.averageScore).toBe(100);
    expect(userReport.firstAttemptRate).toBe(100);
    expect(teachingAnalytics.averageDurationMs).toBe(42000);
    expect(teachingAnalytics.hardestSentences).toHaveLength(1);
  });

  it("validates the sample exported analytics file schema", () => {
    const samplePath = resolve(process.cwd(), "docs/research/user-testing/SAMPLE_ANALYTICS_EXPORT.json");
    const sample = JSON.parse(readFileSync(samplePath, "utf-8")) as AnalyticsExport;

    expect(validateAnalyticsExport(sample)).toBe(true);
    expect(serializeAnalyticsJson(sample)).toContain('"participantCode": "P001"');
    expect(serializeAnalyticsCsv(sample)).toContain("participantCode,sentenceId,score");
  });
});
