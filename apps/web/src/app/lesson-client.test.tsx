import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonClient } from "./lesson-client";
import { getFixtureSentence } from "@html2pdf-pro/teaching-engine";

describe("LessonClient", () => {
  it("renders the engine-backed sentence solving workspace", () => {
    render(<LessonClient />);

    expect(screen.getByRole("heading", { name: "Kod Değiştirme İngilizce" })).toBeTruthy();
    expect(screen.getByText(getFixtureSentence("sent_0001").trSentence)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Hata Koçu" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Kullanıcı Raporu" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Öğretim Analitiği" })).toBeTruthy();
  });
});
