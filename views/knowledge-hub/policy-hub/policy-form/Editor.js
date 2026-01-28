"use client";

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";
import { Button } from "@/components/ui/button";
import { Bold, Code, Italic, Save, Strikethrough, Underline } from "lucide-react";

export default function Editor({ data, onSubmit, isSaving = false, setData }) {
  const holderRef = useRef(null);   // DOM node
  const editorRef = useRef(null);   // EditorJS instance
  const initialDataRef = useRef(data); // freeze initial data

  useEffect(() => {
    if (editorRef.current) return; // ✅ prevent re-init
    if(!holderRef.current) return;
    const editor = new EditorJS({
      holder: holderRef.current,
      autofocus: true,
      data: data, // ✅ load once
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        table: Table,
      },
      onChange: async () => {
        const saved = await editor.save();
        setData(saved)
      },
    });

    editorRef.current = editor;

    return () => {
      // editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const handleSave = async () => {
    onSubmit?.(data)
  };


  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="flex justify-end mb-2">
        <Button
          onClick={handleSave}
          variant="outline"
          size="sm"
          disabled={isSaving}
        >
          <Save />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div ref={holderRef} className=""/>
    </div>
  );
}
