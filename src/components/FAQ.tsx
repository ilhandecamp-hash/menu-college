"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItemData {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItemData[];
}

/** Render a simple markdown-like string to JSX:
 *  - **bold**
 *  - [text](url) → links
 *  - Lines starting with "- " → list items
 *  - Double newlines → paragraphs
 */
function renderAnswer(text: string) {
  const paragraphs = text.split("\n\n");

  return paragraphs.map((block, pi) => {
    const lines = block.split("\n");
    const isList = lines.every((l) => l.startsWith("- "));

    if (isList) {
      return (
        <ul key={pi} className="space-y-2">
          {lines.map((line, li) => (
            <li key={li}>{renderInline(line.slice(2))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={pi} className={pi > 0 ? "mt-2 text-sm text-slate-500 dark:text-slate-400" : ""}>
        {lines.map((line, li) => (
          <span key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode[] {
  // Match **bold** and [text](url)
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2] && match[3]) {
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium"
          style={{ color: "var(--primary)" }}
        >
          {match[2]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <HelpCircle size={48} className="mx-auto mb-4 text-slate-300 animate-pulse-soft" />
        <p className="text-sm text-slate-400">Aucune question pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5"
            style={{
              borderColor: isOpen
                ? "color-mix(in srgb, var(--primary-light) 40%, transparent)"
                : undefined,
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5"
            >
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors"
                style={{
                  backgroundColor: isOpen
                    ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                    : undefined,
                  color: isOpen ? "var(--primary)" : "#94a3b8",
                }}
              >
                <HelpCircle size={18} />
              </span>
              <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-white sm:text-base">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {renderAnswer(item.answer)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
