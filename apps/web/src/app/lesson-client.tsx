"use client";

import {
  evaluateAttempt,
  stageOneSentences,
  type ElementCode,
  type SentenceDefinition
} from "@html2pdf-pro/teaching-engine";
import { useMemo, useState } from "react";
import {
  buildTeachingAnalytics,
  buildUserReport,
  createAnalyticsExport,
  createSolvedSentenceRecord,
  createTestSession,
  serializeAnalyticsCsv,
  serializeAnalyticsJson,
  type SolvedSentenceRecord
} from "../lib/learning-analytics";

const elementCodes: ElementCode[] = ["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"];
const sessionQuestions = createTestSession(stageOneSentences, 20);
const firstQuestion = sessionQuestions[0]!;

if (!firstQuestion) {
  throw new Error("Test session requires at least one Etap 1 sentence.");
}

type SelectablePart = {
  label: string;
  text: string;
  tokenIds: string[];
};

type Assignments = Record<string, ElementCode | "">;

export function LessonClient() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [assignments, setAssignments] = useState<Assignments>(() => emptyAssignmentsFor(partsFor(firstQuestion.sentence)));
  const [order, setOrder] = useState<ElementCode[]>(["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"]);
  const [finalSentence, setFinalSentence] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [hintCount, setHintCount] = useState(0);
  const [records, setRecords] = useState<SolvedSentenceRecord[]>([]);
  const [participantCode, setParticipantCode] = useState("P001");

  const activeQuestion = sessionQuestions[questionIndex] ?? firstQuestion;
  const sentence = activeQuestion.sentence;
  const selectableParts = useMemo(() => partsFor(sentence), [sentence]);
  const isLastQuestion = questionIndex >= sessionQuestions.length - 1;

  const evaluation = useMemo(() => {
    const attemptElements = selectableParts
      .map((part) => {
        const code = assignments[part.label];

        if (!code) {
          return null;
        }

        return {
          code,
          text: part.text,
          tokenIds: part.tokenIds
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return evaluateAttempt(sentence, {
      sentenceId: sentence.id,
      elements: attemptElements,
      englishOrder: order,
      finalSentence
    });
  }, [assignments, finalSentence, order, selectableParts, sentence]);

  const primaryIssue = evaluation.steps.find((step) => !step.isCorrect);
  const userReport = useMemo(() => buildUserReport(records), [records]);
  const teachingAnalytics = useMemo(() => buildTeachingAnalytics(records), [records]);
  const participantCodeIsValid = /^P\d{3}$/.test(participantCode);
  const analyticsExport = useMemo(
    () =>
      createAnalyticsExport({
        participantCode: participantCodeIsValid ? participantCode : "P001",
        records
      }),
    [participantCode, participantCodeIsValid, records]
  );

  function submitCurrentAttempt() {
    const durationMs = Date.now() - questionStartedAt;
    const record = createSolvedSentenceRecord({
      sentence,
      evaluation,
      durationMs,
      attemptNumber,
      hintCount
    });

    setRecords((current) => [...current, record]);
    setHasSubmitted(true);
    setAttemptNumber((current) => current + 1);
  }

  function moveToNextQuestion() {
    const nextIndex = Math.min(questionIndex + 1, sessionQuestions.length - 1);
    const nextSentence = sessionQuestions[nextIndex]?.sentence;

    setQuestionIndex(nextIndex);
    setAssignments(emptyAssignmentsFor(partsFor(nextSentence)));
    setOrder(["Ö", "F", "Z1", "İm", "N1", "N2", "Z2"]);
    setFinalSentence("");
    setHasSubmitted(false);
    setQuestionStartedAt(Date.now());
    setAttemptNumber(1);
    setHintCount(0);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-cyan-700">Sprint 4 / Test Session</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">Kod Değiştirme İngilizce</h1>
            <p className="mt-2 text-sm text-slate-600">
              20 soruluk oturum: süre, ilk deneme, hata ve ipucu verisi otomatik raporlanır.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <Metric label="Soru" value={activeQuestion.order} suffix="/20" />
            <Metric label="İpucu" value={hintCount} />
            <Metric label="Skor" value={evaluation.score.total} />
            <Metric label="Ortalama" value={userReport.averageScore} strong />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <LessonPanel sentence={sentence} records={records} />
            <TaggingPanel assignments={assignments} selectableParts={selectableParts} onChange={setAssignments} />
            <OrderPanel order={order} onChange={setOrder} />
            <FinalSentencePanel
              hintCount={hintCount}
              value={finalSentence}
              onChange={setFinalSentence}
              onHint={() => setHintCount((current) => current + 1)}
              onSubmit={submitCurrentAttempt}
            />
          </div>

          <aside className="space-y-4">
            <CoachPanel hasSubmitted={hasSubmitted} primaryIssue={primaryIssue} isCorrect={evaluation.isCorrect} />
            <ProgressPanel evaluation={evaluation} />
            <SessionControls
              canMoveNext={hasSubmitted && !isLastQuestion}
              isLastQuestion={isLastQuestion}
              onNext={moveToNextQuestion}
            />
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <UserReportPanel report={userReport} />
          <TeachingAnalyticsPanel analytics={teachingAnalytics} />
        </section>

        <ExportPanel
          exportData={analyticsExport}
          participantCode={participantCode}
          participantCodeIsValid={participantCodeIsValid}
          onParticipantCodeChange={setParticipantCode}
        />
      </div>
    </main>
  );
}

function Metric({ label, value, suffix = "", strong = false }: { label: string; value: number; suffix?: string; strong?: boolean }) {
  return (
    <div className="border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={strong ? "text-2xl font-semibold text-cyan-700" : "text-2xl font-semibold"}>
        {value}
        {suffix ? <span className="text-sm text-slate-500">{suffix}</span> : null}
      </div>
    </div>
  );
}

function LessonPanel({ sentence, records }: { sentence: SentenceDefinition; records: SolvedSentenceRecord[] }) {
  const lastRecord = records.at(-1);

  return (
    <section className="border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Türkçe Cümle</h2>
        <span className="text-sm text-slate-500">Hedef sıra: Ö + F + Z1 + İm + N1 + N2 + Z2</span>
      </div>
      <p className="mt-4 text-2xl font-medium leading-relaxed">{sentence.trSentence}</p>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <Info label="Çözülen cümle" value={records.length.toString()} />
        <Info label="Son süre" value={lastRecord ? `${Math.round(lastRecord.durationMs / 1000)} sn` : "-"} />
        <Info label="İlk deneme" value={lastRecord?.firstAttemptSuccess ? "başarılı" : "-"} />
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function TaggingPanel({
  assignments,
  selectableParts,
  onChange
}: {
  assignments: Assignments;
  selectableParts: SelectablePart[];
  onChange: (next: Assignments) => void;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">1. Parçaları Kodla</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {selectableParts.map((part) => (
          <label key={part.label} className="flex items-center justify-between gap-3 border border-slate-200 p-3">
            <span className="min-w-0 text-sm font-medium">{part.label}</span>
            <select
              className="h-10 border border-slate-300 bg-white px-3 text-sm"
              value={assignments[part.label]}
              onChange={(event) => onChange({ ...assignments, [part.label]: event.target.value as ElementCode | "" })}
            >
              <option value="">Kod seç</option>
              {elementCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}

function OrderPanel({ order, onChange }: { order: ElementCode[]; onChange: (next: ElementCode[]) => void }) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">2. İngilizce Dizilimi Kur</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {order.map((code, index) => (
          <select
            key={`${code}-${index}`}
            aria-label={`${index + 1}. sıra`}
            className="h-11 border border-slate-300 bg-white px-3 text-sm font-semibold"
            value={code}
            onChange={(event) => {
              const next = [...order];
              next[index] = event.target.value as ElementCode;
              onChange(next);
            }}
          >
            {elementCodes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ))}
      </div>
    </section>
  );
}

function FinalSentencePanel({
  value,
  hintCount,
  onChange,
  onHint,
  onSubmit
}: {
  value: string;
  hintCount: number;
  onChange: (next: string) => void;
  onHint: () => void;
  onSubmit: () => void;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">3. Cümleyi Üret</h2>
      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          className="h-12 flex-1 border border-slate-300 px-4 text-base"
          placeholder="İngilizce cümleyi yaz"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button className="h-12 border border-cyan-700 px-5 font-semibold text-cyan-800" type="button" onClick={onHint}>
          İpucu ({hintCount})
        </button>
        <button className="h-12 bg-cyan-700 px-5 font-semibold text-white" type="button" onClick={onSubmit}>
          Denetle
        </button>
      </div>
    </section>
  );
}

function CoachPanel({
  hasSubmitted,
  primaryIssue,
  isCorrect
}: {
  hasSubmitted: boolean;
  primaryIssue: ReturnType<typeof evaluateAttempt>["steps"][number] | undefined;
  isCorrect: boolean;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Hata Koçu</h2>
      {!hasSubmitted ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">Öğeleri kodlayıp cümleyi yazınca işlem geri bildirimi burada görünür.</p>
      ) : isCorrect ? (
        <p className="mt-3 text-sm leading-6 text-emerald-700">İşlem sırası ve cümle doğru. Aynı kuralda yeni cümleye geçebilirsin.</p>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-semibold text-rose-700">{primaryIssue?.coach?.title ?? primaryIssue?.errorType}</p>
          <p className="text-sm leading-6 text-slate-700">{primaryIssue?.feedback}</p>
          {primaryIssue?.coach ? (
            <div className="space-y-2 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-700">
              <p>
                <span className="font-semibold">Neden: </span>
                {primaryIssue.coach.why}
              </p>
              <p>
                <span className="font-semibold">Düzelt: </span>
                {primaryIssue.coach.fix}
              </p>
              <p>
                <span className="font-semibold">Mini pratik: </span>
                {primaryIssue.coach.miniPractice}
              </p>
            </div>
          ) : null}
          {primaryIssue?.expected ? <p className="text-sm text-slate-500">Beklenen: {primaryIssue.expected}</p> : null}
        </div>
      )}
    </section>
  );
}

function ProgressPanel({ evaluation }: { evaluation: ReturnType<typeof evaluateAttempt> }) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">İşlem Kontrolü</h2>
      <div className="mt-4 space-y-2">
        {evaluation.steps.map((step, index) => (
          <div key={`${step.step}-${step.code ?? index}`} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-sm">
            <span className="text-slate-700">{step.code ?? step.step}</span>
            <span className={step.isCorrect ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
              {step.isCorrect ? "doğru" : "bakılacak"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SessionControls({
  canMoveNext,
  isLastQuestion,
  onNext
}: {
  canMoveNext: boolean;
  isLastQuestion: boolean;
  onNext: () => void;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Oturum</h2>
      {isLastQuestion ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">Son sorudasın. Denetlemeden sonra otomatik rapor aşağıda güncellenir.</p>
      ) : (
        <button
          className="mt-4 h-11 w-full bg-slate-900 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          type="button"
          disabled={!canMoveNext}
          onClick={onNext}
        >
          Sonraki soru
        </button>
      )}
    </section>
  );
}

function UserReportPanel({ report }: { report: ReturnType<typeof buildUserReport> }) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Kullanıcı Raporu</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info label="Ortalama skor" value={report.averageScore.toString()} />
        <Info label="Transfer başarısı" value={`${report.transferSuccess}%`} />
        <Info label="İlk deneme başarısı" value={`${report.firstAttemptRate}%`} />
        <Info label="Ortalama ipucu" value={report.averageHintUsage.toString()} />
      </div>
      <ListBlock title="En güçlü beceriler" items={report.strongestSkills} />
      <ListBlock title="En zayıf beceriler" items={report.weakestSkills} />
      <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700">{report.studyRecommendation}</p>
    </section>
  );
}

function TeachingAnalyticsPanel({ analytics }: { analytics: ReturnType<typeof buildTeachingAnalytics> }) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Öğretim Analitiği</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info label="Ortalama çözüm süresi" value={`${Math.round(analytics.averageDurationMs / 1000)} sn`} />
        <Info label="En çok hata" value={analytics.mostCommonError ?? "-"} />
      </div>
      <ListBlock
        title="En çok hata yapılan etiketler"
        items={analytics.mostErroredLabels.map((item) => `${item.label}: ${item.count}`)}
      />
      <ListBlock
        title="En zor cümleler"
        items={analytics.hardestSentences.map((item) => `${item.averageScore} - ${item.sentence}`)}
      />
    </section>
  );
}

function ExportPanel({
  exportData,
  participantCode,
  participantCodeIsValid,
  onParticipantCodeChange
}: {
  exportData: ReturnType<typeof createAnalyticsExport>;
  participantCode: string;
  participantCodeIsValid: boolean;
  onParticipantCodeChange: (next: string) => void;
}) {
  const canExport = exportData.records.length > 0 && participantCodeIsValid;

  return (
    <section className="border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Anonim Analitik Dışa Aktarım</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Kişisel veri girilmez. Katılımcıyı yalnızca P001, P002 gibi anonim kodla tanımla.
          </p>
        </div>
        <label className="text-sm font-semibold text-slate-700">
          Katılımcı kodu
          <input
            className="mt-2 h-11 w-36 border border-slate-300 px-3"
            pattern="P\\d{3}"
            value={participantCode}
            onChange={(event) => onParticipantCodeChange(event.target.value.toUpperCase())}
          />
          {!participantCodeIsValid ? <span className="mt-1 block text-xs text-rose-700">P001 formatı gerekli.</span> : null}
        </label>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          className="h-11 border border-cyan-700 px-4 font-semibold text-cyan-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
          type="button"
          disabled={!canExport}
          onClick={() => downloadText(`${participantCode}-analytics.json`, "application/json", serializeAnalyticsJson(exportData))}
        >
          JSON indir
        </button>
        <button
          className="h-11 border border-slate-700 px-4 font-semibold text-slate-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
          type="button"
          disabled={!canExport}
          onClick={() => downloadText(`${participantCode}-analytics.csv`, "text/csv", serializeAnalyticsCsv(exportData))}
        >
          CSV indir
        </button>
      </div>
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">Oturum verisi bekleniyor.</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function partsFor(sentence: SentenceDefinition | undefined): SelectablePart[] {
  return (
    sentence?.elements.map((element) => ({
      label: element.hidden ? `${element.text} (gizli özne)` : element.text,
      text: element.text,
      tokenIds: element.tokenIds
    })) ?? []
  );
}

function emptyAssignmentsFor(parts: SelectablePart[]): Assignments {
  return Object.fromEntries(parts.map((part) => [part.label, ""])) as Assignments;
}

function downloadText(filename: string, mimeType: string, content: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
