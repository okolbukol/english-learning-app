export type ElementCode = "Ö" | "F" | "Z1" | "İm" | "N1" | "N2" | "Z2";

export type WordKind = "isim" | "sıfat" | "belirteç" | "edat" | "eylem" | "ortaç";

export type ErrorType =
  | "f_not_found"
  | "f_wrong"
  | "im_missing"
  | "im_wrong_boundary"
  | "subject_missing"
  | "z1_missing"
  | "z1_n_confusion"
  | "z2_missing"
  | "n2_z2_confusion"
  | "n1_n2_confusion"
  | "order_wrong"
  | "final_sentence_wrong"
  | "translation_too_early"
  | "unsupported_sentence";

export type EvaluationStep =
  | "select_f"
  | "select_im"
  | "select_subject"
  | "label_z1"
  | "label_z2"
  | "label_n1"
  | "label_n2"
  | "order_elements"
  | "produce_sentence";

export interface Token {
  id: string;
  text: string;
  start: number;
  end: number;
}

export interface ElementSolution {
  code: ElementCode;
  text: string;
  tokenIds: string[];
  hidden?: boolean;
}

export interface SentenceDefinition {
  id: string;
  stage: 1 | 2 | 3 | 4;
  lesson: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  trSentence: string;
  normalizedTrSentence: string;
  tokens: Token[];
  elements: ElementSolution[];
  englishOrder: ElementCode[];
  targetSentence: string;
  acceptedVariants: string[];
  tags: string[];
  supported: boolean;
}

export interface ElementAnswer {
  code: ElementCode;
  text: string;
  tokenIds: string[];
}

export interface Attempt {
  sentenceId: string;
  elements: ElementAnswer[];
  englishOrder: ElementCode[];
  finalSentence?: string;
  requestedTranslationBeforeWork?: boolean;
}

export interface StepEvaluation {
  step: EvaluationStep;
  code?: ElementCode;
  isCorrect: boolean;
  expected?: string;
  actual?: string;
  errorType: ErrorType | null;
  feedback: string;
  coach?: CoachFeedback;
}

export interface CoachFeedback {
  title: string;
  why: string;
  fix: string;
  miniPractice: string;
}

export interface ScoreBreakdown {
  processOrder: number;
  elementAccuracy: number;
  englishOrder: number;
  finalSentence: number;
  speaking: number;
  total: number;
}

export interface AttemptEvaluation {
  sentenceId: string;
  isCorrect: boolean;
  steps: StepEvaluation[];
  score: ScoreBreakdown;
  primaryError: ErrorType | null;
}

export interface SkillMetrics {
  fAccuracy: number;
  imAccuracy: number;
  subjectAccuracy: number;
  z1Accuracy: number;
  z2Accuracy: number;
  n1n2Accuracy: number;
  englishOrderAccuracy: number;
}

export interface UserSkillProfile {
  userId: string;
  metrics: SkillMetrics;
  recentErrors: ErrorType[];
  completedAttempts?: number;
  averageScore?: number;
  masteredSkills?: string[];
  needsPractice?: string[];
}

export interface NextPracticeRecommendation {
  skill: string;
  lesson: string;
  reason: string;
}

export interface AiGuardrailResult {
  allowed: boolean;
  violations: Array<
    | "reveals_answer_too_early"
    | "wrong_step_order"
    | "unsupported_labels"
    | "outside_mvp_scope"
  >;
}
