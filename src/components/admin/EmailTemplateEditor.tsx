'use client'

/**
 * EmailTemplateEditor — Modal para editar plantillas de email.
 *
 * Permite editar: asunto, contenido (texto plano) y texto del botón.
 * Incluye vista previa en iframe y opción de restaurar al original.
 */

import { useState, useEffect, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TemplateData {
  email_key: string
  subject: string
  body_content: string
  cta_text: string
  is_customized: boolean
  is_dynamic: boolean
  dynamic_note: string | null
}

interface Props {
  emailKey: string
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

// ── Email display names ───────────────────────────────────────────────────────

const EMAIL_NAMES: Record<string, string> = {
  d0: 'Día 0 — Tu Mapa de Regulación',
  d3: 'Día 3 — Arquetipo SN',
  d7: 'Día 7 — Insight colectivo',
  d10: 'Día 10 — Sesión con Javier',
  d14: 'Día 14 — Subdimensiones',
  d21: 'Día 21 — Extracto libro',
  d30: 'Día 30 — Reevaluación',
  d90: 'Día 90+ — Reevaluación trimestral',
  goodbye: 'Despedida empática',
  post_pago: 'Post-pago — Semana 1',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EmailTemplateEditor({ emailKey, isOpen, onClose, onSave }: Props) {
  const [template, setTemplate] = useState<TemplateData | null>(null)
  const [subject, setSubject] = useState('')
  const [bodyContent, setBodyContent] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [confirmRevert, setConfirmRevert] = useState(false)

  // Fetch template data
  const fetchTemplate = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/templates')
      if (!res.ok) return
      const data = await res.json()
      const t = data.templates?.find((t: TemplateData) => t.email_key === emailKey)
      if (t) {
        setTemplate(t)
        setSubject(t.subject)
        setBodyContent(t.body_content)
        setCtaText(t.cta_text)
      }
    } finally {
      setLoading(false)
    }
  }, [emailKey])

  useEffect(() => {
    if (isOpen) {
      fetchTemplate()
      setShowPreview(false)
      setConfirmRevert(false)
    }
  }, [isOpen, fetchTemplate])

  // Load preview
  const loadPreview = async () => {
    setPreviewLoading(true)
    setShowPreview(true)
    try {
      const params = new URLSearchParams()
      params.set('subject', subject)
      params.set('body', bodyContent)
      params.set('cta', ctaText)

      const res = await fetch(`/api/admin/templates/${emailKey}/preview?${params.toString()}`)
      if (res.ok) {
        const html = await res.text()
        setPreviewHtml(html)
      }
    } finally {
      setPreviewLoading(false)
    }
  }

  // Save
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/templates/${emailKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body_content: bodyContent,
          cta_text: ctaText,
        }),
      })
      if (res.ok) {
        onSave()
        onClose()
      }
    } finally {
      setSaving(false)
    }
  }

  // Revert
  const handleRevert = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/templates/${emailKey}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        onSave()
        onClose()
      }
    } finally {
      setSaving(false)
      setConfirmRevert(false)
    }
  }

  if (!isOpen) return null

  const isDynamic = template?.is_dynamic ?? false
  const bodyDisabled = emailKey === 'd0'

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'var(--color-bg-primary)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          zIndex: 1001,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-lora)',
                fontSize: 'var(--text-h3)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: '0 0 4px 0',
              }}
            >
              {EMAIL_NAMES[emailKey] ?? emailKey}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
                margin: 0,
              }}
            >
              Editando plantilla de email
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
            }}
          >
            x
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--color-text-tertiary)' }}>
              Cargando...
            </p>
          </div>
        ) : (
          <>
            {/* Dynamic note */}
            {isDynamic && template?.dynamic_note && (
              <div
                style={{
                  background: 'rgba(212, 160, 23, 0.06)',
                  border: '1px solid rgba(212, 160, 23, 0.15)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '13px',
                    color: 'var(--color-warning)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {template.dynamic_note}
                </p>
              </div>
            )}

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Subject */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Asunto del email
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-bg-secondary)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-4)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Body content */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Contenido del email
                </label>
                <textarea
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  disabled={bodyDisabled}
                  rows={6}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: bodyDisabled ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                    background: bodyDisabled ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-4)',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    boxSizing: 'border-box',
                  }}
                />
                {!bodyDisabled && (
                  <p
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '12px',
                      color: 'var(--color-text-tertiary)',
                      margin: '4px 0 0 0',
                    }}
                  >
                    Texto plano. Usa doble salto de linea para crear parrafos separados.
                  </p>
                )}
              </div>

              {/* CTA text */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Texto del boton
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-bg-secondary)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-4)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginTop: 'var(--space-6)' }}>
              <button
                onClick={loadPreview}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {showPreview ? 'Actualizar vista previa' : 'Ver vista previa'}
                <span style={{ fontSize: '12px' }}>{showPreview ? '↻' : '▸'}</span>
              </button>

              {showPreview && (
                <div
                  style={{
                    marginTop: 'var(--space-3)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: '#ffffff',
                  }}
                >
                  {previewLoading ? (
                    <div
                      style={{
                        padding: 'var(--space-8)',
                        textAlign: 'center',
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                        Generando preview...
                      </p>
                    </div>
                  ) : (
                    <iframe
                      srcDoc={previewHtml}
                      title="Email preview"
                      style={{
                        width: '100%',
                        height: '500px',
                        border: 'none',
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-5)',
                borderTop: 'var(--border-subtle)',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
              }}
            >
              {/* Left: Revert */}
              <div>
                {template?.is_customized && !confirmRevert && (
                  <button
                    onClick={() => setConfirmRevert(true)}
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-text-tertiary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Restaurar original
                  </button>
                )}
                {confirmRevert && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '13px',
                        color: 'var(--color-error)',
                      }}
                    >
                      Seguro?
                    </span>
                    <button
                      onClick={handleRevert}
                      disabled={saving}
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#fff',
                        background: 'var(--color-error)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        opacity: saving ? 0.5 : 1,
                      }}
                    >
                      Si, restaurar
                    </button>
                    <button
                      onClick={() => setConfirmRevert(false)}
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '13px',
                        color: 'var(--color-text-tertiary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      No
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Cancel + Save */}
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg-tertiary)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-5)',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 600,
                    color: '#1E1310',
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-5)',
                    cursor: 'pointer',
                    opacity: saving ? 0.5 : 1,
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
