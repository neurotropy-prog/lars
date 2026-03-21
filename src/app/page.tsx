export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "var(--space-6)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontSize: "var(--text-overline)",
          letterSpacing: "var(--ls-overline)",
          color: "var(--color-accent)",
          textTransform: "uppercase",
          marginBottom: "var(--space-4)",
        }}
      >
        Instituto Epigenético
      </p>
      <h1
        style={{
          fontFamily: "var(--font-plus-jakarta)",
          fontSize: "var(--text-display)",
          lineHeight: "var(--lh-display)",
          letterSpacing: "var(--ls-display)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          maxWidth: "800px",
        }}
      >
        Descubre en qué estado está tu sistema nervioso
      </h1>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "var(--text-body)",
          lineHeight: "var(--lh-body)",
          color: "var(--color-text-secondary)",
          marginTop: "var(--space-5)",
          maxWidth: "600px",
        }}
      >
        Fase 0 completada. Sistema de diseño activo.
      </p>
    </main>
  );
}
