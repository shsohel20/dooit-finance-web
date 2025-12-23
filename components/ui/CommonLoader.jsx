'use client';

import { useEffect, useState } from 'react';

export default function CommonLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Main animated chart SVG */}
      <div className="relative">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="overflow-visible"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />

          {/* Animated progress ring */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress * 5.65} 565`}
            className="text-accent transition-all duration-100"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
            }}
          />

          {/* Animated bar chart */}
          <g className="translate-y-[40px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={60 + i * 20}
                y={100}
                width="12"
                rx="3"
                fill="currentColor"
                className={`text-primary ${i % 2 === 0 ? 'animate-bar-grow-1' : 'animate-bar-grow-2'}`}
                style={{
                  height: '0',
                  transformOrigin: 'bottom',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </g>

          {/* Animated line graph */}
          <path
            d="M 40 130 Q 60 100, 80 120 T 120 90 T 160 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-accent animate-draw-line"
            strokeDasharray="200"
            strokeDashoffset="200"
          />

          {/* Animated dots on line */}
          {[
            { cx: 40, cy: 130, delay: '0.5s' },
            { cx: 80, cy: 120, delay: '0.7s' },
            { cx: 120, cy: 90, delay: '0.9s' },
            { cx: 160, cy: 100, delay: '1.1s' },
          ].map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="0"
              fill="currentColor"
              className="text-accent animate-dot-appear"
              style={{ animationDelay: dot.delay }}
            />
          ))}

          {/* Dollar sign in center */}
          <text
            x="100"
            y="75"
            textAnchor="middle"
            className="text-2xl font-bold fill-primary animate-pulse-slow"
          >
            $
          </text>
        </svg>

        {/* Orbiting elements */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
          </div>
        </div>
        <div className="absolute inset-0 animate-spin-reverse">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>

      {/* Loading text with animated dots */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-lg font-medium text-foreground">
          Analyzing your finances
          <span className="inline-flex w-6">
            <span className="animate-dot-1">.</span>
            <span className="animate-dot-2">.</span>
            <span className="animate-dot-3">.</span>
          </span>
        </p>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{progress}% complete</p>
      </div>

      <style jsx>{`
        @keyframes bar-grow-1 {
          0%,
          100% {
            height: 20px;
          }
          50% {
            height: 60px;
          }
        }
        @keyframes bar-grow-2 {
          0%,
          100% {
            height: 40px;
          }
          50% {
            height: 80px;
          }
        }
        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes dot-appear {
          to {
            r: 5;
          }
        }
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-reverse {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes dot-bounce-1 {
          0%,
          100% {
            opacity: 0.3;
          }
          33% {
            opacity: 1;
          }
        }
        @keyframes dot-bounce-2 {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes dot-bounce-3 {
          0%,
          100% {
            opacity: 0.3;
          }
          66% {
            opacity: 1;
          }
        }
        .animate-bar-grow-1 {
          animation: bar-grow-1 1.5s ease-in-out infinite;
        }
        .animate-bar-grow-2 {
          animation: bar-grow-2 1.5s ease-in-out infinite;
        }
        .animate-draw-line {
          animation: draw-line 2s ease-out forwards infinite;
        }
        .animate-dot-appear {
          animation: dot-appear 0.3s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-dot-1 {
          animation: dot-bounce-1 1.5s ease-in-out infinite;
        }
        .animate-dot-2 {
          animation: dot-bounce-2 1.5s ease-in-out infinite;
        }
        .animate-dot-3 {
          animation: dot-bounce-3 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export function MinimalFinanceLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg width="80" height="80" viewBox="0 0 80 80" className="animate-pulse">
        {/* Circular background */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-border"
        />

        {/* Spinning arc */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="60 170"
          className="text-accent animate-spin"
          style={{ transformOrigin: 'center' }}
        />

        {/* Dollar sign */}
        <text
          x="40"
          y="46"
          textAnchor="middle"
          className="text-xl font-bold fill-primary"
        >
          $
        </text>
      </svg>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

export function DataProcessingLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 0.8;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className="overflow-visible"
        >
          {/* Outer decorative ring */}
          <circle
            cx="110"
            cy="110"
            r="105"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
            className="text-border animate-spin-very-slow"
            style={{ transformOrigin: 'center' }}
          />

          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted"
          />

          {/* Animated progress ring */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${progress * 5.65} 565`}
            className="text-accent transition-all duration-75"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
            }}
          />

          {/* Inner glow circle */}
          <circle
            cx="110"
            cy="110"
            r="70"
            fill="currentColor"
            className="text-card opacity-50"
          />
          <circle
            cx="110"
            cy="110"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />

          {/* Animated pie chart segments */}
          <g style={{ transform: 'translate(110px, 110px)' }}>
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M 0 0 L ${40 * Math.cos((i * Math.PI) / 2 - Math.PI / 2)} ${40 * Math.sin((i * Math.PI) / 2 - Math.PI / 2)} A 40 40 0 0 1 ${40 * Math.cos(((i + 1) * Math.PI) / 2 - Math.PI / 2)} ${40 * Math.sin(((i + 1) * Math.PI) / 2 - Math.PI / 2)} Z`}
                fill="currentColor"
                className={`animate-pie-segment ${i === 0 ? 'text-accent' : i === 1 ? 'text-primary' : i === 2 ? 'text-accent/60' : 'text-primary/60'}`}
                style={{
                  transformOrigin: 'center',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </g>

          {/* Center data icon */}
          <g className="animate-pulse-slow">
            {/* Database icon */}
            <ellipse
              cx="110"
              cy="100"
              rx="18"
              ry="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground"
            />
            <path
              d="M 92 100 L 92 120 Q 92 126 110 126 Q 128 126 128 120 L 128 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground"
            />
            <ellipse
              cx="110"
              cy="110"
              rx="18"
              ry="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground"
            />
          </g>

          {/* Animated data particles */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={i}
              r="3"
              fill="currentColor"
              className="text-accent animate-orbit-particle"
              style={{
                offsetPath: "path('M 110 20 A 90 90 0 1 1 109.9 20')",
                animationDelay: `${i * -0.5}s`,
                animationDuration: '3s',
              }}
            />
          ))}

          {/* Floating data points */}
          {[
            { x: 45, y: 50, delay: 0 },
            { x: 175, y: 60, delay: 0.3 },
            { x: 55, y: 170, delay: 0.6 },
            { x: 165, y: 160, delay: 0.9 },
          ].map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="currentColor"
                className="text-card"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="currentColor"
                className="text-accent animate-data-pulse"
                style={{ animationDelay: `${point.delay}s` }}
              />
              {/* Connection lines */}
              <line
                x1={point.x}
                y1={point.y}
                x2="110"
                y2="110"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-border animate-dash-flow"
                style={{ animationDelay: `${point.delay}s` }}
              />
            </g>
          ))}

          {/* Mini bar chart */}
          <g className="translate-x-[155px] translate-y-[85px]">
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={i * 8}
                y={30}
                width="5"
                rx="1"
                fill="currentColor"
                className="text-primary animate-mini-bar"
                style={{
                  height: '0',
                  transformOrigin: 'bottom',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </g>
        </svg>

        {/* Orbiting rings */}
        <div className="absolute inset-0 animate-spin-slow pointer-events-none">
          <div className="absolute top-1 left-1/2 -translate-x-1/2">
            <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-lg shadow-accent/50" />
          </div>
        </div>
        <div className="absolute inset-0 animate-spin-reverse pointer-events-none">
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <div className="h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
          </div>
        </div>
        <div className="absolute inset-0 animate-spin-medium pointer-events-none">
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <div className="h-1.5 w-1.5 rounded-full bg-accent/70" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-64">
        {/* Current text */}
        <p className="text-lg font-medium text-foreground text-center">
          Fetching data
          <span className="inline-flex w-6">
            <span className="animate-dot-1">.</span>
            <span className="animate-dot-2">.</span>
            <span className="animate-dot-3">.</span>
          </span>
        </p>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-75 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xs font-medium text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Animated wave bars */}
        <div className="flex items-center gap-1 mt-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-accent animate-wave-bar"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: '20px',
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-reverse {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes dot-bounce-1 {
          0%,
          100% {
            opacity: 0.3;
          }
          33% {
            opacity: 1;
          }
        }
        @keyframes dot-bounce-2 {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes dot-bounce-3 {
          0%,
          100% {
            opacity: 0.3;
          }
          66% {
            opacity: 1;
          }
        }
        @keyframes mini-bar {
          0%,
          100% {
            height: 8px;
          }
          50% {
            height: 25px;
          }
        }
        @keyframes spin-very-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-medium {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes pie-segment {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes orbit-particle {
          0% {
            offset-distance: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
          }
        }
        @keyframes data-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
        @keyframes dash-flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 24;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes wave-bar {
          0%,
          100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-dot-1 {
          animation: dot-bounce-1 1.5s ease-in-out infinite;
        }
        .animate-dot-2 {
          animation: dot-bounce-2 1.5s ease-in-out infinite;
        }
        .animate-dot-3 {
          animation: dot-bounce-3 1.5s ease-in-out infinite;
        }
        .animate-mini-bar {
          animation: mini-bar 1.2s ease-in-out infinite;
        }
        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }
        .animate-spin-medium {
          animation: spin-medium 4s linear infinite;
        }
        .animate-pie-segment {
          animation: pie-segment 2s ease-in-out infinite;
        }
        .animate-orbit-particle {
          animation: orbit-particle 3s linear infinite;
        }
        .animate-data-pulse {
          animation: data-pulse 1.5s ease-in-out infinite;
        }
        .animate-dash-flow {
          animation: dash-flow 1s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .animate-wave-bar {
          animation: wave-bar 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
