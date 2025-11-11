import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center justify-center gap-2">
        {['R', 'E', 'P', 'O'].map((letter, index) => (
          <div
            key={letter}
            className="relative w-12 h-12 sm:w-16 sm:h-16"
            style={{
              animation: `loader 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite`,
              animationDelay: `${index * 0.15}s`
            }}
          >
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <rect
                x={8}
                y={8}
                width={64}
                height={64}
                fill="none"
                stroke="currentColor"
                strokeWidth={10}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="text-gray-600 dark:text-gray-400"
                style={{
                  strokeDasharray: '192 64 192 64',
                  strokeDashoffset: 0,
                  animation: 'pathRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite'
                }}
              />
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                className="fill-current text-gray-900 dark:text-white font-bold text-2xl"
              >
                {letter}
              </text>
            </svg>
            <div
              className="absolute w-2 h-2 bg-blue-500 rounded-full top-[45px] left-[26px]"
              style={{
                transform: 'translate(-18px, -18px)',
                animation: 'dotRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite'
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pathRect {
          25% { stroke-dashoffset: 64; }
          50% { stroke-dashoffset: 128; }
          75% { stroke-dashoffset: 192; }
          100% { stroke-dashoffset: 256; }
        }

        @keyframes dotRect {
          25% { transform: translate(0, 0); }
          50% { transform: translate(18px, -18px); }
          75% { transform: translate(0, -36px); }
          100% { transform: translate(-18px, -18px); }
        }

        @keyframes loader {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default Loader; 