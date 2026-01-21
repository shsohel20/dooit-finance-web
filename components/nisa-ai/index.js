'use client';
import { cn, getFileKind } from '@/lib/utils';
import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { AudioLines, Cross, Forward, Mic, Paperclip, X } from 'lucide-react';
import useOutsideClick from '@/hooks/useOutsideClick';
const NissaModel = dynamic(
  () => import('@/components/nisa-ai/Nisa', { ssr: false })
);

export default function ChatBotNissa() {
  const [isOpen, setIsOpen] = useState(false);
  console.log('isOpen', isOpen);
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);
  useOutsideClick(chatRef, () => setIsOpen(false));
  const fileInputRef = useRef(null);
  const [fileInput, setFileInput] = useState(null);
  console.log('fileInput', fileInput);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let kind = 'file';

    kind = getFileKind(file);

    setFileInput({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      kind,
      preview: URL.createObjectURL(file),
    });

    e.target.value = null;
  };
  return (
    <>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-0 z-50 size-13 rounded-lg  overflow-hidden cursor-pointer "
      >
        <NissaModel />
      </div>
      <div
        ref={chatRef}
        className={cn(
          'fixed w-full max-w-[450px] bottom-2  h-[500px] right-0  transition-transform duration-500 ease-in-out translate-x-full rounded-xl  bg-white shadow-xl border-t',
          {
            ' -right-1 z-50   translate-x-0 ': isOpen,
          }
        )}
      >
        <Button
          size="icon"
          variant="outline"
          className="absolute top-2 right-3 size-7"
          onClick={() => setIsOpen(false)}
        >
          <X size={12} />
        </Button>
        {/* chat */}

        <div className=" p-2  h-full flex flex-col  ">
          {chat.length === 0 && (
            <div className="h-full bg-white mb-2 rounded-lg p-2  overflow-y-auto ">
              <h1 className="text-center text-2xl font-bold">
                Hi, I&apos;m
                <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text ml-2">
                  Nisa
                </span>
              </h1>
              <p className="text-center text-sm text-gray-500">
                Ask me anything about Risk & Compliance
              </p>
            </div>
          )}
          <div className=" w-full border rounded-lg mt-auto bg-white ">
            <div className="h-full w-full  rounded-lg bg-gradient-to-b from-white to-zinc-100">
              {fileInput && (
                <div className=" rounded-md  rounded-md relative w-max">
                  <div
                    className="absolute -right-1 -top-1 size-5 rounded-full bg-zinc-50 flex items-center justify-center cursor-pointer hover:shadow z-1"
                    onClick={() => setFileInput(null)}
                  >
                    <X size={12} />
                  </div>
                  <div
                    hidden={
                      fileInput?.kind === 'doc' ||
                      fileInput?.kind === 'excel' ||
                      fileInput?.kind === 'file'
                    }
                    className="size-24 rounded-md bg-gray-200 relative overflow-hidden"
                  >
                    {fileInput?.kind === 'image' && (
                      <img
                        src={fileInput?.preview}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    )}
                    {fileInput?.kind === 'pdf' && (
                      <iframe
                        src={fileInput?.preview}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  {(fileInput.kind === 'doc' ||
                    fileInput.kind === 'excel' ||
                    fileInput.kind === 'file') && (
                    <div className="flex  gap-2 w-40  shadow rounded-md px-2 py-1">
                      <span className="text-xs">
                        {fileInput.kind === 'doc' && '📄'}
                        {fileInput.kind === 'excel' && '📊'}
                        {fileInput.kind === 'file' && '📁'}
                      </span>

                      <div>
                        <p className="text-xs font-medium w-32 truncate">
                          {fileInput.name}
                        </p>
                        {/* <p className="text-xs text-gray-500">
                          {(fileInput.size / 1024).toFixed(1)} KB
                        </p> */}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Textarea
                name="message"
                id="message"
                placeholder="Ask me anything"
                className="resize-none  w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 max-h-40"
              />
              <div className="flex justify-between items-center p-2">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileInput}
                      hidden
                    />

                    <Paperclip />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Mic />
                  </Button>
                </div>
                <div>
                  <Button size="icon" variant="outline">
                    <Forward />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
