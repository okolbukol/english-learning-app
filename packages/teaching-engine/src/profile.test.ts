import { describe, expect, it } from "vitest";
import { createInitialSkillProfile, getWeakestSkills, recommendNextPractice, updateUserSkillProfile } from "./profile";
import { evaluateAttempt } from "./evaluate";
import { getFixtureSentence } from "./fixtures";
import type { UserSkillProfile } from "./types";

describe("practice recommendation", () => {
  it("recommends the weakest skill by default", () => {
    const profile: UserSkillProfile = {
      userId: "user_1",
      metrics: {
        fAccuracy: 0.92,
        imAccuracy: 0.81,
        subjectAccuracy: 0.76,
        z1Accuracy: 0.68,
        z2Accuracy: 0.74,
        n1n2Accuracy: 0.61,
        englishOrderAccuracy: 0.83
      },
      recentErrors: []
    };

    expect(recommendNextPractice(profile)).toMatchObject({
      skill: "nesne ayrımı",
      lesson: "n1-n2-ayrimi"
    });
  });

  it("prioritizes repeated N2/Z2 confusion", () => {
    const profile: UserSkillProfile = {
      userId: "user_1",
      metrics: {
        fAccuracy: 0.5,
        imAccuracy: 0.81,
        subjectAccuracy: 0.76,
        z1Accuracy: 0.68,
        z2Accuracy: 0.74,
        n1n2Accuracy: 0.61,
        englishOrderAccuracy: 0.83
      },
      recentErrors: ["n2_z2_confusion", "n2_z2_confusion"]
    };

    expect(recommendNextPractice(profile)).toMatchObject({
      skill: "N2/Z2 ayrımı",
      lesson: "n2-z2-ayrimi"
    });
  });

  it("updates progress from an evaluated attempt", () => {
    const sentence = getFixtureSentence("sent_0001");
    const profile = createInitialSkillProfile("user_1");
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

    const updated = updateUserSkillProfile(profile, evaluation);

    expect(updated.completedAttempts).toBe(1);
    expect(updated.averageScore).toBe(100);
    expect(updated.metrics.fAccuracy).toBeGreaterThan(0);
    expect(getWeakestSkills(updated, 2)).toHaveLength(2);
  });
});
