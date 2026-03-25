/**
 * profile-intelligence.ts — Motor de Inteligencia de Perfil
 *
 * Contiene TODA la inteligencia de los 4 perfiles aplicada al contexto
 * post-gateway. Es un motor de reglas estático (no IA generativa).
 * Se usa en el Hub, LAM y acciones de Javi.
 *
 * Fuente: docs/sprints/admin-v2/SPRINT_0_FOUNDATION.md
 */

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export type ActionType =
  | 'personal_note'
  | 'video'
  | 'early_unlock'
  | 'express_session'
  | 'manual_email'

export type HeatLevel = 'hot' | 'warm' | 'cold' | 'converted' | 'paused' | 'lost'

export interface HeatScore {
  score: number
  level: HeatLevel
}

export interface SuggestedAction {
  type: ActionType
  reason: string
  template?: string
  urgency: 'high' | 'medium' | 'low'
}

export interface LeadData {
  created_at: string
  scores?: { global?: number; [key: string]: number | string | undefined }
  profile?: { ego_primary?: string; shame_level?: string; denial_detected?: boolean }
  funnel?: {
    email_captured?: boolean
    map_visits?: number
    map_last_visit?: string | null
    cta_clicked?: boolean
    converted_week1?: boolean
    converted_program?: boolean
    session_booked?: boolean
    unsubscribed?: boolean
    emails_opened?: string[]
  }
  map_evolution?: {
    email_opens?: Record<string, string>
    email_unsubscribed?: boolean
    email_goodbye_sent?: boolean
    [key: string]: unknown
  }
  meta?: { country?: string; city?: string; region?: string; source?: string; device?: string }
  personal_actions?: PersonalAction[]
}

export interface PersonalAction {
  type: ActionType
  content: string
  created_at: string
  notify_lead?: boolean
}

export interface ProfileIntelligence {
  key: string
  label: string
  shortLabel: string
  color: string
  icon: string

  behaviors: {
    multiple_map_visits: string
    no_email_opens: string
    long_time_no_action: string
    visited_but_not_paid: string
    opened_session_email: string
    booked_session: string
    unsubscribed: string
  }

  suggested_actions: ActionType[]
  never_actions: string[]

  note_templates: {
    reengagement: string
    encouragement: string
    post_session: string
  }

  video_script_hint: string
  email_tone: string
  core_fear: string
  core_desire: string
  decision_blocker: string
}

// ─── PERFILES ────────────────────────────────────────────────────────────────

const PROFILES: ProfileIntelligence[] = [
  {
    key: 'productivo-colapsado',
    label: 'Productivo Colapsado',
    shortLabel: 'PC',
    color: '#B45A32', // terracota — acento principal
    icon: '⚡',

    core_fear: 'Que el problema sea real y no pueda resolverlo con más esfuerzo',
    core_desire: 'Volver a rendir como antes, pero esta vez de forma sostenible',
    decision_blocker: 'Su ego de alto rendimiento le dice que puede solo',

    behaviors: {
      multiple_map_visits:
        'Está evaluando datos repetidamente. Busca confirmar que tiene un problema REAL antes de pedir ayuda. Su identidad de "yo puedo solo" está en conflicto con lo que ve.',
      no_email_opens:
        'Está evitando confrontar la realidad. Los emails le recuerdan algo que su ego quiere ignorar. El subject debe apelar a RENDIMIENTO, no a salud.',
      long_time_no_action:
        'Está esperando "el momento adecuado" que nunca llega. Su sistema nervioso en modo supervivencia le impide priorizar algo que no sea producir.',
      visited_but_not_paid:
        'Ve el valor pero su identidad (soy fuerte, soy productivo) bloquea la compra. Necesita que una AUTORIDAD CLÍNICA le dé permiso para actuar.',
      opened_session_email:
        'Está considerando seriamente. El hecho de que un profesional ya tenga sus datos reduce la barrera. Reforzar: "Ya tiene tus datos, no empezáis de cero."',
      booked_session:
        'Gran señal. Va a llegar preparado con preguntas de eficiencia. Javi debe hablar en lenguaje de rendimiento y datos.',
      unsubscribed:
        'Ha decidido que "no es para tanto". Respetarlo — pero dejar la puerta abierta.',
    },

    suggested_actions: ['video', 'express_session', 'personal_note'],
    never_actions: [
      'Tono emocional blando',
      'Lenguaje de vulnerabilidad',
      '"Está bien no estar bien"',
    ],

    note_templates: {
      reengagement:
        '[Nombre], he revisado tu diagnóstico. Tu sistema nervioso está operando al [score]% de su capacidad. No es cansancio — es un patrón fisiológico documentado. He trabajado con ejecutivos en tu misma situación. Hay un protocolo específico para esto.\n\n— Dr. Javier A. Martín Ramos',
      encouragement:
        '[Nombre], los datos de tu mapa muestran algo que veo en menos del 15% de los casos. Tu dimensión de [worstDim] tiene un patrón muy específico que responde bien a intervención temprana. Merece la pena que lo mires con atención.',
      post_session:
        '[Nombre], lo que vimos en nuestra sesión confirma lo que tu mapa ya mostraba. El protocolo que te di funciona en 72 horas. Si no notas cambio, me lo dices.',
    },

    video_script_hint:
      'Habla de DATOS y RENDIMIENTO. "He analizado tu diagnóstico y hay un patrón que veo en ejecutivos de tu perfil..." Nunca de emociones. Sé directo, eficiente, como hablarías a un CEO.',
    email_tone:
      'Directo, eficiente, basado en datos. Como un informe médico personalizado, no como una carta de apoyo emocional.',
  },

  {
    key: 'fuerte-invisible',
    label: 'Fuerte Invisible',
    shortLabel: 'FI',
    color: '#4A8DB7', // info blue — discreto, profesional
    icon: '🛡️',

    core_fear: 'Que alguien vea que está sufriendo',
    core_desire: 'Entender qué le pasa desde la biología, sin tener que hablar de emociones',
    decision_blocker: 'La vergüenza de necesitar ayuda',

    behaviors: {
      multiple_map_visits:
        'Está estudiando los datos con rigor. Para este perfil, más datos = más confianza. No necesita conexión emocional — necesita EVIDENCIA. Desbloquear subdimensiones anticipadamente puede ser decisivo.',
      no_email_opens:
        'La vergüenza puede estar bloqueando. Los emails le recuerdan que "tiene un problema". Reducir la frecuencia o cambiar el frame a "actualización de datos".',
      long_time_no_action:
        'Está procesando internamente. No confundir silencio con desinterés — puede estar muy activo mentalmente pero paralizado por la vergüenza de dar el siguiente paso.',
      visited_but_not_paid:
        'Quiere más CERTEZA antes de actuar. No le faltan ganas — le falta la sensación de que tiene SUFICIENTES datos para justificar la decisión.',
      opened_session_email:
        'Señal potente para este perfil. Ha superado la barrera de la vergüenza lo suficiente como para considerar hablar con alguien. No perder este momento.',
      booked_session:
        'Momento crítico. Javi NUNCA debe hacer preguntas emocionales directas. Mantener todo en el terreno de la biología y los datos.',
      unsubscribed:
        'La exposición le resulta insoportable. Respetar absolutamente. El mapa sigue disponible si vuelve.',
    },

    suggested_actions: ['early_unlock', 'manual_email', 'express_session'],
    never_actions: [
      'Videos con tono cálido/emocional',
      'Notas que hablen de sentimientos',
      '"¿Cómo te sientes?"',
      'Cualquier cosa que parezca terapia',
    ],

    note_templates: {
      reengagement:
        '[Nombre], hay datos nuevos disponibles en tu mapa. La dimensión [worstDim] tiene subdimensiones que aportan más resolución al diagnóstico. Los he desbloqueado anticipadamente.\n\n— Dr. Javier A. Martín Ramos',
      encouragement:
        '[Nombre], tu perfil biológico tiene una particularidad: el patrón de regulación que muestras tus datos responde especialmente bien a intervención precisa. El detalle está en tu mapa.',
      post_session:
        '[Nombre], los datos que revisamos confirman el patrón. El protocolo es específico para tu perfil biológico. Aplícalo 7 días y compara métricas.',
    },

    video_script_hint:
      'MUY BREVE. Máximo 45 segundos. Solo datos y biología. "Tu perfil biológico muestra un patrón de [X]..." Nunca preguntar cómo se siente. Nunca decir "entiendo lo que estás pasando". Tratar como un informe clínico verbal.',
    email_tone:
      'Clínico, técnico, breve. Cero adornos emocionales. Como un resultado de laboratorio con una nota del médico.',
  },

  {
    key: 'cuidador-exhausto',
    label: 'Cuidador Exhausto',
    shortLabel: 'CE',
    color: '#3D9A5F', // success green — cuidado, vida
    icon: '💚',

    core_fear: 'Que cuidarse a sí mismo signifique abandonar a los demás',
    core_desire: 'Permiso para priorizar su propia recuperación sin culpa',
    decision_blocker: 'La culpa de invertir tiempo/dinero en sí mismo',

    behaviors: {
      multiple_map_visits:
        'Vuelve al mapa como quien abre un libro y lo cierra: quiere, pero siente que "no debería". Necesita que alguien le diga que cuidarse NO es egoísmo.',
      no_email_opens:
        'La culpa actúa como filtro. Cada email es un recordatorio de que está dedicando energía a sí mismo en vez de a otros. Cambiar el frame: "Si tú caes, ellos caen."',
      long_time_no_action:
        'No es falta de interés — es que siempre hay "algo más urgente" que él mismo. Una nota que normalice el autocuidado como RESPONSABILIDAD (no capricho) puede reactivar.',
      visited_but_not_paid:
        'Sabe que lo necesita. Lo frena la culpa de gastar 97€ en sí mismo. El frame correcto: "Es una inversión en tu capacidad de seguir cuidando a los demás."',
      opened_session_email:
        'Está buscando permiso externo para actuar. Si un profesional le dice "necesitas esto", la culpa se reduce. Es la validación que necesita.',
      booked_session:
        'Ha superado la barrera de la culpa. Javi debe CELEBRAR esto sutilmente: "Has dado un paso importante. No para ti — para todos los que dependen de ti."',
      unsubscribed:
        'La culpa venció. Algo le hizo sentir que "está siendo egoísta". Dejarlo ir con gentileza.',
    },

    suggested_actions: ['personal_note', 'video', 'early_unlock'],
    never_actions: [
      'Presión',
      'Urgencia',
      '"No pierdas esta oportunidad"',
      'Cualquier cosa que suene a venta',
      'Culpa adicional',
    ],

    note_templates: {
      reengagement:
        '[Nombre], sé que tu tiempo nunca es tuyo del todo. Pero lo que muestra tu mapa es que si tú no te ocupas de esto, en algún momento no vas a poder ocuparte de nadie. No es egoísmo — es responsabilidad.\n\n— Dr. Javier A. Martín Ramos',
      encouragement:
        '[Nombre], tu mapa está evolucionando. Hay información nueva que puede ayudarte a entender por qué te cuesta tanto parar. No es debilidad — tu sistema nervioso está protegiendo a los demás a costa tuya.',
      post_session:
        '[Nombre], lo que vimos en nuestra sesión me confirma lo que intuía: llevas demasiado tiempo poniendo a todos por delante. El protocolo que te di no te pide tiempo — te lo devuelve.',
    },

    video_script_hint:
      'Tono cálido pero FIRME. No pedir disculpas. "Lo que veo en tu diagnóstico es el patrón de alguien que lleva demasiado tiempo cuidando de todos menos de sí mismo." Usar la frase clave: "Si tú caes, todos los que dependen de ti caen." Es la frase que rompe el bloqueo.',
    email_tone:
      'Cálido, comprensivo, pero con firmeza clínica. Como un médico que te quiere pero no te deja salir del hospital.',
  },

  {
    key: 'controlador-paralizado',
    label: 'Controlador Paralizado',
    shortLabel: 'CP',
    color: '#D4A017', // warning amber — análisis, precaución
    icon: '🔍',

    core_fear: 'Tomar una decisión equivocada sin tener toda la información',
    core_desire: 'Certeza absoluta de que el plan va a funcionar antes de comprometerse',
    decision_blocker: 'Parálisis de análisis — siempre necesita más datos antes de actuar',

    behaviors: {
      multiple_map_visits:
        'Está analizando cada dato exhaustivamente. Para este perfil, más visitas = más análisis, no necesariamente más convicción. Lo que necesita no es más datos sino ESTRUCTURA y GARANTÍAS.',
      no_email_opens:
        'Puede ser que haya catalogado los emails como "marketing" y los ignore. Cambiar approach: subject lines con estructura ("Paso 1 de 3", "Tu plan de acción").',
      long_time_no_action:
        'Clásico de este perfil. Tiene toda la información pero no puede dar el paso. Lo que lo desbloquea es una SESIÓN con estructura: "10 minutos, resolvemos tus 2 dudas principales."',
      visited_but_not_paid:
        'Está buscando la garantía que elimine todo riesgo. Reforzar: "7 días de garantía completa", "protocolo probado en X casos", "si no funciona, te devolvemos todo."',
      opened_session_email:
        'MUY buena señal. Quiere preguntar antes de decidir. Facilitarle el camino: "Sin compromiso, sin presión, solo información."',
      booked_session:
        'Vendrá con una lista de preguntas. Javi debe ser MUY estructurado: "Vamos a ver 3 cosas: tu diagnóstico, tu protocolo, y tu plan." Nada abierto.',
      unsubscribed:
        'Probablemente decidió que "no tiene suficiente evidencia". Respetarlo.',
    },

    suggested_actions: ['express_session', 'manual_email', 'early_unlock'],
    never_actions: [
      'Ambigüedad',
      '"Confía en el proceso"',
      '"Déjate llevar"',
      'Presión temporal',
      'Mensajes abiertos sin estructura',
    ],

    note_templates: {
      reengagement:
        '[Nombre], tu diagnóstico muestra datos específicos. He preparado un resumen con 3 puntos concretos sobre tu situación y los pasos exactos del protocolo. Está en tu mapa.\n\n— Dr. Javier A. Martín Ramos',
      encouragement:
        '[Nombre], si tienes preguntas sobre tu diagnóstico, puedo resolverlas en 10 minutos. Sin compromiso. Solo datos y un plan claro.',
      post_session:
        '[Nombre], resumo lo que vimos: 1) Tu diagnóstico confirma [X]. 2) El protocolo tiene 3 fases de [Y] días. 3) Resultados esperados en [Z] horas. Si algo no cuadra, me escribes.',
    },

    video_script_hint:
      'MUY ESTRUCTURADO. "Voy a explicarte 3 cosas sobre tu diagnóstico. Primero... Segundo... Tercero..." Nunca decir "depende" o "ya veremos". Ser específico con números, plazos y garantías. Terminar con: "Si tienes preguntas, las resolvemos en una sesión de 10 minutos."',
    email_tone:
      'Estructurado, con números y plazos. Como un plan de proyecto con milestones claros. Cada email debe tener un formato de lista o pasos numerados.',
  },
]

// ─── LOOKUP ──────────────────────────────────────────────────────────────────

const PROFILE_BY_EGO: Record<string, ProfileIntelligence> = {}
for (const p of PROFILES) {
  PROFILE_BY_EGO[p.label] = p
}

/** Busca perfil por ego_primary (ej. "Productivo Colapsado") */
export function getProfileIntelligence(egoPrimary?: string): ProfileIntelligence | null {
  if (!egoPrimary) return null
  return PROFILE_BY_EGO[egoPrimary] ?? null
}

/** Devuelve todos los perfiles */
export function getAllProfiles(): ProfileIntelligence[] {
  return PROFILES
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getDaysSince(dateStr: string): number {
  const created = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
}

/** Comprueba si el lead abrió el último email que se le envió */
export function lastEmailOpened(lead: LeadData): boolean {
  const opens = lead.map_evolution?.email_opens
  if (!opens || Object.keys(opens).length === 0) return false

  // Determinar qué emails se han enviado (por flags en map_evolution)
  const me = lead.map_evolution
  const sentKeys: string[] = ['d0'] // d0 siempre se envía
  if (me?.email_d3_sent) sentKeys.push('d3')
  if (me?.email_d7_sent) sentKeys.push('d7')
  if (me?.email_d10_sent) sentKeys.push('d10')
  if (me?.email_d14_sent) sentKeys.push('d14')
  if (me?.email_d21_sent) sentKeys.push('d21')
  if (me?.email_d30_sent) sentKeys.push('d30')

  // El último email enviado
  const lastSent = sentKeys[sentKeys.length - 1]
  return !!opens[lastSent]
}

// ─── HEAT SCORE ──────────────────────────────────────────────────────────────

export function calculateHeatScore(lead: LeadData): HeatScore {
  // Converted = paid
  if (lead.funnel?.converted_week1) return { score: 0, level: 'converted' }

  // Lost = unsubscribed
  if (lead.funnel?.unsubscribed || lead.map_evolution?.email_unsubscribed) {
    return { score: 0, level: 'lost' }
  }

  // Paused = goodbye sent (3+ emails sin abrir)
  if (lead.map_evolution?.email_goodbye_sent) return { score: 0, level: 'paused' }

  let score = 0
  const daysSince = getDaysSince(lead.created_at)

  // Score bajo = más urgente (la persona necesita más ayuda)
  const globalScore = lead.scores?.global
  if (typeof globalScore === 'number') {
    if (globalScore <= 39) score += 2
    else if (globalScore <= 59) score += 1
  }

  // Visitas al mapa = interés activo
  const mapVisits = lead.funnel?.map_visits ?? 0
  if (mapVisits >= 3) score += 2
  else if (mapVisits >= 1) score += 1

  // Abrió último email = engagement
  if (lastEmailOpened(lead)) score += 1

  // Ventana caliente (14 días) = momentum
  if (daysSince <= 14) score += 1
  if (daysSince <= 7) score += 1

  // Agendó sesión = ya tomó acción
  if (lead.funnel?.session_booked) score -= 1

  // Clasificar
  if (score >= 5) return { score, level: 'hot' }
  if (score >= 3) return { score, level: 'warm' }
  return { score, level: 'cold' }
}

// ─── SUGGESTED ACTION ────────────────────────────────────────────────────────

export function getSuggestedAction(lead: LeadData): SuggestedAction | null {
  const profile = getProfileIntelligence(lead.profile?.ego_primary)
  if (!profile) return null

  const heat = calculateHeatScore(lead)
  const mapVisits = lead.funnel?.map_visits ?? 0
  const daysSince = getDaysSince(lead.created_at)

  // No sugerir acciones para converted, lost o paused
  if (heat.level === 'converted' || heat.level === 'lost' || heat.level === 'paused') {
    return null
  }

  // Múltiples visitas al mapa sin pagar → acción prioritaria del perfil
  if (mapVisits >= 3 && !lead.funnel?.converted_week1) {
    return {
      type: profile.suggested_actions[0],
      reason: profile.behaviors.visited_but_not_paid,
      template: profile.note_templates.reengagement,
      urgency: 'high',
    }
  }

  // 10+ días sin abrir emails → reengagement
  if (daysSince >= 10 && !lastEmailOpened(lead)) {
    return {
      type: 'personal_note',
      reason: profile.behaviors.no_email_opens,
      template: profile.note_templates.reengagement,
      urgency: 'medium',
    }
  }

  // Abrió email de sesión → aprovechar el momento
  const emailOpens = lead.map_evolution?.email_opens
  if (emailOpens?.['d10'] && !lead.funnel?.session_booked) {
    return {
      type: 'express_session',
      reason: profile.behaviors.opened_session_email,
      urgency: 'high',
    }
  }

  // Largo tiempo sin acción (14+ días, con al menos una visita)
  if (daysSince >= 14 && mapVisits >= 1 && !lead.funnel?.session_booked) {
    return {
      type: profile.suggested_actions[0],
      reason: profile.behaviors.long_time_no_action,
      template: profile.note_templates.reengagement,
      urgency: 'medium',
    }
  }

  // Lead caliente sin acción específica → acción genérica del perfil
  if (heat.level === 'hot') {
    return {
      type: profile.suggested_actions[0],
      reason: profile.behaviors.multiple_map_visits,
      template: profile.note_templates.encouragement,
      urgency: 'medium',
    }
  }

  return null
}
