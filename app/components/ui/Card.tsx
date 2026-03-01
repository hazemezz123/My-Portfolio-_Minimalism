import { forwardRef, type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className = "", hover = true },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] ${
        hover
          ? "transition-transform transition-colors duration-150 ease-out hover:-translate-y-0.5 hover:border-neutral-400 dark:hover:border-neutral-700"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
});

export default Card;
