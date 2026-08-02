import { clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const dateShowFormat = (date) => {
  return moment(date).format("DD MMM YYYY");
};

export const dateShowFormatWithTime = (date) => {
  // date with time 17oct 2025 10:00 AM
  return moment(date).format("DD MMM YYYY hh:mm A");
};

export const getInitials = (name = "") => {
  // A default parameter only covers `undefined`, so a null/number/object name
  // would previously throw on .trim(). Callers pass values straight from the
  // API, where an unset name is null rather than undefined.
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const objWithValidValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== "" && value !== null,
    ),
  );
};

export const getQueryString = (obj) => {
  return new URLSearchParams(obj).toString();
};
export const getFileKind = (file) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf") return "pdf";

  // Word
  if (
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "doc";
  }

  // Excel
  if (
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "excel";
  }

  return "file";
};

export const formatAUD = (amount, currency = "AUD") => {
  const formattedAmount = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${formattedAmount}`;
};

export const formatDateTime = (timestamp) => {
  const m = moment(timestamp);

  return {
    date: m.format("DD MMM YYYY"), // e.g., "23 Nov 2025"
    time: m.format("hh:mm A"), // e.g., "11:15 AM"
  };
};
export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};
export const riskLevelVariants = {
  Low: "success",
  Medium: "warning",
  High: "danger",
  Unacceptable: "danger",
};
export const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const randomIdGenerator = () => {
  const id = Math.floor(Math.random() * Date.now());
  return id;
};
// ── Editor.js ↔ HTML conversion utilities ────────────────────────────────────

/**
 * Walk a DOM node tree and push Editor.js blocks into the `blocks` array.
 * Only called in browser environments (DOMParser available).
 * @param {Element} parent
 * @param {Array}   blocks
 */
// Non-content tags — skip entirely rather than rendering their source as text
const _SKIP_TAGS = new Set(["style", "script", "meta", "link", "noscript", "head", "svg"]);

function _visitDomNode(parent, blocks) {
  Array.from(parent.childNodes).forEach((node) => {
    // 3 = TEXT_NODE
    if (node.nodeType === 3) {
      const text = (node.textContent || "").trim();
      if (text) blocks.push({ type: "paragraph", data: { text } });
      return;
    }
    // 1 = ELEMENT_NODE
    if (node.nodeType !== 1) return;

    const tag = node.tagName.toLowerCase();
    if (_SKIP_TAGS.has(tag)) return;

    if (/^h[1-6]$/.test(tag)) {
      blocks.push({
        type: "header",
        data: { text: node.innerHTML.trim(), level: Math.min(+tag[1], 3) },
      });
      return;
    }
    if (tag === "p") {
      const text = node.innerHTML.trim();
      if (text) blocks.push({ type: "paragraph", data: { text } });
      return;
    }
    if (tag === "ul" || tag === "ol") {
      const items = Array.from(node.querySelectorAll(":scope > li")).map((li) =>
        li.innerHTML.trim(),
      );
      if (items.length) {
        blocks.push({
          type: "list",
          data: { style: tag === "ol" ? "ordered" : "unordered", items },
        });
      }
      return;
    }
    if (tag === "table") {
      const withHeadings = !!node.querySelector("th");
      const content = Array.from(node.querySelectorAll("tr"))
        .map((tr) => Array.from(tr.querySelectorAll("th, td")).map((c) => c.textContent.trim()))
        .filter((row) => row.length);
      if (content.length) {
        blocks.push({ type: "table", data: { withHeadings, content } });
      }
      return;
    }
    if (tag === "blockquote") {
      const text = node.innerHTML.trim();
      if (text) blocks.push({ type: "paragraph", data: { text } });
      return;
    }
    // Block containers — recurse
    if (["div", "section", "article", "main", "body", "header", "footer", "aside"].includes(tag)) {
      _visitDomNode(node, blocks);
      return;
    }
    // Top-level inline element — wrap in paragraph
    const text = node.innerHTML.trim();
    if (text) blocks.push({ type: "paragraph", data: { text } });
  });
}

/**
 * Legacy plain-text → Editor.js blocks (kept for backward compatibility with
 * records saved before the HTML storage format was adopted).
 */
function _plainTextToEditorBlocks(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const blocks = [];

  lines.forEach((line, index) => {
    if (index === 0 || line === line.toUpperCase() || (line.length > 40 && index < 2)) {
      blocks.push({ type: "header", data: { text: line, level: 2 } });
      return;
    }
    if (line.includes(":")) {
      const colonIdx = line.indexOf(":");
      const label = line.slice(0, colonIdx);
      const value = line.slice(colonIdx + 1).trim();
      blocks.push({ type: "paragraph", data: { text: `<b>${label}:</b> ${value}` } });
      return;
    }
    blocks.push({ type: "paragraph", data: { text: line } });
  });

  return { blocks };
}

export const createSearchParams = (params) => {
  const validParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value != null && value !== ""),
  );

  return new URLSearchParams(validParams);
};

/**
 * Parse a `docs` string (HTML or legacy plain-text) into an Editor.js data
 * object `{ blocks }` ready for the `data` prop of the Editor component.
 *
 * Priority:
 *   HTML content  → DOM-parse with DOMParser (browser) or strip+fallback (SSR)
 *   Plain text    → legacy line-by-line heuristic (backwards compatible)
 */
export function parseToEditorJS(raw) {
  if (!raw) return { blocks: [] };
  const str = String(raw).trim();
  if (!str) return { blocks: [] };

  // Detect HTML by presence of opening tags
  if (/<[a-z][\s\S]{0,30}?>/i.test(str)) {
    if (typeof DOMParser !== "undefined") {
      const doc = new DOMParser().parseFromString(str, "text/html");
      const blocks = [];
      _visitDomNode(doc.body, blocks);
      return { blocks };
    }
    // SSR fallback: strip tags then treat as plain text
    const plain = str
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return _plainTextToEditorBlocks(plain);
  }

  return _plainTextToEditorBlocks(str);
}

/**
 * Serialize Editor.js block data back to HTML for storage in the `docs` field.
 * HTML is the canonical storage format: export functions (PDF/DOCX) and
 * `importFromDocx` (mammoth) both use HTML.
 *
 * Handles block types registered in the Editor component:
 *   header, paragraph, list (ordered + unordered), table
 */
export function editorToHtml(editorData) {
  if (!editorData?.blocks?.length) return "";

  return editorData.blocks
    .map(({ type, data }) => {
      if (!data) return "";
      switch (type) {
        case "header": {
          const lvl = Math.min(Math.max(data.level ?? 2, 1), 6);
          return `<h${lvl}>${data.text ?? ""}</h${lvl}>`;
        }
        case "paragraph":
          return data.text ? `<p>${data.text}</p>` : "";
        case "list": {
          const tag = data.style === "ordered" ? "ol" : "ul";
          const items = (data.items ?? [])
            .map((item) => {
              const text = typeof item === "string" ? item : (item?.content ?? "");
              return `<li>${text}</li>`;
            })
            .join("");
          return items ? `<${tag}>${items}</${tag}>` : "";
        }
        case "table": {
          if (!data.content?.length) return "";
          const rows = data.content
            .map((row, i) => {
              const cell = data.withHeadings && i === 0 ? "th" : "td";
              const cells = (row ?? []).map((c) => `<${cell}>${c ?? ""}</${cell}>`).join("");
              return `<tr>${cells}</tr>`;
            })
            .join("");
          return `<table><tbody>${rows}</tbody></table>`;
        }
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * @deprecated Use editorToHtml — kept for backward compatibility only.
 * Returns plain text (HTML tags stripped); PDF/DOCX exports lose structure.
 */
export function editorToText(editorData) {
  if (!editorData || !editorData.blocks) return "";

  let text = "";

  editorData.blocks.forEach((block) => {
    const { type, data } = block;

    if (type === "header") {
      text += data.text + "\n\n";
    }

    if (type === "paragraph") {
      const plain = data.text.replace(/<[^>]+>/g, "");
      text += plain + "\n\n";
    }

    if (type === "list") {
      data.items.forEach((item) => {
        text += "- " + item.replace(/<[^>]+>/g, "") + "\n";
      });
      text += "\n";
    }

    if (type === "table") {
      data.content.forEach((row) => {
        text += row.join(" | ") + "\n";
      });
      text += "\n";
    }
  });

  return text.trim();
}

export const base64ToFile = (base64String, fileName = "file") => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];

  const extension = mime.split("/")[1];
  const finalFileName = `${fileName}.${extension}`;

  const byteString = atob(arr[1]);
  const byteNumbers = new Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  return new File([new Uint8Array(byteNumbers)], finalFileName, {
    type: mime,
  });
};
export const fmt = (str) => {
  if (!str) return "—";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const KYC_HISTORY_STATUS = {
  verified: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  rejected: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  in_review: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    console.log("reader", reader);

    reader.onload = () => resolve(reader.result);

    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("File reading was aborted"));

    reader.readAsDataURL(file);
  });
};
