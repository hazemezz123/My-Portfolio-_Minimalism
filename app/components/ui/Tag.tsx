interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className = "" }: TagProps) {
  return (
    <span
      className={`inline-block rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)] transition-colors duration-150 ease-out hover:border-neutral-400 dark:hover:border-neutral-700 ${className}`}
    >
      {children}
    </span>
  );
}
