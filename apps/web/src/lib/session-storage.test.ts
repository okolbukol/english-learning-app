import { describe, expect, it } from "vitest";
import type { SolvedSentenceRecord } from "./learning-analytics";
import {
  SESSION_STORAGE_KEY,
  clearSession,
  createPersistedSession,
  loadSession,
  parseSession,
  saveSession,
  serializeSession,
  type SessionStorageLike
} from "./session-storage";

function createRecord(overrides: Partial<SolvedSentenceRecord> = {}): SolvedSentenceRecord {
  return {
    sentenceId: "sent_0001",
    sentence: "Bugün ofise gizlice bir paket bırakmalısın.",
    score: 100,
    durationMs: 42000,
    firstAttemptSuccess: true,
    hintCount: 0,
    primaryError: null,
    wrongLabels: [],
    lesson: "ofzinnz-temel",
    difficulty: 2,
    isTransfer: false,
    ...overrides
  };
}

function createFakeStorage(initial: Record<string, string> = {}): SessionStorageLike & { data: Record<string, string> } {
  const data = { ...initial };

  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
    removeItem: (key) => {
      delete data[key];
    }
  };
}

describe("session storage", () => {
  it("round-trips a persisted session", () => {
    const session = createPersistedSession({
      participantCode: "P002",
      questionIndex: 4,
      records: [createRecord()],
      savedAt: "2026-07-29T10:00:00.000Z"
    });

    const parsed = parseSession(serializeSession(session));

    expect(parsed).toEqual(session);
  });

  it("saves, loads and clears through a storage implementation", () => {
    const storage = createFakeStorage();
    const session = createPersistedSession({
      participantCode: "P001",
      questionIndex: 1,
      records: [createRecord({ score: 80, wrongLabels: ["N2"] })]
    });

    saveSession(storage, session);
    expect(storage.data[SESSION_STORAGE_KEY]).toBeTruthy();
    expect(loadSession(storage)?.records[0]?.wrongLabels).toEqual(["N2"]);

    clearSession(storage);
    expect(loadSession(storage)).toBeNull();
  });

  it("rejects corrupted or foreign stored values instead of throwing", () => {
    expect(parseSession(null)).toBeNull();
    expect(parseSession("not json")).toBeNull();
    expect(parseSession(JSON.stringify({ schemaVersion: "2.0" }))).toBeNull();
    expect(
      parseSession(
        JSON.stringify({ schemaVersion: "1.0", participantCode: "tolga", questionIndex: 0, records: [], savedAt: "x" })
      )
    ).toBeNull();
    expect(
      parseSession(
        JSON.stringify({ schemaVersion: "1.0", participantCode: "P001", questionIndex: -1, records: [], savedAt: "x" })
      )
    ).toBeNull();
    expect(
      parseSession(
        JSON.stringify({
          schemaVersion: "1.0",
          participantCode: "P001",
          questionIndex: 0,
          records: [{ ...createRecord(), score: 140 }],
          savedAt: "x"
        })
      )
    ).toBeNull();
  });

  it("stays inert when storage is unavailable", () => {
    expect(loadSession(undefined)).toBeNull();
    expect(() => saveSession(undefined, createPersistedSession({ participantCode: "P001", questionIndex: 0, records: [] }))).not.toThrow();
    expect(() => clearSession(undefined)).not.toThrow();
  });

  it("survives a storage backend that throws", () => {
    const brokenStorage: SessionStorageLike = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("quota exceeded");
      },
      removeItem: () => {
        throw new Error("blocked");
      }
    };

    expect(loadSession(brokenStorage)).toBeNull();
    expect(() =>
      saveSession(brokenStorage, createPersistedSession({ participantCode: "P001", questionIndex: 0, records: [createRecord()] }))
    ).not.toThrow();
    expect(() => clearSession(brokenStorage)).not.toThrow();
  });
});
