'use client';
import { cn, getFileKind, randomIdGenerator } from '@/lib/utils';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  AudioLines,
  Cross,
  Forward,
  Maximize,
  Maximize2,
  Mic,
  Minimize,
  Paperclip,
  X,
} from 'lucide-react';
import useOutsideClick from '@/hooks/useOutsideClick';
import { chatWithNissa } from '@/app/actions';
import Convos from './Convos';
const NissaModel = dynamic(
  () => import('@/components/nisa-ai/Nisa', { ssr: false })
);

const NisaIntro = () => {
  return (
    <div className="pt-10">
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
  );
};
export default function Modal({ isOpen, setIsOpen }) {
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);
  useOutsideClick(chatRef, () => setIsOpen(false));
  const fileInputRef = useRef(null);
  const [fileInput, setFileInput] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [maximize, setMaximize] = useState(false);
  const endRef = useRef(null);

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
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  //onenter the message should send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  // useEffect(() => {
  //   if (!isOpen) return;
  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setMessage('');
    console.log('message', message);
    const myMsg = {
      msg: message,
      type: 'me',
      id: randomIdGenerator(),
      timeStamp: new Date(),
    };

    setChat((prev) => [...prev, myMsg]);

    const payload = {
      query: message,
      session_id: 'msg',
    };

    try {
      setLoading(true);
      const res = await chatWithNissa(payload);

      const data = res.success
        ? {
            msg: res.answer,
            type: 'ai',
            id: randomIdGenerator(),
            timeStamp: new Date(),
          }
        : {
            msg: 'Something went wrong',
            type: 'ai',
            id: randomIdGenerator(),
            timeStamp: new Date(),
            error: true,
          };

      setChat((prev) => [...prev, data]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      ref={chatRef}
      className={cn(
        'fixed  bottom-2 transition-[transform, height, width] duration-500 ease-in-out  rounded-xl  bg-white shadow-xl border-t ',
        {
          ' -right-1 z-50   translate-x-0 ': isOpen,
          'translate-x-full right-0': !isOpen,
          'h-[80vh] w-[60vw] max-w-[850px]': maximize,
          'h-[500px] w-full max-w-[450px] ': !maximize,
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
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-12 size-7"
        onClick={() => setMaximize((prev) => !prev)}
      >
        {maximize ? <Minimize /> : <Maximize2 size={12} />}
      </Button>
      {/* chat */}

      <div className=" p-2  h-full flex flex-col  ">
        {/* {chat.length === 0 && ( */}
        <div className="h-full  bg-white mb-2 rounded-lg p-2  overflow-y-auto ">
          {chat.length === 0 && <NisaIntro />}
          {chat.length > 0 && (
            <div className="pt-10">
              <Convos chat={chat} loading={loading} />
              <div ref={endRef} />
            </div>
          )}
        </div>
        {/* )} */}
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
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
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleSendMessage}
                >
                  <Forward />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
