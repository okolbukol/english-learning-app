import type { AttemptEvaluation, ElementCode, NextPracticeRecommendation, StepEvaluation, UserSkillProfile } from "./types";

const SKILL_TO_LESSON: Record<keyof UserSkillProfile["metrics"], NextPracticeRecommendation> = {
  fAccuracy: {
    skill: "ortaç",
    lesson: "ortac-bulma-temel",
    reason: "Kullanıcı önce yüklemdeki ortacı sağlamlaştırmalı."
  },
  imAccuracy: {
    skill: "imaj",
    lesson: "imaj-bulma-temel",
    reason: "Ortaçtan önce resmi çizen bölümü ayırma doğruluğu düşük."
  },
  subjectAccuracy: {
    skill: "özne",
    lesson: "gizli-ozne-acma",
    reason: "Gizli özneyi İngilizceye geçmeden görünür yapma pratiği gerekiyor."
  },
  z1Accuracy: {
    skill: "durum zarfı",
    lesson: "z1-durum-zarfi",
    reason: "Nasıl sorusuna cevap veren öğeleri ayırma doğruluğu düşük."
  },
  z2Accuracy: {
    skill: "zaman zarfı",
    lesson: "z2-zaman-zarfi",
    reason: "Ne zaman sorusuna cevap veren öğeleri ayırma doğruluğu düşük."
  },
  n1n2Accuracy: {
    skill: "nesne ayrımı",
    lesson: "n1-n2-ayrimi",
    reason: "Edatlı ve edatsız nesneler karışıyor."
  },
  englishOrderAccuracy: {
    skill: "İngilizce dizilim",
    lesson: "ofzinnz-dizilim",
    reason: "Ö + F + Z1 + İm + N1 + N2 + Z2 sırasını pekiştirmek gerekiyor."
  }
};

export function recommendNextPractice(profile: UserSkillProfile): NextPracticeRecommendation {
  const weakestMetric = Object.entries(profile.metrics).sort((left, right) => left[1] - right[1])[0]?.[0] as
    | keyof UserSkillProfile["metrics"]
    | undefined;

  if (!weakestMetric) {
    return SKILL_TO_LESSON.englishOrderAccuracy;
  }

  const recentN2Z2Errors = profile.recentErrors.filter((error) => error === "n2_z2_confusion").length;

  if (recentN2Z2Errors >= 2) {
    return {
      skill: "N2/Z2 ayrımı",
      lesson: "n2-z2-ayrimi",
      reason: "Son denemelerde edatlı nesne zaman zarfıyla karıştı."
    };
  }

  return SKILL_TO_LESSON[weakestMetric];
}

export function createInitialSkillProfile(userId: string): UserSkillProfile {
  return {
    userId,
    metrics: {
      fAccuracy: 0,
      imAccuracy: 0,
      subjectAccuracy: 0,
      z1Accuracy: 0,
      z2Accuracy: 0,
      n1n2Accuracy: 0,
      englishOrderAccuracy: 0
    },
    recentErrors: [],
    completedAttempts: 0,
    averageScore: 0,
    masteredSkills: [],
    needsPractice: ["ortaç", "imaj", "özne", "durum zarfı", "zaman zarfı", "nesne ayrımı", "İngilizce dizilim"]
  };
}

export function updateUserSkillProfile(
  profile: UserSkillProfile,
  evaluation: AttemptEvaluation
): UserSkillProfile {
  const completedAttempts = (profile.completedAttempts ?? 0) + 1;
  const previousWeight = completedAttempts - 1;
  const averageScore = Math.round(
    (((profile.averageScore ?? 0) * previousWeight + evaluation.score.total) / completedAttempts) * 100
  ) / 100;
  const metrics = {
    fAccuracy: blend(profile.metrics.fAccuracy, elementAccuracy(evaluation.steps, "F")),
    imAccuracy: blend(profile.metrics.imAccuracy, elementAccuracy(evaluation.steps, "İm")),
    subjectAccuracy: blend(profile.metrics.subjectAccuracy, elementAccuracy(evaluation.steps, "Ö")),
    z1Accuracy: blend(profile.metrics.z1Accuracy, elementAccuracy(evaluation.steps, "Z1")),
    z2Accuracy: blend(profile.metrics.z2Accuracy, elementAccuracy(evaluation.steps, "Z2")),
    n1n2Accuracy: blend(profile.metrics.n1n2Accuracy, combinedAccuracy(evaluation.steps, ["N1", "N2"])),
    englishOrderAccuracy: blend(profile.metrics.englishOrderAccuracy, stepAccuracy(evaluation.steps, "order_elements"))
  };
  const recentErrors = [
    ...profile.recentErrors,
    ...evaluation.steps.flatMap((step) => (step.errorType ? [step.errorType] : []))
  ].slice(-10);
  const masteredSkills = Object.entries(metrics)
    .filter(([, value]) => value >= 0.85)
    .map(([key]) => metricToSkill(key as keyof UserSkillProfile["metrics"]));
  const needsPractice = Object.entries(metrics)
    .filter(([, value]) => value < 0.7)
    .map(([key]) => metricToSkill(key as keyof UserSkillProfile["metrics"]));

  return {
    ...profile,
    metrics,
    recentErrors,
    completedAttempts,
    averageScore,
    masteredSkills,
    needsPractice
  };
}

export function getWeakestSkills(profile: UserSkillProfile, limit = 3): string[] {
  return Object.entries(profile.metrics)
    .sort((left, right) => left[1] - right[1])
    .slice(0, limit)
    .map(([key]) => metricToSkill(key as keyof UserSkillProfile["metrics"]));
}

function blend(previous: number, next: number | null): number {
  if (next === null) {
    return previous;
  }

  return Math.round((previous * 0.7 + next * 0.3) * 100) / 100;
}

function elementAccuracy(steps: StepEvaluation[], code: ElementCode): number | null {
  const step = steps.find((item) => item.code === code);

  if (!step) {
    return null;
  }

  return step.isCorrect ? 1 : 0;
}

function combinedAccuracy(steps: StepEvaluation[], codes: ElementCode[]): number | null {
  const relevant = steps.filter((item) => item.code && codes.includes(item.code));

  if (relevant.length === 0) {
    return null;
  }

  return relevant.filter((item) => item.isCorrect).length / relevant.length;
}

function stepAccuracy(steps: StepEvaluation[], stepName: StepEvaluation["step"]): number {
  const step = steps.find((item) => item.step === stepName);
  return step?.isCorrect ? 1 : 0;
}

function metricToSkill(metric: keyof UserSkillProfile["metrics"]): string {
  return SKILL_TO_LESSON[metric].skill;
}
