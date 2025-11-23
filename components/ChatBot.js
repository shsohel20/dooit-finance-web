'use client'
import { cn } from '@/lib/utils';
import { Button } from './ui/button'
import { IconMessageCircle, IconSend, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import { Input } from './ui/input';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={cn('fixed bottom-4 right-4 z-[9999] border shadow-lg rounded-md transition-[width,height] duration-500 ease-in-out ', isOpen ? 'w-[400px] h-[400px] ' : 'w-[70px] h-[34px]')}>
      {/* header */}
      {isOpen ? <div className='flex items-center justify-between p-2 border-b'>
        <h2 className='text-zinc-700 font-semibold'>Hi, I'm David</h2>
        <Button variant='outline' size='sm' onClick={() => setIsOpen(!isOpen)}>
          <IconX />
        </Button>
      </div> : null}
      {isOpen ? null : <Button size='sm' onClick={() => setIsOpen(!isOpen)}>
        <IconMessageCircle />
        Chat
      </Button>
      }
      {isOpen ? <div className='h-[350px] p-2  relative '>
        <div className='h-full    '>
          <div className='h-full'></div>
        </div>

        {/* input and send button */}
        <div className=' flex  gap-2 w-full absolute bg-white border left-0 right-0 bottom-0 py-2 px-2'>
          <div className='flex-1 w-full'>
            <Input type='textarea' className={'min-h-2'} placeholder='Ask me anything' rows={1} />
          </div>
          <div className='pt-0.5'>
            <Button size='sm' >Send <IconSend /></Button>
          </div>
        </div>
      </div> : null}
    </div>
  )
}
