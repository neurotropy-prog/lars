interface BisagraProps {
  /** Score principal (número grande) */
  score: number;
  /** Benchmark de comparación */
  benchmark: number;
  /** Texto de la brecha */
  gap: string;
  /** Texto del amplificador social */
  socialAmplifier?: string;
}

export default function Bisagra({
  score,
  benchmark,
  gap,
  socialAmplifier,
}: BisagraProps) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary))",
        border: "var(--border-accent)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-8)",
        margin: "var(--space-8) 0",
      }}
    >
      {/* Score principal */}
      <p
        style={{
          fontFamily: "var(--font-plus-jakarta)",
          fontSize: "var(--text-display)",
          lineHeight: "var(--lh-display)",
          color: "var(--color-text-primary)",
          fontWeight: 600,
        }}
      >
        {score}
      </p>

      {/* Benchmark */}
      <p
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontSize: "var(--text-h3)",
          lineHeight: "var(--lh-h3)",
          color: "var(--color-text-secondary)",
          marginTop: "var(--space-2)",
        }}
      >
        vs {benchmark}
      </p>

      {/* Brecha */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "var(--text-body)",
          color: "var(--color-accent)",
          fontWeight: 500,
          marginTop: "var(--space-4)",
        }}
      >
        {gap}
      </p>

      {/* Amplificador social */}
      {socialAmplifier && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "var(--text-body-sm)",
            color: "var(--color-text-secondary)",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "var(--space-4)",
            marginTop: "var(--space-4)",
          }}
        >
          {socialAmplifier}
        </p>
      )}
    </div>
  );
}
