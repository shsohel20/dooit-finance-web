"use client";

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List as ListIcon,
  ListOrdered,
  Pilcrow,
  Redo,
  Save,
  Strikethrough,
  Table as TableIcon,
  Underline,
  Undo,
} from "lucide-react";
import { Tooltip, TooltipProvider ,TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
  // Toolbar button component
  const ToolbarButton = ({
    onClick,
    icon: Icon,
    tooltip,
    disabled = false,
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className="h-8 w-8 p-0"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
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
        console.log('saved', saved)
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
  // Inline formatting using execCommand (works on contenteditable elements)
  const applyInlineFormat = (command) => {
    document.execCommand(command, false);
    // Refocus the editor after applying format
    holderRef.current?.querySelector('[contenteditable="true"]')?.focus();
  };

  // Insert a new block of a specific type
  const insertBlock = async (type, data) => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      const currentIndex = await editor.blocks.getCurrentBlockIndex();
      await editor.blocks.insert(type, data || {}, {}, currentIndex + 1, true);
    } catch {
      // If getCurrentBlockIndex fails, insert at the end
      await editor.blocks.insert(type, data || {});
    }
  };

  // Convert current block to header
  const convertToHeader = async (level) => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      const currentIndex = await editor.blocks.getCurrentBlockIndex();
      const currentBlock = await editor.blocks.getBlockByIndex(currentIndex);

      if (currentBlock) {
        const blockData = await editor.blocks.getBlockByIndex(currentIndex);
        // Get the text content from the current block
        const blockElement = holderRef.current?.querySelector(`[data-id="${currentBlock.id}"]`);
        const textContent = blockElement?.textContent || "";

        await editor.blocks.delete(currentIndex);
        await editor.blocks.insert(
          "header",
          { text: textContent, level },
          {},
          currentIndex,
          true
        );
      }
    } catch {
      // Insert a new header block if conversion fails
      await insertBlock("header", { text: "", level });
    }
  };

  // Convert current block to paragraph
  const convertToParagraph = async () => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      const currentIndex = await editor.blocks.getCurrentBlockIndex();
      const currentBlock = await editor.blocks.getBlockByIndex(currentIndex);

      if (currentBlock) {
        const blockElement = holderRef.current?.querySelector(`[data-id="${currentBlock.id}"]`);
        const textContent = blockElement?.textContent || "";

        await editor.blocks.delete(currentIndex);
        await editor.blocks.insert(
          "paragraph",
          { text: textContent },
          {},
          currentIndex,
          true
        );
      }
    } catch {
      await insertBlock("paragraph", { text: "" });
    }
  };

  // Insert list block
  const insertList = async (style) => {
    await insertBlock("list", { style, items: [""] });
  };

  // Insert table block
  const insertTable = async () => {
    await insertBlock("table", { withHeadings: true, content: [["", ""], ["", ""]] });
  };

  // Undo/Redo using execCommand
  const handleUndo = () => {
    document.execCommand("undo");
  };

  const handleRedo = () => {
    document.execCommand("redo");
  };



  return (
    <div className="min-h-screen w-full overflow-auto">

  {/* MS Word-style Toolbar */}
      <div className="sticky top-0 z-10 bg-background border border-border rounded-lg mb-4 p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo/Redo */}
          <ToolbarButton onClick={handleUndo} icon={Undo} tooltip="Undo (Ctrl+Z)" />
          <ToolbarButton onClick={handleRedo} icon={Redo} tooltip="Redo (Ctrl+Y)" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => applyInlineFormat("bold")}
            icon={Bold}
            tooltip="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => applyInlineFormat("italic")}
            icon={Italic}
            tooltip="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => applyInlineFormat("underline")}
            icon={Underline}
            tooltip="Underline (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => applyInlineFormat("strikethrough")}
            icon={Strikethrough}
            tooltip="Strikethrough"
          />
          <ToolbarButton
            onClick={() => document.execCommand("insertHTML", false, "<code>" + window.getSelection()?.toString() + "</code>")}
            icon={Code}
            tooltip="Inline Code"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Block Types */}
          <ToolbarButton
            onClick={convertToParagraph}
            icon={Pilcrow}
            tooltip="Paragraph"
          />
          <ToolbarButton
            onClick={() => convertToHeader(1)}
            icon={Heading1}
            tooltip="Heading 1"
          />
          <ToolbarButton
            onClick={() => convertToHeader(2)}
            icon={Heading2}
            tooltip="Heading 2"
          />
          <ToolbarButton
            onClick={() => convertToHeader(3)}
            icon={Heading3}
            tooltip="Heading 3"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => insertList("unordered")}
            icon={ListIcon}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => insertList("ordered")}
            icon={ListOrdered}
            tooltip="Numbered List"
          />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Table */}
          <ToolbarButton
            onClick={insertTable}
            icon={TableIcon}
            tooltip="Insert Table"
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Save Button */}
          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
            disabled={isSaving}
            className="ml-2 bg-transparent"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div ref={holderRef} className=""/>
    </div>
  );
}
