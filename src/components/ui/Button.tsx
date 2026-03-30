import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "small" | "default" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-cta)",
    color: "var(--color-cta-text)",
    border: "1px solid var(--color-cta)",
    borderRadius: "var(--radius-pill)",
  },
  secondary: {
    backgroundColor: "var(--color-text-primary)",
    color: "var(--color-text-inverse)",
    border: "none",
    borderRadius: "var(--radius-pill)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-surface-subtle)",
    borderRadius: "var(--radius-pill)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  small: { padding: "10px 20px" },
  default: { padding: "12px 28px" },
  large: { padding: "16px 36px" },
};

export default function Button({
  variant = "primary",
  size = "default",
  style,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{
        fontFamily: "var(--font-host-grotesk)",
        fontSize: "var(--text-body-sm)",
        fontWeight: 500,
        lineHeight: 1,
        cursor: "pointer",
        transition: "all var(--transition-base)",
        textTransform: "none" as const,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
