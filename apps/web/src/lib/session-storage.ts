import type { ElementCode, ErrorType } from "@html2pdf-pro/teaching-engine";
import type { SolvedSentenceRecord } from "./learning-analytics";

export const SESSION_STORAGE_KEY = "elp.test-session.v1";

export interface PersistedSession {
  schemaVersion: "1.0";
  participantCode: string;
  questionIndex: number;
  records: SolvedSentenceRecord[];
  savedAt: string;
}

/** Minimal subset of the Web Storage API so the helpers stay testable. */
export interface SessionStorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const ELEMENT_CODES: ElementCode[] = ["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"];

export function createPersistedSession(input: {
  participantCode: string;
  questionIndex: number;
  records: SolvedSentenceRecord[];
  savedAt?: string;
}): PersistedSession {
  return {
    schemaVersion: "1.0",
    participantCode: input.participantCode,
    questionIndex: input.questionIndex,
    records: input.records,
    savedAt: input.savedAt ?? new Date().toISOString()
  };
}

export function serializeSession(session: PersistedSession): string {
  return JSON.stringify(session);
}

/**
 * Parses stored session text. Returns null instead of throwing so a corrupted
 * entry can never block a participant from starting a session.
 */
export function parseSession(raw: string | null): PersistedSession | null {
  if (!raw) {
    return null;
  }

  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  if (value.schemaVersion !== "1.0") {
    return null;
  }

  if (typeof value.participantCode !== "string" || !/^P\d{3}$/.test(value.participantCode)) {
    return null;
  }

  if (typeof value.questionIndex !== "number" || !Number.isInteger(value.questionIndex) || value.questionIndex < 0) {
    return null;
  }

  if (typeof value.savedAt !== "string" || value.savedAt.length === 0) {
    return null;
  }

  if (!Array.isArray(value.records) || !value.records.every(isSolvedSentenceRecord)) {
    return null;
  }

  return {
    schemaVersion: "1.0",
    participantCode: value.participantCode,
    questionIndex: value.questionIndex,
    records: value.records,
    savedAt: value.savedAt
  };
}

export function loadSession(storage: SessionStorageLike | undefined): PersistedSession | null {
  if (!storage) {
    return null;
  }

  try {
    return parseSession(storage.getItem(SESSION_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveSession(storage: SessionStorageLike | undefined, session: PersistedSession): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(SESSION_STORAGE_KEY, serializeSession(session));
  } catch {
    // Storage can be full or blocked by the browser; the session keeps running in memory.
  }
}

export function clearSession(storage: SessionStorageLike | undefined): void {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Nothing to recover from; the in-memory session stays authoritative.
  }
}

/** Returns localStorage when available, undefined during SSR or when blocked. */
export function browserSessionStorage(): SessionStorageLike | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function isSolvedSentenceRecord(value: unknown): value is SolvedSentenceRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.sentenceId === "string" &&
    value.sentenceId.length > 0 &&
    typeof value.sentence === "string" &&
    value.sentence.length > 0 &&
    typeof value.score === "number" &&
    value.score >= 0 &&
    value.score <= 100 &&
    typeof value.durationMs === "number" &&
    value.durationMs >= 0 &&
    typeof value.firstAttemptSuccess === "boolean" &&
    typeof value.hintCount === "number" &&
    value.hintCount >= 0 &&
    isPrimaryError(value.primaryError) &&
    Array.isArray(value.wrongLabels) &&
    value.wrongLabels.every((label) => ELEMENT_CODES.includes(label as ElementCode)) &&
    typeof value.lesson === "string" &&
    typeof value.difficulty === "number" &&
    typeof value.isTransfer === "boolean"
  );
}

function isPrimaryError(value: unknown): value is ErrorType | null {
  return value === null || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
