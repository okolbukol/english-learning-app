import type { ElementCode, ElementSolution, SentenceDefinition, Token } from "./types";

interface Segment {
  text: string;
  english: string;
}

interface VerbPattern {
  final: string;
  im: string;
  f: string;
  subject: string;
  defaultN1: Segment;
  englishTemplate: (parts: { z1?: string; im: string; n1?: string; n2?: string; z2?: string }) => string;
  tags: string[];
}

interface SentenceSeed {
  id: string;
  lesson: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  z2?: Segment;
  n2?: Segment;
  z1?: Segment;
  n1?: Segment;
  verb: VerbPattern;
}

const z2Segments: Segment[] = [
  { text: "Bugün", english: "today" },
  { text: "Yarın", english: "tomorrow" },
  { text: "Dün", english: "yesterday" },
  { text: "Bu sabah", english: "this morning" },
  { text: "Bu akşam", english: "this evening" },
  { text: "Her gün", english: "every day" },
  { text: "Gelecek hafta", english: "next week" },
  { text: "Geçen hafta", english: "last week" },
  { text: "Şimdi", english: "now" },
  { text: "Bu yıl", english: "this year" }
];

const n2Segments: Segment[] = [
  { text: "ofise", english: "to the office" },
  { text: "evde", english: "at home" },
  { text: "okulda", english: "at school" },
  { text: "masaya", english: "on the table" },
  { text: "arkadaşa", english: "to the friend" },
  { text: "toplantıda", english: "in the meeting" },
  { text: "bahçede", english: "in the garden" },
  { text: "şirkete", english: "to the company" },
  { text: "kütüphanede", english: "in the library" },
  { text: "mutfakta", english: "in the kitchen" }
];

const z1Segments: Segment[] = [
  { text: "gizlice", english: "secretly" },
  { text: "dikkatlice", english: "carefully" },
  { text: "hızlıca", english: "quickly" },
  { text: "sessizce", english: "silently" },
  { text: "açıkça", english: "clearly" },
  { text: "kolayca", english: "easily" },
  { text: "resmen", english: "officially" },
  { text: "yavaşça", english: "slowly" },
  { text: "düzenli olarak", english: "regularly" },
  { text: "nazikçe", english: "kindly" }
];

const mustVerbs: VerbPattern[] = [
  makeMustVerb("bırakmalısın", "bırak", "drop", { text: "bir paket", english: "a package" }),
  makeMustVerb("doldurmalısın", "doldur", "fill out", { text: "bu formu", english: "this form" }),
  makeMustVerb("hazırlamalısın", "hazırla", "prepare", { text: "yeni raporu", english: "the new report" }),
  makeMustVerb("açmalısın", "aç", "open", { text: "kapıyı", english: "the door" }),
  makeMustVerb("göndermelisin", "gönder", "send", { text: "önemli mesajı", english: "the important message" }),
  makeMustVerb("taşımalısın", "taşı", "carry", { text: "küçük kutuyu", english: "the small box" }),
  makeMustVerb("okumalısın", "oku", "read", { text: "eski defteri", english: "the old notebook" }),
  makeMustVerb("yazmalısın", "yaz", "write", { text: "kısa notu", english: "the short note" }),
  makeMustVerb("yıkamalısın", "yıka", "wash", { text: "boş bardağı", english: "the empty glass" }),
  makeMustVerb("almalısın", "al", "take", { text: "mavi kalemi", english: "the blue pen" })
];

const pastVerbs: VerbPattern[] = [
  makePastVerb("bıraktım", "bırak", "dropped", { text: "bir paket", english: "a package" }),
  makePastVerb("doldurdum", "doldur", "filled out", { text: "bu formu", english: "this form" }),
  makePastVerb("hazırladım", "hazırla", "prepared", { text: "yeni raporu", english: "the new report" }),
  makePastVerb("açtım", "aç", "opened", { text: "kapıyı", english: "the door" }),
  makePastVerb("gönderdim", "gönder", "sent", { text: "önemli mesajı", english: "the important message" }),
  makePastVerb("taşıdım", "taşı", "carried", { text: "küçük kutuyu", english: "the small box" }),
  makePastVerb("okudum", "oku", "read", { text: "eski defteri", english: "the old notebook" }),
  makePastVerb("yazdım", "yaz", "wrote", { text: "kısa notu", english: "the short note" }),
  makePastVerb("yıkadım", "yıka", "washed", { text: "boş bardağı", english: "the empty glass" }),
  makePastVerb("aldım", "al", "took", { text: "mavi kalemi", english: "the blue pen" })
];

const futureVerbs: VerbPattern[] = [
  makeFutureVerb("bırakacağım", "bırak", "drop", { text: "bir paket", english: "a package" }),
  makeFutureVerb("dolduracağım", "doldur", "fill out", { text: "bu formu", english: "this form" }),
  makeFutureVerb("hazırlayacağım", "hazırla", "prepare", { text: "yeni raporu", english: "the new report" }),
  makeFutureVerb("açacağım", "aç", "open", { text: "kapıyı", english: "the door" }),
  makeFutureVerb("göndereceğim", "gönder", "send", { text: "önemli mesajı", english: "the important message" }),
  makeFutureVerb("taşıyacağım", "taşı", "carry", { text: "küçük kutuyu", english: "the small box" }),
  makeFutureVerb("okuyacağım", "oku", "read", { text: "eski defteri", english: "the old notebook" }),
  makeFutureVerb("yazacağım", "yaz", "write", { text: "kısa notu", english: "the short note" }),
  makeFutureVerb("yıkayacağım", "yıka", "wash", { text: "boş bardağı", english: "the empty glass" }),
  makeFutureVerb("alacağım", "al", "take", { text: "mavi kalemi", english: "the blue pen" })
];

const canVerbs: VerbPattern[] = [
  makeCanVerb("bırakabilirsin", "bırak", "drop", { text: "bir paket", english: "a package" }),
  makeCanVerb("doldurabilirsin", "doldur", "fill out", { text: "bu formu", english: "this form" }),
  makeCanVerb("hazırlayabilirsin", "hazırla", "prepare", { text: "yeni raporu", english: "the new report" }),
  makeCanVerb("açabilirsin", "aç", "open", { text: "kapıyı", english: "the door" }),
  makeCanVerb("gönderebilirsin", "gönder", "send", { text: "önemli mesajı", english: "the important message" }),
  makeCanVerb("taşıyabilirsin", "taşı", "carry", { text: "küçük kutuyu", english: "the small box" }),
  makeCanVerb("okuyabilirsin", "oku", "read", { text: "eski defteri", english: "the old notebook" }),
  makeCanVerb("yazabilirsin", "yaz", "write", { text: "kısa notu", english: "the short note" }),
  makeCanVerb("yıkayabilirsin", "yıka", "wash", { text: "boş bardağı", english: "the empty glass" }),
  makeCanVerb("alabilirsin", "al", "take", { text: "mavi kalemi", english: "the blue pen" })
];

const seeds: SentenceSeed[] = [
  ...mustVerbs.map((verb, index) => makeSeed(1 + index, "ofzinnz-temel", 2, verb, index)),
  ...pastVerbs.map((verb, index) => makeSeed(11 + index, "gecmis-zaman-temel", 2, verb, index + 2)),
  ...futureVerbs.map((verb, index) => makeSeed(21 + index, "gelecek-zaman-temel", 2, verb, index + 4)),
  ...canVerbs.map((verb, index) => makeSeed(31 + index, "abilir-temel", 2, verb, index + 6)),
  ...mustVerbs.map((verb, index) => makeSeed(41 + index, "z2-temel", 1, verb, index, { z1: false, n1: false })),
  ...pastVerbs.map((verb, index) => makeSeed(51 + index, "n1-temel", 1, verb, index + 1, { z1: false, n2: false })),
  ...futureVerbs.map((verb, index) => makeSeed(61 + index, "n2-temel", 1, verb, index + 2, { z1: false, n1: false })),
  ...canVerbs.map((verb, index) => makeSeed(71 + index, "z1-temel", 1, verb, index + 3, { n1: false, n2: false })),
  ...mustVerbs.map((verb, index) => makeSeed(81 + index, "n1-n2-ayrimi", 3, verb, index + 4, { z2: false })),
  ...pastVerbs.map((verb, index) => makeSeed(91 + index, "z1-z2-transfer", 3, verb, index + 5, { n2: false }))
];

export const stageOneSentences: SentenceDefinition[] = seeds.map(buildSentence);

function makeMustVerb(final: string, im: string, englishVerb: string, defaultN1: Segment): VerbPattern {
  return {
    final,
    im,
    f: "-malı",
    subject: "sen",
    defaultN1,
    englishTemplate: ({ z1, n1, n2, z2 }) =>
      joinEnglish(["You must", z1, englishVerb, n1, n2, z2]),
    tags: ["f-mali", "gizli-ozne"]
  };
}

function makePastVerb(final: string, im: string, englishVerb: string, defaultN1: Segment): VerbPattern {
  return {
    final,
    im,
    f: "-di",
    subject: "ben",
    defaultN1,
    englishTemplate: ({ z1, n1, n2, z2 }) => joinEnglish(["I", z1, englishVerb, n1, n2, z2]),
    tags: ["past", "gizli-ozne"]
  };
}

function makeFutureVerb(final: string, im: string, englishVerb: string, defaultN1: Segment): VerbPattern {
  return {
    final,
    im,
    f: "-ecek",
    subject: "ben",
    defaultN1,
    englishTemplate: ({ z1, n1, n2, z2 }) =>
      joinEnglish(["I will", z1, englishVerb, n1, n2, z2]),
    tags: ["future", "gizli-ozne"]
  };
}

function makeCanVerb(final: string, im: string, englishVerb: string, defaultN1: Segment): VerbPattern {
  return {
    final,
    im,
    f: "-ebilir",
    subject: "sen",
    defaultN1,
    englishTemplate: ({ z1, n1, n2, z2 }) =>
      joinEnglish(["You can", z1, englishVerb, n1, n2, z2]),
    tags: ["can", "gizli-ozne"]
  };
}

function makeSeed(
  numericId: number,
  lesson: string,
  difficulty: 1 | 2 | 3 | 4 | 5,
  verb: VerbPattern,
  offset: number,
  include: { z2?: boolean; n2?: boolean; z1?: boolean; n1?: boolean } = {}
): SentenceSeed {
  const use = {
    z2: include.z2 ?? true,
    n2: include.n2 ?? true,
    z1: include.z1 ?? true,
    n1: include.n1 ?? true
  };

  return {
    id: `sent_${numericId.toString().padStart(4, "0")}`,
    lesson,
    difficulty,
    z2: use.z2 ? pick(z2Segments, offset) : undefined,
    n2: use.n2 ? pick(n2Segments, offset + 1) : undefined,
    z1: use.z1 ? pick(z1Segments, offset + 2) : undefined,
    n1: use.n1 ? verb.defaultN1 : undefined,
    verb
  };
}

function buildSentence(seed: SentenceSeed): SentenceDefinition {
  const parts = [seed.z2, seed.n2, seed.z1, seed.n1]
    .filter((part): part is Segment => Boolean(part))
    .map((part) => part.text);
  const finalParts = [...parts, seed.verb.final];
  const trSentence = `${finalParts.join(" ")}.`;
  const tokens = tokenize(finalParts);
  const verbTokenId = tokens[tokens.length - 1]?.id;

  if (!verbTokenId) {
    throw new Error(`Sentence has no verb token: ${seed.id}`);
  }

  const rawElements: Array<ElementSolution | undefined> = [
    seed.z2 ? { code: "Z2" as const, text: seed.z2.text, tokenIds: [findToken(tokens, seed.z2.text)] } : undefined,
    seed.n2 ? { code: "N2" as const, text: seed.n2.text, tokenIds: [findToken(tokens, seed.n2.text)] } : undefined,
    seed.z1 ? { code: "Z1" as const, text: seed.z1.text, tokenIds: [findToken(tokens, seed.z1.text)] } : undefined,
    seed.n1 ? { code: "N1" as const, text: seed.n1.text, tokenIds: [findToken(tokens, seed.n1.text)] } : undefined,
    { code: "İm" as const, text: seed.verb.im, tokenIds: [verbTokenId] },
    { code: "F" as const, text: seed.verb.f, tokenIds: [verbTokenId] },
    { code: "Ö" as const, text: seed.verb.subject, tokenIds: [], hidden: true }
  ];
  const elements = rawElements.filter((element): element is ElementSolution => element !== undefined);

  const englishOrder = ["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"].filter((code) =>
    elements.some((element) => element.code === code)
  ) as ElementCode[];

  return {
    id: seed.id,
    stage: 1,
    lesson: seed.lesson,
    difficulty: seed.difficulty,
    trSentence,
    normalizedTrSentence: trSentence,
    tokens,
    elements,
    englishOrder,
    targetSentence: seed.verb.englishTemplate({
      z1: seed.z1?.english,
      im: seed.verb.im,
      n1: seed.n1?.english,
      n2: seed.n2?.english,
      z2: seed.z2?.english
    }),
    acceptedVariants: [],
    tags: ["etap-1", seed.lesson, ...seed.verb.tags],
    supported: true
  };
}

function tokenize(parts: string[]): Token[] {
  let cursor = 0;

  return parts.map((text, index) => {
    const start = cursor;
    const end = start + text.length;
    cursor = end + 1;

    return {
      id: `t${index + 1}`,
      text,
      start,
      end
    };
  });
}

function findToken(tokens: Token[], text: string): string {
  const token = tokens.find((item) => item.text === text);

  if (!token) {
    throw new Error(`Token not found for ${text}`);
  }

  return token.id;
}

function pick<T>(items: T[], offset: number): T {
  const item = items[offset % items.length];

  if (!item) {
    throw new Error("Content source is empty.");
  }

  return item;
}

function joinEnglish(parts: Array<string | undefined>): string {
  return `${parts.filter(Boolean).join(" ")}.`;
}
