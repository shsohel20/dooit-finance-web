"use client"
import React, { useState } from 'react'
// import { Editor } from "novel";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  ImageResizer,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { slashCommand, suggestionItems } from './SlashCommand';
import { defaultExtensions } from './extension';
const extensions = [...defaultExtensions, slashCommand];
// import { defaultExtensions } from './extension';
export default function EditorForm() {
  const [content, setContent] = useState(null);
  return (
    <div>
      <EditorRoot>
        <EditorContent
          initialContent={content}
          extensions={extensions}
        >
        </EditorContent>
      </EditorRoot>
    </div>
  )
}