import type {
  AttemptEvaluation,
  ElementCode,
  ErrorType,
  SentenceDefinition,
  StepEvaluation
} from "@html2pdf-pro/teaching-engine";

export interface SessionQuestion {
  sentence: SentenceDefinition;
  order: number;
}

export interface SolvedSentenceRecord {
  sentenceId: string;
  sentence: string;
  score: number;
  durationMs: number;
  firstAttemptSuccess: boolean;
  hintCount: number;
  primaryError: ErrorType | null;
  wrongLabels: ElementCode[];
  lesson: string;
  difficulty: number;
  isTransfer: boolean;
}

export interface UserReport {
  solvedCount: number;
  averageScore: number;
  strongestSkills: string[];
  weakestSkills: string[];
  transferSuccess: number;
  studyRecommendation: string;
  firstAttemptRate: number;
  averageHintUsage: number;
}

export interface TeachingAnalytics {
  mostErroredLabels: Array<{ label: string; count: number }>;
  hardestSentences: Array<{ sentence: string; averageScore: number; attempts: number }>;
  averageDurationMs: number;
  mostCommonError: ErrorType | null;
}

export interface AnalyticsExport {
  schemaVersion: "1.0";
  participantCode: string;
  exportedAt: string;
  session: {
    questionCount: number;
    completedCount: number;
  };
  records: SolvedSentenceRecord[];
  userReport: UserReport;
  teachingAnalytics: TeachingAnalytics;
}

const SKILL_BY_CODE: Record<ElementCode, string> = {
  Ö: "özne",
  F: "ortaç",
  Z1: "durum zarfı",
  İm: "imaj",
  N1: "edatsız nesne",
  N2: "edatlı nesne",
  Z2: "zaman zarfı"
};

export function createTestSession(sentences: SentenceDefinition[], size = 20): SessionQuestion[] {
  const byLesson = new Map<string, SentenceDefinition[]>();

  for (const sentence of sentences.filter((item) => item.stage === 1 && item.supported)) {
    const lessonSentences = byLesson.get(sentence.lesson) ?? [];
    lessonSentences.push(sentence);
    byLesson.set(sentence.lesson, lessonSentences);
  }

  const balanced = [...byLesson.values()].flatMap((items) => items.slice(0, 2));
  const selected = balanced.slice(0, size);

  return selected.map((sentence, index) => ({
    sentence,
    order: index + 1
  }));
}

export function createSolvedSentenceRecord(input: {
  sentence: SentenceDefinition;
  evaluation: AttemptEvaluation;
  durationMs: number;
  attemptNumber: number;
  hintCount: number;
}): SolvedSentenceRecord {
  return {
    sentenceId: input.sentence.id,
    sentence: input.sentence.trSentence,
    score: input.evaluation.score.total,
    durationMs: input.durationMs,
    firstAttemptSuccess: input.attemptNumber === 1 && input.evaluation.isCorrect,
    hintCount: input.hintCount,
    primaryError: input.evaluation.primaryError,
    wrongLabels: wrongLabelsFor(input.evaluation.steps),
    lesson: input.sentence.lesson,
    difficulty: input.sentence.difficulty,
    isTransfer: isTransferSentence(input.sentence)
  };
}

export function buildUserReport(records: SolvedSentenceRecord[]): UserReport {
  if (records.length === 0) {
    return {
      solvedCount: 0,
      averageScore: 0,
      strongestSkills: [],
      weakestSkills: [],
      transferSuccess: 0,
      studyRecommendation: "Önce 20 soruluk test oturumunu tamamla.",
      firstAttemptRate: 0,
      averageHintUsage: 0
    };
  }

  const skillStats = skillAccuracy(records);
  const strongestSkills = [...skillStats.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([skill]) => skill);
  const weakestSkills = [...skillStats.entries()]
    .sort((left, right) => left[1] - right[1])
    .slice(0, 3)
    .map(([skill]) => skill);
  const transferRecords = records.filter((record) => record.isTransfer);
  const transferSuccess =
    transferRecords.length === 0 ? 0 : percent(transferRecords.filter((record) => record.score >= 80).length, transferRecords.length);
  const averageScore = average(records.map((record) => record.score));
  const firstAttemptRate = percent(records.filter((record) => record.firstAttemptSuccess).length, records.length);
  const averageHintUsage = round(average(records.map((record) => record.hintCount)));

  return {
    solvedCount: records.length,
    averageScore: round(averageScore),
    strongestSkills,
    weakestSkills,
    transferSuccess,
    studyRecommendation: recommendationFor(weakestSkills[0], averageScore, averageHintUsage),
    firstAttemptRate,
    averageHintUsage
  };
}

export function buildTeachingAnalytics(records: SolvedSentenceRecord[]): TeachingAnalytics {
  if (records.length === 0) {
    return {
      mostErroredLabels: [],
      hardestSentences: [],
      averageDurationMs: 0,
      mostCommonError: null
    };
  }

  return {
    mostErroredLabels: countLabels(records),
    hardestSentences: hardestSentences(records),
    averageDurationMs: Math.round(average(records.map((record) => record.durationMs))),
    mostCommonError: mostCommonError(records)
  };
}

export function createAnalyticsExport(input: {
  participantCode: string;
  records: SolvedSentenceRecord[];
  exportedAt?: string;
}): AnalyticsExport {
  assertParticipantCode(input.participantCode);

  return {
    schemaVersion: "1.0",
    participantCode: input.participantCode,
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    session: {
      questionCount: 20,
      completedCount: input.records.length
    },
    records: input.records,
    userReport: buildUserReport(input.records),
    teachingAnalytics: buildTeachingAnalytics(input.records)
  };
}

export function serializeAnalyticsJson(exportData: AnalyticsExport): string {
  validateAnalyticsExport(exportData);
  return `${JSON.stringify(exportData, null, 2)}\n`;
}

export function serializeAnalyticsCsv(exportData: AnalyticsExport): string {
  validateAnalyticsExport(exportData);

  const headers = [
    "participantCode",
    "sentenceId",
    "score",
    "durationMs",
    "firstAttemptSuccess",
    "hintCount",
    "primaryError",
    "wrongLabels",
    "lesson",
    "difficulty",
    "isTransfer"
  ];
  const rows = exportData.records.map((record) =>
    [
      exportData.participantCode,
      record.sentenceId,
      record.score,
      record.durationMs,
      record.firstAttemptSuccess,
      record.hintCount,
      record.primaryError ?? "",
      record.wrongLabels.join("|"),
      record.lesson,
      record.difficulty,
      record.isTransfer
    ].map(csvCell)
  );

  return `${[headers, ...rows].map((row) => row.join(",")).join("\n")}\n`;
}

export function validateAnalyticsExport(value: AnalyticsExport): boolean {
  assertParticipantCode(value.participantCode);

  if (value.schemaVersion !== "1.0") {
    throw new Error("Unsupported analytics export schema version.");
  }

  if (!Number.isInteger(value.session.questionCount) || value.session.questionCount < 1) {
    throw new Error("Analytics export must include a positive question count.");
  }

  if (!Number.isInteger(value.session.completedCount) || value.session.completedCount !== value.records.length) {
    throw new Error("Analytics export completed count must match record count.");
  }

  for (const record of value.records) {
    if (!record.sentenceId || !record.sentence) {
      throw new Error("Analytics export record is missing sentence identity.");
    }

    if (record.score < 0 || record.score > 100) {
      throw new Error("Analytics export record score is outside 0-100.");
    }

    if (record.durationMs < 0) {
      throw new Error("Analytics export record duration cannot be negative.");
    }
  }

  return true;
}

function wrongLabelsFor(steps: StepEvaluation[]): ElementCode[] {
  return steps.flatMap((step) => (!step.isCorrect && step.code ? [step.code] : []));
}

function isTransferSentence(sentence: SentenceDefinition): boolean {
  return sentence.lesson.includes("transfer") || sentence.difficulty >= 3;
}

function skillAccuracy(records: SolvedSentenceRecord[]): Map<string, number> {
  const labels = Object.values(SKILL_BY_CODE);
  const stats = new Map(labels.map((label) => [label, { correct: 0, total: 0 }]));

  for (const record of records) {
    for (const [code, skill] of Object.entries(SKILL_BY_CODE) as Array<[ElementCode, string]>) {
      const entry = stats.get(skill);

      if (!entry) {
        continue;
      }

      entry.total += 1;

      if (!record.wrongLabels.includes(code)) {
        entry.correct += 1;
      }
    }
  }

  return new Map(
    [...stats.entries()].map(([skill, value]) => [skill, value.total === 0 ? 0 : value.correct / value.total])
  );
}

function countLabels(records: SolvedSentenceRecord[]): Array<{ label: string; count: number }> {
  const counts = new Map<string, number>();

  for (const label of records.flatMap((record) => record.wrongLabels)) {
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }));
}

function hardestSentences(records: SolvedSentenceRecord[]): Array<{ sentence: string; averageScore: number; attempts: number }> {
  const bySentence = new Map<string, SolvedSentenceRecord[]>();

  for (const record of records) {
    const items = bySentence.get(record.sentence) ?? [];
    items.push(record);
    bySentence.set(record.sentence, items);
  }

  return [...bySentence.entries()]
    .map(([sentence, items]) => ({
      sentence,
      averageScore: round(average(items.map((item) => item.score))),
      attempts: items.length
    }))
    .sort((left, right) => left.averageScore - right.averageScore)
    .slice(0, 5);
}

function mostCommonError(records: SolvedSentenceRecord[]): ErrorType | null {
  const counts = new Map<ErrorType, number>();

  for (const error of records.flatMap((record) => (record.primaryError ? [record.primaryError] : []))) {
    counts.set(error, (counts.get(error) ?? 0) + 1);
  }

  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

function recommendationFor(weakestSkill: string | undefined, averageScore: number, averageHintUsage: number): string {
  if (!weakestSkill) {
    return "20 soruluk oturumu tamamladıktan sonra beceri bazlı öneri oluşacak.";
  }

  if (averageScore < 70) {
    return `${weakestSkill} becerisiyle başlayıp aynı etiket üzerinde kısa tekrar yap.`;
  }

  if (averageHintUsage > 1) {
    return `${weakestSkill} becerisinde ipucusuz 5 cümle çözmeyi hedefle.`;
  }

  return `${weakestSkill} becerisini transfer cümlelerinde test et.`;
}

function assertParticipantCode(participantCode: string): void {
  if (!/^P\d{3}$/.test(participantCode)) {
    throw new Error("Participant code must use anonymous P001 format.");
  }
}

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((total, value) => total + value, 0) / values.length;
}

function percent(value: number, total: number): number {
  return total === 0 ? 0 : round((value / total) * 100);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
