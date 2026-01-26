"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";
// import Code from "@editorjs/code";


export default function Editor({ data, onChange }) {
  const editorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if(typeof window === 'undefined') return;
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        data,
        onReady: () => setIsReady(true),
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
          // code: Code,
        },

      });

      editorRef.current = editor;
    }

    return () => {
      // editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);
  const handleSave = async () => {
    const saved = await editorRef.current.save();
    // setEditorData(saved);
  };
//  useEffect(() => {
//   if (!editorRef.current) return;
// console.log('isready')
//  if(data && editorRef?.current) {
//   editorRef?.current?.render(data);
//    }

// }, [data, isReady]);

  return <div id="editorjs" className=" min-h-screen w-full overflow-x-auto overflow-y-auto" />;
}
