import { fireEvent, render, screen } from "@testing-library/react";
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

  it("reveals progressive hints and counts every request", () => {
    render(<LessonClient />);

    const hintButton = () => screen.getByRole("button", { name: /^İpucu \(/ });

    expect(screen.getByText(/İpuçları adım adım açılır/)).toBeTruthy();
    expect(screen.queryByText(/1\. İpucu/)).toBeNull();

    fireEvent.click(hintButton());
    expect(screen.getByText(/1\. İpucu/)).toBeTruthy();
    expect(screen.queryByText(/2\. İpucu/)).toBeNull();
    expect(hintButton().textContent).toContain("(1)");

    fireEvent.click(hintButton());
    expect(screen.getByText(/2\. İpucu: Etiket sırası/)).toBeTruthy();
    expect(screen.queryByText(/3\. İpucu/)).toBeNull();

    fireEvent.click(hintButton());
    expect(screen.getByText(/3\. İpucu: Cümle yapısı/)).toBeTruthy();
    expect(hintButton().textContent).toContain("(3)");

    // Capped: no further request is possible, so the counter cannot drift.
    expect(hintButton()).toHaveProperty("disabled", true);
    expect(screen.getByText(/Son ipucundasın/)).toBeTruthy();

    const targetSentence = getFixtureSentence("sent_0001").targetSentence;
    expect(document.body.textContent).not.toContain(targetSentence);
  });

  it("clears revealed hints when moving to the next question", () => {
    render(<LessonClient />);

    fireEvent.click(screen.getByRole("button", { name: /^İpucu \(/ }));
    expect(screen.getByText(/1\. İpucu/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Denetle" }));
    fireEvent.click(screen.getByRole("button", { name: "Sonraki soru" }));

    expect(screen.queryByText(/1\. İpucu/)).toBeNull();
    expect(screen.getByRole("button", { name: "İpucu (0)" })).toBeTruthy();
  });

  it("records the hint count that the participant actually used", () => {
    render(<LessonClient />);

    fireEvent.click(screen.getByRole("button", { name: /^İpucu \(/ }));
    fireEvent.click(screen.getByRole("button", { name: /^İpucu \(/ }));
    fireEvent.click(screen.getByRole("button", { name: "Denetle" }));

    const stored = JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY) ?? "{}");

    expect(stored.records).toHaveLength(1);
    expect(stored.records[0].hintCount).toBe(2);
  });

  it("does not restore an open hint from an interrupted session", () => {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      serializeSession(
        createPersistedSession({
          participantCode: "P004",
          questionIndex: 1,
          records: [
            {
              sentenceId: "sent_0001",
              sentence: getFixtureSentence("sent_0001").trSentence,
              score: 65,
              durationMs: 30000,
              firstAttemptSuccess: false,
              hintCount: 3,
              primaryError: "f_not_found",
              wrongLabels: ["F"],
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
    expect(screen.queryByText(/1\. İpucu/)).toBeNull();
    expect(screen.getByRole("button", { name: "İpucu (0)" })).toBeTruthy();
  });

  it("ignores a corrupted stored session", () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, "{ broken");

    render(<LessonClient />);

    expect(screen.queryByText(/Yarım kalan oturum geri yüklendi/)).toBeNull();
    expect(screen.getByText("Kayıtlı cevap: 0")).toBeTruthy();
  });
});
