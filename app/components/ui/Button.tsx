import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline";

interface BaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 dark:active:bg-neutral-300",
  outline:
    "border border-neutral-400 text-neutral-900 hover:border-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:active:bg-neutral-800",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] disabled:cursor-not-allowed disabled:opacity-60";

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
