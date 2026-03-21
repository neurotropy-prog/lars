import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export default function Card({
  interactive = false,
  style,
  children,
  ...props
}: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        border: "var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        transition: "all var(--transition-base)",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
