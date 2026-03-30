/**
 * gateway-bloque2-data.ts
 * Fuente de verdad del copy del Bloque 2 del gateway.
 * P5 → P6 → Micro-espejo 2 → P7 → P8
 * Texto exacto de docs/features/FEATURE_GATEWAY_DESIGN.md y PHASE_3.
 */

import type { ReflectionContent, SelectOption } from './gateway-bloque1-data'

// ─── P5 — ALEGRÍA DE VIVIR (D5) ──────────────────────────────────────────────

export const P5_OPTIONS: SelectOption[] = [
  {
    id: 'A',
    title: '"No lo recuerdo"',
  },
  {
    id: 'B',
    title: '"Hace semanas o meses"',
  },
  {
    id: 'C',
    title: '"Puedo, pero no suelto la cabeza"',
    subtitle: 'Disfrutas pero no del todo — algo te tira de vuelta',
  },
  {
    id: 'D',
    title: '"Disfruto con culpa"',
    subtitle: 'Sientes que deberías estar haciendo algo productivo',
  },
  {
    id: 'E',
    title: '"Disfruto con frecuencia"',
  },
]

// ─── P6 — FRASE IDENTITARIA (la más importante del gateway) ──────────────────

export const P6_OPTIONS: SelectOption[] = [
  {
    id: 'A',
    title: '"No puedo parar"',
    subtitle: 'Sientes que si aflojas, todo lo que has construido se cae',
  },
  {
    id: 'B',
    title: '"Puedo con todo"',
    subtitle: 'No necesitas ayuda — o eso es lo que repites',
  },
  {
    id: 'C',
    title: '"Si yo caigo, todos caen"',
    subtitle: 'Las personas que dependen de ti te mantienen en pie — y agotado',
  },
  {
    id: 'D',
    title: '"Necesito entender primero"',
    subtitle: 'No actúas hasta que lo tienes todo claro — y nunca está del todo claro',
  },
  {
    id: 'E',
    title: '"He probado de todo"',
    subtitle: 'Nada ha funcionado de verdad y empiezas a dudar de que algo pueda',
  },
]

// ─── MICRO-ESPEJO 2 — 5 variantes por P6 (frase identitaria) ─────────────────

const MICRO_ESPEJO_2_MAP: Record<string, ReflectionContent> = {
  A: {
    text: 'Llevas años confundiendo resistencia con fortaleza. Tu cuerpo te pide parar pero tu miedo te dice que no puedes. Y ese miedo no es irracional — es la respuesta de un sistema nervioso que lleva tanto tiempo en emergencia que ya no sabe funcionar de otra forma. No necesitas parar. Necesitas regularte para que tu rendimiento no dependa de tu desgaste.',
    collectiveData:
      'El 91% de personas que seleccionan esta frase llevan más de 2 años con su sistema nervioso en modo alarma sin saberlo. Los que regularon su biología no pararon — rindieron mejor.',
  },
  B: {
    text: 'Poder con todo tiene un precio que nadie ve — ni siquiera tú. Tu cuerpo lleva la cuenta aunque tu mente la ignore. No te estamos pidiendo que admitas debilidad. Te estamos mostrando datos. Y los datos dicen que tu sistema nervioso está sosteniendo un nivel de alerta que tiene fecha de caducidad.',
    collectiveData:
      'De las personas que responden "puedo con todo", el 89% presenta señales biológicas que contradicen su percepción. No es fortaleza — es un sistema nervioso que ya no puede enviar la señal de alarma porque la alarma lleva años encendida.',
  },
  C: {
    text: 'Has convertido el cuidado de los demás en tu razón de existir — y tu propio cuidado en un lujo que no te permites. Pero la biología no entiende de sacrificios: tu cuerpo se desgasta igual cuides de quien cuides. Y cuando se desgasta el que sostiene todo... todo lo que sostienes se cae.',
    collectiveData:
      'El 86% de personas con tu patrón reportan que la culpa de cuidarse es mayor que el malestar de no hacerlo. Es la trampa más silenciosa del agotamiento.',
  },
  D: {
    text: 'Entender es tu forma de sentirte seguro. Pero hay un punto donde entender más se convierte en la excusa perfecta para no actuar — porque actuar implica soltar el control. Lo que tu sistema nervioso necesita no es más análisis. Es una intervención concreta, medible y reversible.',
    collectiveData:
      'Las personas que priorizan entender antes de actuar tardan una media de 14 meses más en resolver su situación. No por falta de información — por exceso de análisis.',
  },
  E: {
    text: 'No es que nada funcione. Es que nadie ha mirado el cuadro completo. Un psicólogo trabaja la mente pero no tiene acceso a tu bioquímica. Un médico mira analíticas estándar que no miden lo que importa. Un coach te da herramientas que tu cerebro no puede ejecutar. Lo que falta no es otro intento — es un abordaje que integre todo.',
    collectiveData:
      'El 72% de las personas que llegan al programa han probado 3 o más enfoques previos. El factor común: ninguno abordó la biología como punto de partida.',
  },
}

export function getMicroEspejo2(p6: string): ReflectionContent {
  return MICRO_ESPEJO_2_MAP[p6] ?? MICRO_ESPEJO_2_MAP['A']
}

// ─── P7 — SLIDERS (etiquetas de cada dimensión) ───────────────────────────────

export interface SliderDimension {
  id: string
  label: string
}

export const P7_SLIDERS: SliderDimension[] = [
  { id: 'd1', label: 'Capacidad de descansar y desconectar' },
  { id: 'd2', label: 'Calidad de tu sueño' },
  { id: 'd3', label: 'Claridad para pensar y decidir' },
  { id: 'd4', label: 'Estabilidad emocional' },
  { id: 'd5', label: 'Ilusión por lo que haces' },
]

// ─── P8 — DURACIÓN ────────────────────────────────────────────────────────────

export const P8_OPTIONS: SelectOption[] = [
  { id: 'A', title: '"Semanas"' },
  { id: 'B', title: '"Meses"' },
  { id: 'C', title: '"Más de un año"' },
  { id: 'D', title: '"Años — no recuerdo estar bien"' },
]

// ─── TIPOS DE RESPUESTAS ──────────────────────────────────────────────────────

export interface Bloque2Answers {
  p5: string
  p6: string
  /** Valores 1-10 por dimensión (undefined = no movido) */
  sliders: Record<string, number | undefined>
  p8: string
}
