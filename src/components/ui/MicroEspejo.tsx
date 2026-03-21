interface MicroEspejoProps {
  /** La observación personalizada (se muestra en itálica) */
  observation: string;
  /** Dato colectivo de refuerzo (opcional) */
  collectiveData?: string;
}

export default function MicroEspejo({
  observation,
  collectiveData,
}: MicroEspejoProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderLeft: "3px solid var(--color-accent-muted)",
        borderRadius: "0 var(--radius-md) var(--radius-md) 0",
        padding: "var(--space-5) var(--space-6)",
        margin: "var(--space-6) 0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "var(--text-body)",
          lineHeight: "var(--lh-body)",
          color: "var(--color-text-primary)",
          fontStyle: "italic",
        }}
      >
        {observation}
      </p>
      {collectiveData && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "var(--text-body-sm)",
            lineHeight: "var(--lh-body-sm)",
            color: "var(--color-text-secondary)",
            marginTop: "var(--space-2)",
          }}
        >
          {collectiveData}
        </p>
      )}
    </div>
  );
}
