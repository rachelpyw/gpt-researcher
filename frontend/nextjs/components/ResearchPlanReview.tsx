import { useState } from "react";

interface ResearchPlanReviewProps {
  question: string;
  onCancel: () => void;
  onConfirm: (questions: string[]) => void;
}

const initialQuestions = [
  "What are the strongest documented benefits, and what evidence supports them?",
  "What risks, limitations, or harms are documented?",
  "Where do credible sources disagree, and what explains the disagreement?",
];

export default function ResearchPlanReview({
  question,
  onCancel,
  onConfirm,
}: ResearchPlanReviewProps) {
  const [questions, setQuestions] = useState(initialQuestions);

  const updateQuestion = (index: number, value: string) => {
    setQuestions((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const validQuestions = questions.map((item) => item.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <section
        aria-labelledby="research-plan-title"
        aria-modal="true"
        role="dialog"
        className="w-full max-w-3xl rounded-lg border border-teal-500/30 bg-gray-950 p-6 shadow-2xl"
      >
        <p className="mb-2 text-sm font-medium text-teal-300">Review before searching</p>
        <h2 id="research-plan-title" className="text-2xl font-semibold text-white">
          Approve the research direction
        </h2>
        <p className="mt-2 text-base text-gray-300">
          Edit, remove, or add questions. Research will not begin until you approve this plan.
        </p>

        <div className="mt-5 rounded-md border border-gray-700 bg-gray-900/80 p-4">
          <span className="text-sm text-gray-400">Main question</span>
          <p className="mt-1 text-base text-white">{question}</p>
        </div>

        <div className="mt-4 space-y-3">
          {questions.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <label className="sr-only" htmlFor={`research-question-${index}`}>
                Research question {index + 1}
              </label>
              <textarea
                id={`research-question-${index}`}
                value={item}
                onChange={(event) => updateQuestion(index, event.target.value)}
                rows={2}
                className="min-h-11 flex-1 resize-y rounded-md border border-gray-700 bg-black/40 px-3 py-2 text-base text-white outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30"
              />
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                aria-label={`Remove research question ${index + 1}`}
                className="min-h-11 min-w-11 rounded-md border border-gray-700 text-xl text-gray-300 hover:border-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setQuestions((current) => [...current, ""])}
          className="mt-3 min-h-11 rounded-md border border-gray-600 px-4 text-sm font-medium text-gray-200 hover:border-teal-400 hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Add question
        </button>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-md border border-gray-600 px-5 text-sm font-medium text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Back to topic
          </button>
          <button
            type="button"
            disabled={validQuestions.length === 0}
            onClick={() => onConfirm(validQuestions)}
            className="min-h-11 rounded-md bg-teal-500 px-5 text-sm font-semibold text-gray-950 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Approve plan and research
          </button>
        </div>
      </section>
    </div>
  );
}