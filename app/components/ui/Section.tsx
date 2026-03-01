interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export default function Section({ children, id, className = "" }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-24 ${className}`}>
      {children}
    </section>
  );
}
