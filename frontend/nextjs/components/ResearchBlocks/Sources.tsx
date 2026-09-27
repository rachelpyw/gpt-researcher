import Image from "next/image";
import React, { useState } from 'react';
import SourceCard from "./elements/SourceCard";

export default function Sources({
  sources,
  compact = false,
  onRequestPerspective,
}: {
  sources: { name: string; url: string }[];
  compact?: boolean;
  onRequestPerspective?: (prompt: string) => void;
}) {
  const [excludedUrls, setExcludedUrls] = useState<string[]>([]);
  const visibleSources = sources.filter((source) => !excludedUrls.includes(source.url));

  if (compact) {
    // Compact version for chat responses
    return (
      <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300/10">
        <div className="flex w-full flex-wrap content-center items-center gap-2">
          {visibleSources.map((source) => {
            // Extract domain from URL
            let displayUrl = source.url;
            try {
              const urlObj = new URL(source.url);
              displayUrl = urlObj.hostname.replace(/^www\./, '');
            } catch (e) {
              // If URL parsing fails, use the original URL
            }
            
            return (
              <a 
                key={source.url} 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-800/60 text-gray-300 hover:text-teal-300 hover:bg-gray-800/90 rounded border border-gray-700/40 transition-colors"
                title={source.name}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                {displayUrl}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Full version for research results
  return (
    <div className="container h-auto w-full shrink-0 rounded-lg border border-solid border-gray-700/40 bg-black/30 backdrop-blur-md shadow-lg p-5">
      <div className="flex items-start gap-4 pb-3 lg:pb-3.5">
        <img src="/img/browser.svg" alt="sources" width={24} height={24} />
        <h3 className="text-base font-bold uppercase leading-[152.5%] text-white">
          {visibleSources.length} Sources reviewed
        </h3>
      </div>
      <div className="mb-4 flex flex-col gap-3 rounded-md border border-gray-700 bg-gray-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">You decide which evidence remains in scope.</p>
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Open original links, review why each result was selected, or exclude it from this review.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRequestPerspective?.("Find credible sources that challenge or complicate the report's main conclusions. Explain where they disagree and why.")}
          className="min-h-11 shrink-0 rounded-md border border-teal-500/60 px-4 text-sm font-medium text-teal-200 hover:bg-teal-500/10 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Request opposing perspectives
        </button>
      </div>
      {excludedUrls.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-md bg-red-950/30 px-3 py-2 text-sm text-red-100">
          <span>{excludedUrls.length} source{excludedUrls.length === 1 ? "" : "s"} excluded from review</span>
          <button
            type="button"
            onClick={() => setExcludedUrls([])}
            className="min-h-11 px-3 font-medium underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Restore all
          </button>
        </div>
      )}
      <div className="overflow-y-auto max-h-[250px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300/10">
        <div className="flex w-full max-w-[890px] flex-wrap content-center items-center gap-[15px] pb-2">
          {visibleSources.length > 0 ? (
            visibleSources.map((source) => (
              <SourceCard
                source={source}
                key={source.url}
                onExclude={() => setExcludedUrls((current) => [...current, source.url])}
              />
            ))
          ) : sources.length > 0 ? (
            <p className="py-6 text-sm text-gray-300">All sources are excluded. Restore them or request another perspective.</p>
          ) : (
            <>
              <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300/20" />
              <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300/20" />
              <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300/20" />
              <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300/20" />
              <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300/20" />
              <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300/20" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
