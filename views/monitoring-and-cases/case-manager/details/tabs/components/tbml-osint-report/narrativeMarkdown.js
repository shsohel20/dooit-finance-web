import React from "react";

// Lightweight markdown (subset) parser for the `narrative_report` field.
// Supports the shape the OSINT service emits: "## " section headers,
// "**bold**" inline emphasis, "* "/"- " bullets and "1. " ordered lists.

export function renderInline(text, keyPrefix) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part !== "")
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-heading">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <React.Fragment key={`${keyPrefix}-t${i}`}>{part}</React.Fragment>
      ),
    );
}

function parseMarkdownBlocks(text) {
  const blocks = [];
  let currentList = null;
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      blocks.push({ type: "p", text: paragraphLines.join(" ") });
      paragraphLines = [];
    }
  };
  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  String(text || "")
    .split("\n")
    .forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        flushList();
        return;
      }
      const bulletMatch = line.match(/^[*-]\s+(.*)/);
      const numberedMatch = line.match(/^\d+\.\s+(.*)/);
      if (bulletMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== "ul") {
          flushList();
          currentList = { type: "ul", items: [] };
        }
        currentList.items.push(bulletMatch[1]);
      } else if (numberedMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== "ol") {
          flushList();
          currentList = { type: "ol", items: [] };
        }
        currentList.items.push(numberedMatch[1]);
      } else {
        flushList();
        paragraphLines.push(line);
      }
    });
  flushParagraph();
  flushList();
  return blocks;
}

export function parseNarrativeSections(markdown) {
  if (!markdown) return [];
  const matches = [...String(markdown).matchAll(/^##\s+(.*)$/gm)];
  if (matches.length === 0) {
    return [{ title: null, blocks: parseMarkdownBlocks(markdown) }];
  }
  const sections = [];
  if (matches[0].index > 0) {
    const intro = markdown.slice(0, matches[0].index).trim();
    if (intro) sections.push({ title: null, blocks: parseMarkdownBlocks(intro) });
  }
  matches.forEach((m, idx) => {
    const contentStart = m.index + m[0].length;
    const contentEnd = idx + 1 < matches.length ? matches[idx + 1].index : markdown.length;
    sections.push({
      title: m[1].trim(),
      blocks: parseMarkdownBlocks(markdown.slice(contentStart, contentEnd).trim()),
    });
  });
  return sections;
}
