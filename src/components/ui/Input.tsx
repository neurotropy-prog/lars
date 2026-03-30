import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({ error, style, ...props }: InputProps) {
  return (
    <div>
      <input
        style={{
          width: "100%",
          backgroundColor: "var(--color-bg-tertiary)",
          border: error
            ? "1px solid var(--color-error)"
            : "var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: "14px 16px",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-host-grotesk)",
          fontSize: "var(--text-body)",
          lineHeight: "var(--lh-body)",
          transition: "border var(--transition-base), box-shadow var(--transition-base)",
          outline: "none",
          ...style,
        }}
        {...props}
      />
      {error && (
        <p
          style={{
            fontFamily: "var(--font-host-grotesk)",
            fontSize: "var(--text-body-sm)",
            color: "var(--color-error)",
            marginTop: "var(--space-2)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
