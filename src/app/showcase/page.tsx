import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Separator from "@/components/ui/Separator";
import ProgressBar from "@/components/ui/ProgressBar";
import MicroEspejo from "@/components/ui/MicroEspejo";
import Bisagra from "@/components/ui/Bisagra";
import SiteHeader from "@/components/SiteHeader";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "var(--space-16)" }}>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "var(--text-overline)",
          letterSpacing: "var(--ls-overline)",
          color: "var(--color-accent)",
          textTransform: "uppercase",
          marginBottom: "var(--space-3)",
        }}
      >
        {title}
      </p>
      <Separator style={{ marginTop: 0, marginBottom: "var(--space-6)" }} />
      {children}
    </section>
  );
}

export default function ShowcasePage() {
  return (
    <>
    <SiteHeader variant="default" />
    <main className="container" style={{ paddingTop: "calc(var(--header-height, 56px) + var(--space-16))", paddingBottom: "var(--space-24)" }}>
      {/* Header */}
      <div style={{ marginBottom: "var(--space-16)" }}>
        <h1
          style={{
            fontFamily: "var(--font-lora)",
            fontSize: "var(--text-h1)",
            lineHeight: "var(--lh-h1)",
            letterSpacing: "var(--ls-h1)",
            fontWeight: 700,
            color: "var(--color-text-primary)",
          }}
        >
          Sistema de Diseño L.A.R.S.©
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "var(--text-body)",
            color: "var(--color-text-secondary)",
            marginTop: "var(--space-3)",
          }}
        >
          Componentes base — Fase 0
        </p>
      </div>

      {/* Tipografía */}
      <Section title="Tipografía">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <p
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "var(--text-display)",
              lineHeight: "var(--lh-display)",
              letterSpacing: "var(--ls-display)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            Display — Lora 700
          </p>
          <p
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "var(--text-h1)",
              lineHeight: "var(--lh-h1)",
              letterSpacing: "var(--ls-h1)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            H1 — Lora 700
          </p>
          <p
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "var(--text-h2)",
              lineHeight: "var(--lh-h2)",
              letterSpacing: "var(--ls-h2)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            H2 — Lora 700
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "var(--text-h3)",
              lineHeight: "var(--lh-h3)",
              letterSpacing: "var(--ls-h3)",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            H3 — Inter 600
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "var(--text-body)",
              lineHeight: "var(--lh-body)",
              color: "var(--color-text-primary)",
            }}
          >
            Body — Inter 400. Tu cuerpo lleva meses hablándote. Esta es la primera vez que alguien te traduce lo que dice.
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "var(--text-body-sm)",
              lineHeight: "var(--lh-body-sm)",
              letterSpacing: "var(--ls-body-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            Body Small — Inter 400. Texto secundario, captions y metadata.
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "var(--text-caption)",
              lineHeight: "var(--lh-caption)",
              letterSpacing: "var(--ls-caption)",
              color: "var(--color-text-tertiary)",
            }}
          >
            Caption — Inter 400. Timestamps, metadata.
          </p>
        </div>
      </Section>

      {/* Colores */}
      <Section title="Colores">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "var(--space-4)" }}>
          {[
            { name: "bg-primary", color: "var(--color-bg-primary)", border: true },
            { name: "bg-secondary", color: "var(--color-bg-secondary)" },
            { name: "bg-tertiary", color: "var(--color-bg-tertiary)" },
            { name: "bg-elevated", color: "var(--color-bg-elevated)" },
            { name: "accent", color: "var(--color-accent)" },
            { name: "accent-hover", color: "var(--color-accent-hover)" },
            { name: "accent-muted", color: "var(--color-accent-muted)" },
            { name: "success", color: "var(--color-success)" },
            { name: "warning", color: "var(--color-warning)" },
            { name: "error", color: "var(--color-error)" },
            { name: "info", color: "var(--color-info)" },
          ].map(({ name, color, border }) => (
            <div key={name}>
              <div
                style={{
                  width: "100%",
                  height: 60,
                  backgroundColor: color,
                  borderRadius: "var(--radius-sm)",
                  border: border ? "var(--border-medium)" : "none",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-text-tertiary)",
                  marginTop: "var(--space-2)",
                }}
              >
                {name}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Botones */}
      <Section title="Botones">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "center" }}>
          <Button variant="primary" size="large">Empieza la Semana 1</Button>
          <Button variant="primary">Primario Default</Button>
          <Button variant="primary" size="small">Primario Small</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <Card>
            <p
              style={{
                fontFamily: "var(--font-lora)",
                fontSize: "var(--text-display)",
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              73%
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "var(--text-body-sm)",
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-2)",
              }}
            >
              de ejecutivos con burnout no saben que lo tienen
            </p>
          </Card>
          <Card interactive>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "var(--text-h4)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              &ldquo;Agotamiento que no se va&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "var(--text-body-sm)",
                fontStyle: "italic",
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-2)",
              }}
            >
              Llevas tiempo sintiéndote agotado y nada de lo que haces lo resuelve
            </p>
          </Card>
          <Card>
            <p
              style={{
                fontFamily: "var(--font-lora)",
                fontSize: "var(--text-h1)",
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              25.000+
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "var(--text-body-sm)",
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-2)",
              }}
            >
              sistemas nerviosos analizados
            </p>
          </Card>
        </div>
      </Section>

      {/* Input */}
      <Section title="Input">
        <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Input type="email" placeholder="tu@email.com" />
          <Input type="email" placeholder="tu@email.com" error="Revisa tu email — lo necesitamos correcto para guardarte el mapa." />
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Badge status="new">Nuevo</Badge>
          <Badge status="updated">Actualizado</Badge>
          <Badge status="available">Disponible</Badge>
        </div>
      </Section>

      {/* Barra de progreso */}
      <Section title="Barra de progreso">
        <div style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          <ProgressBar value={10} label="Tu evaluación: 10% completo" />
          <ProgressBar value={45} label="Tu evaluación: 45% completo" />
          <ProgressBar value={90} label="Tu evaluación: 90% completo" />
        </div>
      </Section>

      {/* Micro-espejo */}
      <Section title="Micro-espejo">
        <div style={{ maxWidth: 600 }}>
          <MicroEspejo
            observation="Tu patrón de sueño sugiere que tu sistema nervioso lleva tiempo sin poder descansar realmente. No es insomnio — es un cuerpo que no sabe apagarse."
            collectiveData="El 73% de personas en tu situación reportan exactamente lo mismo."
          />
          <MicroEspejo observation="Lo que describes no es agotamiento normal. Es el perfil clásico de un sistema nervioso que ha estado en modo alarma demasiado tiempo." />
        </div>
      </Section>

      {/* Bisagra */}
      <Section title="Bisagra">
        <div style={{ maxWidth: 500 }}>
          <Bisagra
            score={34}
            benchmark={72}
            gap="38 puntos por debajo del nivel de regulación saludable"
            socialAmplifier="De las 847 personas con tu patrón, las que actuaron en la primera semana mejoraron un 34% más rápido."
          />
        </div>
      </Section>

      {/* Separador */}
      <Section title="Separador">
        <div style={{ maxWidth: 500 }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "var(--text-body)", color: "var(--color-text-secondary)" }}>
            Contenido antes del separador
          </p>
          <Separator />
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "var(--text-body)", color: "var(--color-text-secondary)" }}>
            Contenido después del separador
          </p>
        </div>
      </Section>
    </main>
    </>
  );
}
