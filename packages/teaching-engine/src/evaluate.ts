import { ERROR_COACHING, ERROR_FEEDBACK, SCORE_WEIGHTS, STEP_BY_CODE } from "./constants";
import { normalizeText, sameTokenSet } from "./normalize";
import type {
  Attempt,
  AttemptEvaluation,
  ElementCode,
  ElementSolution,
  ErrorType,
  ScoreBreakdown,
  SentenceDefinition,
  StepEvaluation
} from "./types";

const EVALUATED_CODES: ElementCode[] = ["F", "İm", "Ö", "Z1", "Z2", "N1", "N2"];

export function evaluateAttempt(sentence: SentenceDefinition, attempt: Attempt): AttemptEvaluation {
  if (!sentence.supported) {
    return createUnsupportedEvaluation(sentence.id);
  }

  const steps: StepEvaluation[] = [];

  if (attempt.requestedTranslationBeforeWork) {
    steps.push({
      step: "produce_sentence",
      isCorrect: false,
      errorType: "translation_too_early",
      feedback: ERROR_FEEDBACK.translation_too_early,
      coach: ERROR_COACHING.translation_too_early
    });
  }

  for (const code of EVALUATED_CODES) {
    const expected = getElement(sentence, code);

    if (!expected) {
      continue;
    }

    const actual = attempt.elements.find((answer) => answer.code === code);
    steps.push(evaluateElement(sentence, expected, actual));
  }

  const orderCorrect = sameOrder(sentence.englishOrder, attempt.englishOrder);
  steps.push({
    step: "order_elements",
    isCorrect: orderCorrect,
    expected: sentence.englishOrder.join(" + "),
    actual: attempt.englishOrder.join(" + "),
    errorType: orderCorrect ? null : "order_wrong",
    feedback: orderCorrect ? "İngilizce dizilim doğru." : ERROR_FEEDBACK.order_wrong
    ,
    coach: orderCorrect ? undefined : ERROR_COACHING.order_wrong
  });

  const finalSentenceCorrect = isAcceptedFinalSentence(sentence, attempt.finalSentence);
  steps.push({
    step: "produce_sentence",
    isCorrect: finalSentenceCorrect,
    expected: sentence.targetSentence,
    actual: attempt.finalSentence,
    errorType: finalSentenceCorrect ? null : "final_sentence_wrong",
    feedback: finalSentenceCorrect
      ? "Son cümle kabul edilen hedeflerden biriyle eşleşiyor."
      : ERROR_FEEDBACK.final_sentence_wrong,
    coach: finalSentenceCorrect ? undefined : ERROR_COACHING.final_sentence_wrong
  });

  const score = scoreAttempt(steps);
  const primaryError = steps.find((step) => !step.isCorrect)?.errorType ?? null;

  return {
    sentenceId: sentence.id,
    isCorrect: steps.every((step) => step.isCorrect),
    steps,
    score,
    primaryError
  };
}

function evaluateElement(
  sentence: SentenceDefinition,
  expected: ElementSolution,
  actual: Attempt["elements"][number] | undefined
): StepEvaluation {
  if (!actual) {
    const errorType = missingErrorFor(expected.code);

    return {
      step: STEP_BY_CODE[expected.code],
      code: expected.code,
      isCorrect: false,
      expected: expected.text,
      errorType,
      feedback: ERROR_FEEDBACK[errorType],
      coach: ERROR_COACHING[errorType]
    };
  }

  const exactText = normalizeText(actual.text) === normalizeText(expected.text);
  const exactTokens = sameTokenSet(actual.tokenIds, expected.tokenIds);
  const isCorrect = exactText && exactTokens;

  if (isCorrect) {
    return {
      step: STEP_BY_CODE[expected.code],
      code: expected.code,
      isCorrect: true,
      expected: expected.text,
      actual: actual.text,
      errorType: null,
      feedback: `${expected.code} doğru etiketlendi.`
    };
  }

  const confusedWith = findElementByAnswer(sentence, actual);
  const errorType = classifyElementError(expected.code, confusedWith?.code);

  return {
    step: STEP_BY_CODE[expected.code],
    code: expected.code,
    isCorrect: false,
    expected: expected.text,
    actual: actual.text,
    errorType,
    feedback: ERROR_FEEDBACK[errorType],
    coach: ERROR_COACHING[errorType]
  };
}

function getElement(sentence: SentenceDefinition, code: ElementCode): ElementSolution | undefined {
  return sentence.elements.find((element) => element.code === code);
}

function findElementByAnswer(
  sentence: SentenceDefinition,
  actual: Attempt["elements"][number]
): ElementSolution | undefined {
  return sentence.elements.find((element) => {
    return (
      sameTokenSet(element.tokenIds, actual.tokenIds) ||
      normalizeText(element.text) === normalizeText(actual.text)
    );
  });
}

function classifyElementError(expected: ElementCode, confusedWith?: ElementCode): ErrorType {
  if (expected === "F") {
    return confusedWith ? "f_wrong" : "f_not_found";
  }

  if (expected === "İm") {
    return confusedWith ? "im_wrong_boundary" : "im_missing";
  }

  if (expected === "Ö") {
    return "subject_missing";
  }

  if (expected === "Z1" && (confusedWith === "N1" || confusedWith === "N2")) {
    return "z1_n_confusion";
  }

  if (expected === "Z1") {
    return "z1_missing";
  }

  if (expected === "Z2" && confusedWith === "N2") {
    return "n2_z2_confusion";
  }

  if (expected === "Z2") {
    return "z2_missing";
  }

  if ((expected === "N1" && confusedWith === "N2") || (expected === "N2" && confusedWith === "N1")) {
    return "n1_n2_confusion";
  }

  if (expected === "N2" && confusedWith === "Z2") {
    return "n2_z2_confusion";
  }

  return "n1_n2_confusion";
}

function missingErrorFor(code: ElementCode): ErrorType {
  if (code === "F") {
    return "f_not_found";
  }

  if (code === "İm") {
    return "im_missing";
  }

  if (code === "Ö") {
    return "subject_missing";
  }

  if (code === "Z1") {
    return "z1_missing";
  }

  if (code === "Z2") {
    return "z2_missing";
  }

  return "n1_n2_confusion";
}

function sameOrder(expected: ElementCode[], actual: ElementCode[]): boolean {
  return expected.length === actual.length && expected.every((code, index) => code === actual[index]);
}

function isAcceptedFinalSentence(sentence: SentenceDefinition, finalSentence: string | undefined): boolean {
  if (!finalSentence) {
    return false;
  }

  const accepted = [sentence.targetSentence, ...sentence.acceptedVariants].map(normalizeText);
  return accepted.includes(normalizeText(finalSentence));
}

function scoreAttempt(steps: StepEvaluation[]): ScoreBreakdown {
  const elementSteps = steps.filter((step) => step.code);
  const correctElementSteps = elementSteps.filter((step) => step.isCorrect);
  const orderStep = steps.find((step) => step.step === "order_elements");
  const finalStep = [...steps].reverse().find((step) => step.step === "produce_sentence");
  const processPenalties = steps.filter(
    (step) => step.errorType === "translation_too_early" || step.errorType === "unsupported_sentence"
  ).length;

  const elementAccuracy =
    elementSteps.length === 0
      ? SCORE_WEIGHTS.elementAccuracy
      : Math.round((correctElementSteps.length / elementSteps.length) * SCORE_WEIGHTS.elementAccuracy);
  const processOrder = Math.max(0, SCORE_WEIGHTS.processOrder - processPenalties * 15);
  const englishOrder = orderStep?.isCorrect ? SCORE_WEIGHTS.englishOrder : 0;
  const finalSentence = finalStep?.isCorrect ? SCORE_WEIGHTS.finalSentence : 0;
  const speaking = finalStep?.isCorrect ? SCORE_WEIGHTS.speaking : 0;

  return {
    processOrder,
    elementAccuracy,
    englishOrder,
    finalSentence,
    speaking,
    total: processOrder + elementAccuracy + englishOrder + finalSentence + speaking
  };
}

function createUnsupportedEvaluation(sentenceId: string): AttemptEvaluation {
  const step: StepEvaluation = {
    step: "produce_sentence",
    isCorrect: false,
    errorType: "unsupported_sentence",
    feedback: ERROR_FEEDBACK.unsupported_sentence,
    coach: ERROR_COACHING.unsupported_sentence
  };

  return {
    sentenceId,
    isCorrect: false,
    steps: [step],
    score: {
      processOrder: 0,
      elementAccuracy: 0,
      englishOrder: 0,
      finalSentence: 0,
      speaking: 0,
      total: 0
    },
    primaryError: "unsupported_sentence"
  };
}
