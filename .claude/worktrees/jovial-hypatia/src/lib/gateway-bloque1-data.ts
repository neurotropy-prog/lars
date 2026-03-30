/**
 * gateway-bloque1-data.ts
 * Fuente de verdad de todo el copy del Bloque 1 del gateway.
 * P2 → Primera Verdad → P3 → P4 → Micro-espejo 1
 * Texto exacto de docs/features/FEATURE_GATEWAY_DESIGN.md — no inventado.
 */

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export type P1Option = 'A' | 'B' | 'C' | 'D' | 'E'
export type P2Option = 'A' | 'B' | 'C' | 'D' | 'E'
export type P4Option = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface ReflectionContent {
  text: string
  collectiveData: string
}

export interface SelectOption {
  id: string
  title: string
  subtitle?: string
}

// ─── P2 — OPCIONES ────────────────────────────────────────────────────────────

export const P2_OPTIONS: SelectOption[] = [
  {
    id: 'A',
    title: '"Me cuesta dormirme — mi mente no se apaga"',
  },
  {
    id: 'B',
    title: '"Me despierto a las 3-4 de la mañana y no puedo volver a dormirme"',
  },
  {
    id: 'C',
    title: '"Duermo horas pero me despierto igual de cansado"',
  },
  {
    id: 'D',
    title: '"Duermo poco pero funciono"',
  },
  {
    id: 'E',
    title: '"Mi sueño es razonablemente bueno"',
  },
]

// ─── P3 — OPCIONES (selección múltiple) ──────────────────────────────────────

export interface MultiOption {
  id: string
  title: string
  subtitle: string
}

export const P3_OPTIONS: MultiOption[] = [
  {
    id: 'niebla',
    title: '"Niebla mental"',
    subtitle: 'Leo algo y al terminar no sé qué he leído',
  },
  {
    id: 'decisiones',
    title: '"Peores decisiones"',
    subtitle: 'Tomo peores decisiones que antes — y lo noto',
  },
  {
    id: 'dispersa',
    title: '"Mente dispersa"',
    subtitle: 'Mi cabeza salta de un tema a otro sin control',
  },
  {
    id: 'palabras',
    title: '"Palabras perdidas"',
    subtitle: 'Me cuesta encontrar palabras que antes tenía',
  },
  {
    id: 'decisional',
    title: '"Agotamiento decisional"',
    subtitle: 'Al final del día no puedo elegir ni qué cenar',
  },
  {
    id: 'ninguna',
    title: '"Ninguna de estas"',
    subtitle: '',
  },
]

// ─── P4 — OPCIONES ────────────────────────────────────────────────────────────

export const P4_OPTIONS: SelectOption[] = [
  {
    id: 'A',
    title: '"Irritabilidad"',
    subtitle: 'Te encienden cosas que antes no te afectaban',
  },
  {
    id: 'B',
    title: '"Vacío"',
    subtitle: 'Sientes un hueco que no sabes describir aunque desde fuera todo va bien',
  },
  {
    id: 'C',
    title: '"Explosiones de culpa"',
    subtitle: 'Explotas con quien más quieres y después te sientes fatal',
  },
  {
    id: 'D',
    title: '"Anestesia emocional"',
    subtitle: 'No sientes nada — ni alegría ni tristeza. Como si estuvieras apagado',
  },
  {
    id: 'E',
    title: '"Rumiación constante"',
    subtitle: 'Tu mente no para: conversaciones, errores, escenarios futuros',
  },
  {
    id: 'F',
    title: '"Razonablemente bien"',
    subtitle: 'Tu equilibrio emocional es aceptable',
  },
]

// ─── PRIMERA VERDAD — 5 variantes P1 × P2 ────────────────────────────────────

// Clave: "P1-P2". Para P1=D se usa "D-*" (independiente de P2).
const PRIMERA_VERDAD_MAP: Record<string, ReflectionContent> = {
  'A-B': {
    text: 'Tu agotamiento no es cansancio normal. Tu cortisol se dispara de noche porque tu sistema no distingue descanso de amenaza.',
    collectiveData:
      'El 78% de los +25.000 sistemas nerviosos analizados con tu patrón de respuestas presentan niveles de la hormona del estrés crónicamente elevados. No es falta de voluntad — es bioquímica.',
  },
  'B-A': {
    text: 'Tu rendimiento bajó porque tu cerebro no descansa. Sin sueño profundo, el prefrontal no puede tomar decisiones con la precisión que antes tenías.',
    collectiveData:
      'El 71% de ejecutivos con deterioro cognitivo progresivo reportan un patrón de sueño idéntico al tuyo como factor previo. La conexión es directa y reversible.',
  },
  'C-B': {
    text: 'Tu cuerpo te está dando señales que tu mente ha intentado ignorar. El despertar nocturno es la más clara — y la que más información contiene.',
    collectiveData:
      'El 82% de personas con señales físicas persistentes y despertar nocturno muestran activación crónica del sistema de alerta. El cuerpo habló antes que la mente.',
  },
  'D-*': {
    text: 'Alguien que te conoce vio algo que tú llevas tiempo normalizando. Tu sistema nervioso confirma que tenía razón.',
    collectiveData:
      'El 69% de personas derivadas por un profesional presentan un nivel de agotamiento que ya habían normalizado completamente. El entorno siempre lo detecta antes.',
  },
  'E-D': {
    text: 'Dices que funcionas con poco sueño. Tu sistema nervioso puede tener una versión diferente de esa historia.',
    collectiveData:
      'El 74% de personas que declaran "funcionar con poco sueño" muestran marcadores de déficit cognitivo acumulado que no perciben subjetivamente. El umbral se mueve — lo que antes era cansancio ya no lo registras como tal.',
  },
}

// Fallbacks por P1 cuando no hay combinación exacta
const PRIMERA_VERDAD_FALLBACK: Partial<Record<P1Option, ReflectionContent>> = {
  A: PRIMERA_VERDAD_MAP['A-B'],
  B: PRIMERA_VERDAD_MAP['B-A'],
  C: PRIMERA_VERDAD_MAP['C-B'],
  D: PRIMERA_VERDAD_MAP['D-*'],
  E: PRIMERA_VERDAD_MAP['E-D'],
}

export function getPrimeraVerdad(p1: string, p2: string): ReflectionContent {
  if (p1 === 'D') return PRIMERA_VERDAD_MAP['D-*']
  const key = `${p1}-${p2}`
  return (
    PRIMERA_VERDAD_MAP[key] ??
    PRIMERA_VERDAD_FALLBACK[p1 as P1Option] ??
    PRIMERA_VERDAD_MAP['A-B']
  )
}

// ─── MICRO-ESPEJO 1 — 5 variantes P3 × P4 ────────────────────────────────────

export function getMicroEspejo1(
  p3Selections: string[],
  p4: string
): ReflectionContent {
  const realSymptoms = p3Selections.filter((s) => s !== 'ninguna')
  const many = realSymptoms.length >= 3

  if (!many && p4 === 'B') {
    return {
      text: 'Tu cerebro funciona pero por dentro hay un vacío. No es tristeza — es un sistema nervioso que se ha apagado para protegerte. Como un fusible que salta.',
      collectiveData:
        'El 67% de personas con tu combinación no identifican esto como agotamiento. Lo viven como ausencia sin causa. Tiene causa — y tiene solución.',
    }
  }

  if (many && p4 === 'C') {
    return {
      text: 'Das todo lo que tienes a los demás y lo que queda para ti no alcanza. Tu cerebro no tiene recursos para regularse después de regularte a ti — y el resultado es que explotas justo con quien menos quieres.',
      collectiveData:
        'El 79% de personas con tu patrón sienten culpa después de las explosiones. Esa culpa también agota. Es un ciclo — no un defecto de carácter.',
    }
  }

  if (many && p4 === 'D') {
    return {
      text: 'Tu cuerpo ha encontrado la forma más radical de protegerte: apagar los circuitos. No es que no te importe — es que sentir se volvió demasiado costoso para tu sistema.',
      collectiveData:
        'El 61% de personas con anestesia emocional tardan más de 2 años en identificar lo que les ocurre. Tú lo estás nombrando hoy.',
    }
  }

  if (!many && p4 === 'E') {
    return {
      text: 'Tu capacidad cognitiva está intacta pero tu mente la usa para anticipar en lugar de ejecutar. No estás pensando — estás sobreviviendo mentalmente.',
      collectiveData:
        'El 73% de personas con rumiación activa y pocas señales cognitivas tienen el sistema nervioso en hipervigilancia constante. La amenaza que monitoriza no existe — pero el sistema actúa como si sí.',
    }
  }

  // Default — muchos síntomas + A (irritabilidad) o E (rumiación): caso más frecuente
  return {
    text: 'Tu cabeza va a mil pero tu capacidad de procesar se ha reducido. No es que seas menos capaz — es que tu cerebro está usando su energía para mantenerte en alerta en lugar de para pensar con claridad. Y eso tiene una consecuencia directa: te irritas más porque tu freno interno está agotado.',
    collectiveData:
      'El 83% de personas con tu combinación de respuestas no saben que la irritabilidad y la niebla mental tienen la misma causa. Cuando se regula una, la otra mejora.',
  }
}
