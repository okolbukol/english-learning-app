import type { SentenceDefinition } from "./types";
import { stageOneSentences } from "./stage-one-content";

export const fixtureSentences: SentenceDefinition[] = stageOneSentences;

export function getFixtureSentence(id: string): SentenceDefinition {
  const sentence = fixtureSentences.find((item) => item.id === id);

  if (!sentence) {
    throw new Error(`Fixture sentence not found: ${id}`);
  }

  return sentence;
}
