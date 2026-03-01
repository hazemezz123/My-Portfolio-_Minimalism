interface HeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

const sizes = {
  h1: "text-4xl sm:text-5xl lg:text-6xl",
  h2: "text-2xl sm:text-3xl",
  h3: "text-lg sm:text-xl",
  h4: "text-base",
};

export default function Heading({
  children,
  as: Component = "h2",
  className = "",
}: HeadingProps) {
  return (
    <Component
      className={`font-medium tracking-tight text-[var(--text)] ${sizes[Component]} ${className}`}
    >
      {children}
    </Component>
  );
}
