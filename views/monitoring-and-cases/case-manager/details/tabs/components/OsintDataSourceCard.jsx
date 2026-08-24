"use client";
import { ExternalLink, Globe } from "lucide-react";

const OsintDataSourceCard = ({ source }) => {
  return (
    <div className="bg-white rounded-lg p-3 border space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 truncate">
            {source.title || source.domain || "Untitled source"}
          </span>
        </div>
        {source.adverse && (
          <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
            Adverse
          </span>
        )}
      </div>

      {source.match_reasoning && (
        <p className="text-xs text-gray-500 leading-relaxed">{source.match_reasoning}</p>
      )}

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline "
        >
          <ExternalLink className="w-3 h-3" />
          Visit link
        </a>
      )}
    </div>
  );
};

export default OsintDataSourceCard;
