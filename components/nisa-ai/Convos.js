import { cn } from '@/lib/utils';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function Convos({ chat, loading }) {
  return (
    <div className="space-y-2">
      {chat.map((msg) => {
        return (
          <div
            key={msg.id}
            className={cn('flex', {
              'justify-start': msg.type === 'ai',
              'justify-end': msg.type === 'me',
            })}
          >
            <div
              className={cn(
                'max-w-full w-max  rounded-lg leading-7 font-medium ',
                {
                  'bg-zinc-200 py-1 px-4': msg.type === 'me',
                }
              )}
            >
              <p className="flex items-center gap-2">
                {msg.error && (
                  <span>
                    <ExclamationCircleIcon className="size-5 text-danger" />
                  </span>
                )}
                <span>{msg.msg}</span>
              </p>
              {msg.type === 'ai' && msg.is_relevant ? (
                <span className="text-xs text-gray-500 italic">
                  The response is AI generated, for reference only
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
      {loading ? (
        <div className="animate-pulse duration-300">
          <div>Thinking...</div>
        </div>
      ) : null}
    </div>
  );
}
