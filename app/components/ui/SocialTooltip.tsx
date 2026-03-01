"use client";

import { ReactNode, useState } from "react";

interface SocialTooltipProps {
  children: ReactNode;
  label: string;
}

export default function SocialTooltip({ children, label }: SocialTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-md bg-neutral-900 px-2.5 py-1 text-xs text-white whitespace-nowrap pointer-events-none dark:bg-neutral-100 dark:text-neutral-950">
          {label}
        </div>
      )}
    </div>
  );
}
