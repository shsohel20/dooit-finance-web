'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  IconArrowUpRight,
  IconBook2,
  IconFileSearch,
  IconScale,
  IconShieldCheck,
} from '@tabler/icons-react';

const SUGGESTED_PROMPTS = [
  {
    id: 'aml-policy',
    text: 'What are our current AML policy requirements?',
    tag: 'Policy',
  },
  {
    id: 'compliance-cases',
    text: 'Summarize open compliance cases from this week',
    tag: 'Cases',
  },
  {
    id: 'kyc-high-risk',
    text: 'Explain KYC requirements for high-risk customers',
    tag: 'KYC',
  },
  {
    id: 'regulatory-thresholds',
    text: 'Which transactions exceed regulatory reporting thresholds?',
    tag: 'Monitoring',
  },
];

const CAPABILITIES = [
  {
    icon: IconShieldCheck,
    label: 'Risk assessment',
    description: 'Evaluate exposure and control gaps',
  },
  {
    icon: IconScale,
    label: 'Compliance checks',
    description: 'Regulatory alignment and audit readiness',
  },
  {
    icon: IconBook2,
    label: 'Policy guidance',
    description: 'Interpret internal and external rules',
  },
  {
    icon: IconFileSearch,
    label: 'Case support',
    description: 'Investigate alerts and case history',
  },
];

export default function ChatHome({ onPromptSelect }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto px-4 pb-4 pt-14">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-24 -right-8 h-32 w-32 rounded-full bg-accent/15 blur-2xl" />
        <div
          className="absolute inset-x-6 top-28 h-40 rounded-2xl opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage:
              'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)',
            filter: 'blur(3px)',
          }}
        />
      </div>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-5 ">
          <div className="absolute inset-0 scale-110 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 blur-md" />
          <div className="relative flex size-16 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br from-white to-primary/5 shadow-[0_8px_30px_rgba(0,89,100,0.12)]">
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              N
            </span>
          </div>
          <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-accent shadow-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" />
          </span>
        </div>

        <p className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-primary/70 uppercase">
          Risk & Compliance AI
        </p>
        <h1 className="text-[1.65rem] leading-tight font-bold tracking-tight text-heading">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
            Nisa
          </span>
        </h1>
        <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
          Your assistant for policies, monitoring, and regulatory questions —
          ask anything below to get started.
        </p>
      </header>

      {/* Suggested prompts */}
      <section className="relative z-10 mt-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Try asking
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <ul className="space-y-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <li key={prompt.id}>
              <button
                type="button"
                onClick={() => onPromptSelect?.(prompt.text)}
                className={cn(
                  'group flex w-full items-start gap-3 rounded-xl border border-border/80 bg-white/80 p-3 text-left shadow-sm backdrop-blur-sm transition-all duration-200',
                  'hover:border-primary/25 hover:bg-primary/[0.03] hover:shadow-[0_4px_20px_rgba(0,89,100,0.08)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                  'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-backwards motion-reduce:animate-none'
                )}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <span className="mt-0.5 shrink-0 rounded-md bg-primary/8 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                  {prompt.tag}
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-snug text-foreground/90">
                  {prompt.text}
                </span>
                <IconArrowUpRight
                  size={15}
                  className="mt-0.5 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Capabilities */}
      {/* <section className="relative z-10 mt-7">
        <p className="mb-3 text-center text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          What I can help with
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CAPABILITIES.map(({ icon: Icon, label, description }) => (
            <div
              key={label}
              className="rounded-xl border border-border/60 bg-gradient-to-br from-white to-smoke-200/40 p-3"
            >
              <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Icon size={17} stroke={1.75} />
              </div>
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}
