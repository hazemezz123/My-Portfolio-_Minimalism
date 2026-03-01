interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={`mx-auto max-w-[1040px] px-6 ${className}`}>
      {children}
    </Component>
  );
}
