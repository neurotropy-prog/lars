interface SeparatorProps {
  style?: React.CSSProperties;
}

export default function Separator({ style }: SeparatorProps) {
  return (
    <div
      role="separator"
      style={{
        height: "1px",
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        margin: "var(--space-8) 0",
        ...style,
      }}
    />
  );
}
