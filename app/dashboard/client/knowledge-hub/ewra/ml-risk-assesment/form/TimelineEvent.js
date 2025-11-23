'use client';

import React from 'react';
import { cn } from '@/lib/utils';


export default function TimelineEvent({ event, isLast }) {
  const isActive = event.status === 'active';
  const isCompleted = event.status === 'completed';
  const Icon = event.icon;
  return (
    <div className="relative pl-10 ">
      {/* Timeline dot */}
      <div
        className={cn(
          'absolute left-0 size-8 rounded-full flex items-center justify-center  transition-all duration-300',
          isActive && 'ring-4 ring-accent/30 scale-110',
          isCompleted && 'bg-muted ring-2 ring-accent/20',
          isActive && 'bg-gradient-to-br from-accent to-secondary'
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      {/* Content card */}
      <div
        className={cn(
          'p-6 rounded-xl border transition-all duration-300',
          isActive && 'border-accent bg-accent/5 shadow-lg shadow-accent/10',
          isCompleted && 'border-border bg-card',
          !isActive && !isCompleted && 'border-border bg-card/50 opacity-60'
        )}
      >
        {/* Timestamp */}
        <div className="flex items-center justify-between mb-2">
          <time className="text-sm font-mono text-muted-foreground tracking-wide">
            {event.timestamp}
          </time>
          {isActive && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-accent-foreground bg-accent rounded-full">
              In Progress
            </span>
          )}
          {isCompleted && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-accent-foreground bg-muted rounded-full opacity-70">
              Completed
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  );
}
