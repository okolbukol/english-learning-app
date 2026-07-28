import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LessonClient } from "./lesson-client";
import { getFixtureSentence } from "@html2pdf-pro/teaching-engine";
import { SESSION_STORAGE_KEY, createPersistedSession, serializeSession } from "../lib/session-storage";

afterEach(() => {
  window.localStorage.clear();
});

describe("LessonClient", () => {
  it("renders the engine-backed sentence solving workspace", () => {
    render(<LessonClient />);

    expect(screen.getByRole("heading", { name: "Kod Değiştirme İngilizce" })).toBeTruthy();
    expect(screen.getByText(getFixtureSentence("sent_0001").trSentence)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Hata Koçu" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Kullanıcı Raporu" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Öğretim Analitiği" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Oturum Kaydı" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Yeni katılımcı için sıfırla" })).toHaveProperty("disabled", true);
  });

  it("restores an interrupted session stored in the browser", () => {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      serializeSession(
        createPersistedSession({
          participantCode: "P007",
          questionIndex: 2,
          records: [
            {
              sentenceId: "sent_0001",
              sentence: getFixtureSentence("sent_0001").trSentence,
              score: 80,
              durationMs: 30000,
              firstAttemptSuccess: false,
              hintCount: 1,
              primaryError: "n2_z2_confusion",
              wrongLabels: ["N2"],
              lesson: "ofzinnz-temel",
              difficulty: 2,
              isTransfer: false
            }
          ]
        })
      )
    );

    render(<LessonClient />);

    expect(screen.getByText(/Yarım kalan oturum geri yüklendi/)).toBeTruthy();
    expect(screen.getByText("Kayıtlı cevap: 1")).toBeTruthy();
    expect(screen.getByDisplayValue("P007")).toBeTruthy();
  });

  it("ignores a corrupted stored session", () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, "{ broken");

    render(<LessonClient />);

    expect(screen.queryByText(/Yarım kalan oturum geri yüklendi/)).toBeNull();
    expect(screen.getByText("Kayıtlı cevap: 0")).toBeTruthy();
  });
});
