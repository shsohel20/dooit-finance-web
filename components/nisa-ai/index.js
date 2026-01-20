'use client';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { AudioLines, Forward, Mic, Paperclip, X } from 'lucide-react';
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
                Welcome to
                <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text ml-2">
                  Nisa AI
                </span>
              </h1>
              <p className="text-center text-sm text-gray-500">
                Ask me anything about Risk & Compliance
              </p>
            </div>
          )}
          <div className=" w-full border rounded-lg mt-auto bg-white ">
            <div className="h-full w-full  rounded-lg ">
              <Textarea
                placeholder="Ask me anything"
                className="resize-none  w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex justify-between items-center p-2">
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
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
