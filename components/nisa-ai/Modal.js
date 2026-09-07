'use client';
import { cn, getFileKind, randomIdGenerator } from '@/lib/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  ArrowLeft,
  BadgeQuestionMark,
  Forward,
  House,
  Mail,
  Maximize2,
  Mic,
  Minimize,
  Paperclip,
  Ticket,
  X,
} from 'lucide-react';
import useOutsideClick from '@/hooks/useOutsideClick';
import { chatWithNissa } from '@/app/actions';
import Convos from './Convos';
import {
  IconHelpOctagon,
  IconHelpOctagonFilled,
  IconHome,
  IconHome2,
  IconHomeFilled,
  IconMail,
  IconMailFilled,
  IconTicket,
  // IconTicketFilled,
} from '@tabler/icons-react';
import ChatHome from './tabs/Home';
import Conversations from './tabs/Conversations';
import Help from './tabs/Help';
import Chat from './Chat';

const IconTicketFilled = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="icon icon-tabler icons-tabler-filled icon-tabler-ticket"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 4v2a1 1 0 0 0 2 0v-2h3a3 3 0 0 1 3 3v3a1 1 0 0 1 -.883 .993l-.117 .007a1 1 0 0 0 -.117 1.993l.117 .007a1 1 0 0 1 1 1v3a3 3 0 0 1 -3 3h-3v-2a1 1 0 0 0 -.883 -.993l-.117 -.007a1 1 0 0 0 -1 1v2h-9a3 3 0 0 1 -3 -3v-3a1 1 0 0 1 .883 -.993l.117 -.007a1 1 0 0 0 .117 -1.993l-.117 -.007a1 1 0 0 1 -1 -1v-3a2.995 2.995 0 0 1 2.727 -2.985l.222 -.014zm1 6a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1" />
    </svg>
  );
};
const tabs = [
  {
    name: 'Home',
    icon: <IconHome size={20} />,
    fillIcon: <IconHomeFilled size={20} />,
    component: <div>Home</div>,
    title: '',
  },
  {
    name: 'Convos',
    icon: <IconMail size={20} />,
    fillIcon: <IconMailFilled size={20} />,
    component: <div />,
    title: 'Conversations',
  },
  {
    name: 'Tickets',
    icon: <IconTicket size={20} />,
    fillIcon: <IconTicketFilled size={20} />,
    component: <div />,
    title: 'Tickets',
  },
  {
    name: 'Help',
    icon: <IconHelpOctagon size={20} />,
    fillIcon: <IconHelpOctagonFilled size={20} />,
    component: <div />,
    title: 'Help',
  },
];

export default function Modal({ isOpen, setIsOpen }) {
  const chatRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [openChat, setOpenChat] = useState(false);
  const [prompt, setPrompt] = useState('');
  // useOutsideClick(chatRef, () => setIsOpen(false));

  const [maximize, setMaximize] = useState(false);

  const currentTab = tabs.find((tab) => tab.name === activeTab);

  const handlePromptSelect = useCallback((prompt) => {
    // console.log('prompt', prompt);
    setOpenChat(true);
    setPrompt(prompt);
  }, []);

  return (
    <div
      ref={chatRef}
      className={cn(
        'fixed  bottom-2 transition-[transform, height, width] duration-500 ease-in-out  rounded-xl  bg-white shadow-xl border-t ',
        {
          ' -right-1 z-50   translate-x-0 ': isOpen,
          'translate-x-full right-0': !isOpen,
          'h-[80vh] w-[60vw] max-w-[850px]': maximize,
          'h-[700px] w-full max-w-[450px] ': !maximize,
        }
      )}
    >
      <div className="absolute py-2 top-0 left-0  flex items-center justify-between w-full gap-2 px-2 z-[99]">
        {openChat && (
          <div>
            <Button
              variant="ghost"
              // size="icon"
              onClick={() => setOpenChat(false)}
            >
              {' '}
              <ArrowLeft size={12} /> Back
            </Button>
          </div>
        )}
        {!openChat && (
          <div className="flex-1  ">
            <p className="text-lg font-medium text-center ">
              {currentTab.title}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="  size-7 cursor-pointer"
            onClick={() => setMaximize((prev) => !prev)}
          >
            {maximize ? <Minimize /> : <Maximize2 size={12} />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="  size-7 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <X size={12} />
          </Button>
        </div>
      </div>
      {/* chat */}

      <div className="h-full flex flex-col">
        {openChat ? (
          <Chat prompt={prompt} />
        ) : (
          <>
            {activeTab === 'Home' && (
              <ChatHome onPromptSelect={handlePromptSelect} />
            )}
            {activeTab === 'Convos' && (
              <Conversations setOpenChat={setOpenChat} />
            )}
            {activeTab === 'Tickets' && (
              <Conversations setOpenChat={setOpenChat} />
            )}
            {/* {activeTab === 'Tickets' && <Tickets />} */}
            {activeTab === 'Help' && <Help />}
            <div className="flex mt-auto  p-2 border-t rounded-md justify-between">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  variant="ghost"
                  className={cn(
                    'w-full flex flex-col items-center gap-1 py-2 text-neutral-400 rounded-md',
                    {
                      'text-primary  ': activeTab === tab.name,
                    }
                  )}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <span
                    className={cn({
                      'text-primary ': activeTab === tab.name,
                    })}
                  >
                    {activeTab === tab.name ? tab.fillIcon : tab.icon}
                  </span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
