import type { AttemptEvaluation, SentenceDefinition, StepEvaluation } from "@html2pdf-pro/teaching-engine";

/** Hints stop here so a participant can never step through to a full answer. */
export const MAX_HINT_LEVEL = 3;

export type HintFocus = "label" | "order" | "final";

export interface LessonHint {
  level: number;
  focus: HintFocus;
  title: string;
  body: string;
}

/**
 * Turkish ortaç -> English carrier. Keyed on the F element the engine already
 * stores, so the hint layer never invents its own grammar table.
 */
const CARRIER_BY_F: Record<string, { english: string; note: string }> = {
  "-malı": { english: "must", note: "gereklilik" },
  "-ebilir": { english: "can", note: "yeterlik" },
  "-ecek": { english: "will", note: "gelecek zaman" },
  "-di": { english: "", note: "geçmiş zaman" }
};

const SUBJECT_ENGLISH: Record<string, string> = {
  ben: "I",
  sen: "You"
};

/**
 * Picks the step the participant is actually stuck on, following the method's
 * process order: elements first, then English order, then production.
 */
export function resolveHintFocus(evaluation: AttemptEvaluation): HintFocus {
  if (evaluation.steps.some((step) => step.code && !step.isCorrect)) {
    return "label";
  }

  if (evaluation.steps.some((step) => step.step === "order_elements" && !step.isCorrect)) {
    return "order";
  }

  return "final";
}

/** Returns hints 1..level, so revealed guidance stays cumulative and ordered. */
export function buildHints(
  sentence: SentenceDefinition,
  evaluation: AttemptEvaluation,
  level: number
): LessonHint[] {
  const capped = Math.min(Math.max(level, 0), MAX_HINT_LEVEL);

  return Array.from({ length: capped }, (_, index) => buildHint(sentence, evaluation, index + 1));
}

export function buildHint(
  sentence: SentenceDefinition,
  evaluation: AttemptEvaluation,
  level: number
): LessonHint {
  const focus = resolveHintFocus(evaluation);

  if (level <= 1) {
    return { level: 1, focus, ...ruleReminder(evaluation, focus) };
  }

  if (level === 2) {
    return { level: 2, focus, ...labelSequence(sentence) };
  }

  return { level: 3, focus, ...structureClue(sentence) };
}

/**
 * Hint 1 — reuses the error-coaching card the engine already produced for the
 * blocking step, so hint text and Hata Koçu text never drift apart.
 */
function ruleReminder(evaluation: AttemptEvaluation, focus: HintFocus): { title: string; body: string } {
  const blocking = blockingStep(evaluation, focus);
  const coach = blocking?.coach;

  if (focus === "label") {
    const code = blocking?.code;
    const opener = code ? `Şu an ${code} etiketini ara. ` : "Önce eksik etiketi ara. ";

    return {
      title: "1. İpucu: Hangi öğeyi arıyorsun",
      body: coach ? `${opener}${coach.why} ${coach.fix}` : `${opener}Yüklemden başla ve öğeleri tek tek ayır.`
    };
  }

  if (focus === "order") {
    return {
      title: "1. İpucu: Sıra kuralı",
      body: coach
        ? `Öğeleri doğru buldun. ${coach.why} ${coach.fix}`
        : "Öğeleri doğru buldun. Şimdi öğeleri İngilizce ana sırasına yerleştir."
    };
  }

  return {
    title: "1. İpucu: Son cümleyi gözden geçir",
    body: coach
      ? `Etiketler ve sıra doğru. ${coach.why} ${coach.fix}`
      : "Etiketler ve sıra doğru. Son cümlede kelime seçimini ve yazımı yeniden kontrol et."
  };
}

/** Hint 2 — label sequence only. Contains no English words by construction. */
function labelSequence(sentence: SentenceDefinition): { title: string; body: string } {
  return {
    title: "2. İpucu: Etiket sırası",
    body:
      `Bu cümlede ${sentence.englishOrder.length} öğe var. ` +
      `İngilizce sıra şu etiketlerle kurulur: ${sentence.englishOrder.join(" + ")}. ` +
      "İngilizce kelimeleri kendin yerleştir."
  };
}

/**
 * Hint 3 — opens only Ö and F, the two slots the method resolves first. The
 * imaj and every nesne/zarf stay closed, so the target sentence is never shown.
 */
function structureClue(sentence: SentenceDefinition): { title: string; body: string } {
  const subjectText = sentence.elements.find((element) => element.code === "Ö")?.text ?? "";
  const fText = sentence.elements.find((element) => element.code === "F")?.text ?? "";
  const subject = SUBJECT_ENGLISH[subjectText.toLocaleLowerCase("tr")];
  const carrier = CARRIER_BY_F[fText];

  if (!subject || !carrier) {
    return {
      title: "3. İpucu: Cümle yapısı",
      body: "Önce gizli özneyi İngilizceye taşı, sonra ortacın karşılığını yaz. İmajı ve nesneleri kendin ekle."
    };
  }

  if (carrier.english === "") {
    return {
      title: "3. İpucu: Cümle yapısı",
      body:
        `Ö = "${subjectText}" → ${subject}. F = "${fText}" → ${carrier.note}. ` +
        `Yardımcı kelime yok; imajın ikinci hâlini kullan. Cümlen "${subject}" ile başlar. ` +
        "Kalan öğeleri kendin ekle."
    };
  }

  return {
    title: "3. İpucu: Cümle yapısı",
    body:
      `Ö = "${subjectText}" → ${subject}. F = "${fText}" → ${carrier.note}, yani ${carrier.english}. ` +
      `Cümlen "${subject} ${carrier.english}" ile başlar. İmajı ve kalan öğeleri kendin ekle.`
  };
}

function blockingStep(evaluation: AttemptEvaluation, focus: HintFocus): StepEvaluation | undefined {
  if (focus === "label") {
    return evaluation.steps.find((step) => step.code && !step.isCorrect);
  }

  if (focus === "order") {
    return evaluation.steps.find((step) => step.step === "order_elements" && !step.isCorrect);
  }

  return [...evaluation.steps].reverse().find((step) => step.step === "produce_sentence" && !step.isCorrect);
}
