"use client";

/**
 * TinyEditor — reusable WYSIWYG editor for Template Management workflows.
 *
 * Used EXCLUSIVELY for (per dual-editor architecture):
 *   - AML Template preview & editing
 *   - Generated / imported DOCX preview & editing
 * The Policy Hub continues to use Editor.js (see policy-form/Editor.js).
 *
 * Storage contract: works directly on rich HTML strings (PolicyHubTemplate.docs /
 * AfcDocument.contentMd). No block-format conversion — HTML round-trips losslessly.
 *
 * Self-hosted (GPL, no API key, no external CDN) — assets served from
 * /public/tinymce so AML document content never leaves the deployment.
 */

import { forwardRef, useRef, useImperativeHandle } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

// Toolbar/plugins tuned for professional compliance documents — preserves
// headings, tables (incl. merged cells), lists, alignment, links, images.
const PLUGINS = [
  "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
  "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
  "insertdatetime", "media", "table", "wordcount", "pagebreak", "nonbreaking",
];

const TOOLBAR =
  "undo redo | blocks | bold italic underline strikethrough | " +
  "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
  "bullist numlist outdent indent | link image table | " +
  "pagebreak removeformat | searchreplace code fullscreen";

const CONTENT_STYLE = `
  body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#1F2937;line-height:1.65;max-width:820px;margin:0 auto;padding:24px}
  h1{font-size:16pt;font-weight:700;color:#1B3A5C;border-bottom:2px solid #1B3A5C;padding-bottom:6px;margin:24px 0 12px}
  h2{font-size:13pt;font-weight:700;color:#1B3A5C;margin:18px 0 8px}
  h3{font-size:11pt;font-weight:600;color:#2B5496;margin:14px 0 6px}
  table{border-collapse:collapse;width:100%;margin:12px 0}
  th{background:#1B3A5C;color:#fff;padding:8px 10px;text-align:left;border:1px solid #1B3A5C}
  td{padding:7px 10px;border:1px solid #D1D5DB;vertical-align:top}
  tr:nth-child(even) td{background:#F3F6FA}
  a{color:#2B5496;text-decoration:underline}
`;

const TinyEditor = forwardRef(function TinyEditor({
  value = "",
  onSave,
  isSaving = false,
  readOnly = false,
  height = 600,
  showSave = true,
  label,
  onReady,
  onChange,
}, ref) {
  const editorRef = useRef(null);

  // Expose getContent() so a parent (e.g. the 3-region template editor) can read
  // header/body/footer from one master Save button. Exposed both via React ref
  // and an onReady callback (the latter survives next/dynamic, which drops refs).
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent() ?? "",
  }), []);

  const handleSave = () => {
    const html = editorRef.current?.getContent() ?? "";
    onSave?.(html);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <div className="px-4 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
      )}
      {showSave && !readOnly && (
        <div className="sticky top-0 z-10 flex justify-end px-4 py-2 border-b border-border bg-card">
          <Button onClick={handleSave} variant="outline" size="sm" disabled={isSaving}>
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      )}
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          onReady?.({ getContent: () => editor.getContent() });
        }}
        onEditorChange={(html) => onChange?.(html)}
        initialValue={value}
        disabled={readOnly}
        init={{
          height,
          menubar: !readOnly,
          statusbar: true,
          readonly: readOnly,
          plugins: PLUGINS,
          toolbar: readOnly ? false : TOOLBAR,
          branding: false,
          promotion: false,
          // Fidelity: keep all formatting/attributes that arrive from DOCX import
          valid_elements: "*[*]",
          extended_valid_elements: "span[*],div[*],table[*],td[*],th[*],img[*]",
          verify_html: false,
          paste_data_images: true,
          table_use_colgroups: true,
          content_style: CONTENT_STYLE,
          skin: "oxide",
          content_css: "default",
        }}
      />
    </div>
  );
});

export default TinyEditor;
