"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
const EditorForm = dynamic(() => import('./Editor'), { ssr: false })
export default function PolicyForm() {
  const [content, setContent] = useState(null);
  return (
    <div>
      <EditorForm />
    </div>
  )
}