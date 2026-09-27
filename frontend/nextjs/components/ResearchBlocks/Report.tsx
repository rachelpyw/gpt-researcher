import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "react-hot-toast";
import { markdownToHtml } from '../../helpers/markdownHelper';
import '../../styles/markdown.css';
import { useResearchHistoryContext } from '../../hooks/ResearchHistoryContext';
import { ChatMessage } from '../../types/data';

interface ReportProps {
  answer: string;
  researchId?: string;
  sources?: { name: string; url: string }[];
  onResearchFurther?: (prompt: string) => void;
}

export default function Report({ answer, researchId, sources = [], onResearchFurther }: ReportProps) {
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedClaim, setSelectedClaim] = useState('');
    const [flaggedClaims, setFlaggedClaims] = useState<string[]>([]);
    const reportRef = useRef<HTMLDivElement>(null);
    const { getChatMessages } = useResearchHistoryContext();
    // Memoize this value to prevent re-renders
    const chatMessages = researchId ? getChatMessages(researchId) : [];

    useEffect(() => {
      if (answer) {
        markdownToHtml(answer).then((html) => setHtmlContent(html));
      }
    }, [answer]);

    const disagreementSignals = answer
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => /\b(however|although|but|conflict|disagree|debate|risk|limitation|uncertain)\b/i.test(sentence))
      .slice(0, 3);

    const captureSelection = () => {
      const selection = window.getSelection();
      if (!selection || !reportRef.current?.contains(selection.anchorNode)) return;
      setSelectedClaim(selection.toString().trim().slice(0, 280));
    };

    const flagSelectedClaim = () => {
      if (!selectedClaim || flaggedClaims.includes(selectedClaim)) return;
      setFlaggedClaims((current) => [...current, selectedClaim]);
      setSelectedClaim('');
      window.getSelection()?.removeAllRanges();
    };
    
    return (
      <div className="container flex h-auto w-full shrink-0 gap-4 bg-black/30 backdrop-blur-md shadow-lg rounded-lg border border-solid border-gray-700/40 p-5">
        <div className="w-full">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width={20}
                height={20}
                fill="none" 
                stroke="currentColor" 
                strokeWidth={1.5} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-teal-200"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-medium text-teal-200">Research Report</h3>
            </div>
            {answer && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(answer.trim());
                    toast("Report copied to clipboard", {
                      icon: "✂️",
                    });
                  }}
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <img
                    src="/img/copy-white.svg"
                    alt="copy"
                    width={20}
                    height={20}
                    className="cursor-pointer text-white"
                  />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap content-center items-center gap-[15px] pl-5 pr-5">
            <div ref={reportRef} onMouseUp={captureSelection} className="w-full whitespace-pre-wrap text-base font-light leading-[152.5%] text-white log-message">
              {answer ? (
                <div className="markdown-content prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
              ) : (
                <div className="flex w-full flex-col gap-2">
                  <div className="h-6 w-full animate-pulse rounded-md bg-gray-300/20" />
                  <div className="h-6 w-[85%] animate-pulse rounded-md bg-gray-300/20" />
                  <div className="h-6 w-[90%] animate-pulse rounded-md bg-gray-300/20" />
                  <div className="h-6 w-[70%] animate-pulse rounded-md bg-gray-300/20" />
                </div>
              )}
            </div>
          </div>
          {answer && (
            <section aria-labelledby="report-review-title" className="mx-5 mt-5 rounded-md border border-teal-500/30 bg-gray-950/70 p-4">
              <h4 id="report-review-title" className="text-base font-semibold text-white">Review claims before using this report</h4>
              <p className="mt-1 text-sm leading-6 text-gray-300">
                Citation links connect claims to their original sources. Open them to inspect the supporting passage and context.
              </p>

              {sources.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-teal-200">Evidence links</h5>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sources.slice(0, 6).map((source, index) => (
                      <a
                        key={`${source.url}-${index}`}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center rounded-md border border-gray-600 px-3 text-sm text-gray-200 hover:border-teal-400 hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        Evidence {index + 1}: {source.name || `Source ${index + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h5 className="text-sm font-medium text-amber-200">Disagreements and gaps</h5>
                {disagreementSignals.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-gray-300">
                    {disagreementSignals.map((signal, index) => <li key={index}>• {signal}</li>)}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-gray-300">
                    No disagreement was made explicit in this report. Treat that absence as a gap and request opposing evidence before drawing a conclusion.
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-300">Select text in the report to flag a claim for verification.</p>
                <button
                  type="button"
                  disabled={!selectedClaim}
                  onClick={flagSelectedClaim}
                  className="mt-2 min-h-11 rounded-md border border-gray-600 px-4 text-sm font-medium text-gray-200 hover:border-amber-400 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Flag selected claim
                </button>
                {flaggedClaims.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {flaggedClaims.map((claim, index) => (
                      <div key={index} className="rounded-md bg-amber-950/25 p-3 text-sm text-amber-100">{claim}</div>
                    ))}
                    <button
                      type="button"
                      onClick={() => onResearchFurther?.(`Verify these flagged claims with direct evidence and opposing sources:\n${flaggedClaims.map((claim) => `- ${claim}`).join('\n')}`)}
                      className="min-h-11 rounded-md bg-teal-500 px-4 text-sm font-semibold text-gray-950 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      Research flagged claims
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    );
} 