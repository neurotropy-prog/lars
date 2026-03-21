type BadgeStatus = "new" | "updated" | "available";

interface BadgeProps {
  status: BadgeStatus;
  children: React.ReactNode;
}

export default function Badge({ status, children }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: "var(--color-accent-subtle)",
        color: "var(--color-accent)",
        borderRadius: "var(--radius-pill)",
        padding: "4px 12px",
        fontFamily: "var(--font-inter-tight)",
        fontSize: "var(--text-caption)",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
      data-status={status}
    >
      {children}
    </span>
  );
}
