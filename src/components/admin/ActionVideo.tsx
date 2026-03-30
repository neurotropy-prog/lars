'use client'

import { useState, useRef } from 'react'
import type { LeadDetail } from './LeadDetailPanel'

interface Props {
  lead: LeadDetail
  onSubmit: (videoUrl: string, notifyLead: boolean) => void
  onCancel: () => void
  submitting: boolean
}

const MAX_SIZE = 50 * 1024 * 1024
const ACCEPTED = '.mp4,.mov,.webm'

export default function ActionVideo({ lead, onSubmit, onCancel, submitting }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notifyLead, setNotifyLead] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const profile = lead.profile_intelligence
  const busy = uploading || submitting

  function handleFile(f: File) {
    setError(null)
    if (f.size > MAX_SIZE) {
      setError('El video supera los 50MB.')
      return
    }
    setFile(f)
  }

  async function handleUploadAndSubmit() {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('hash', lead.hash)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(data.error ?? 'Error subiendo video')
      }

      const { url } = await res.json()
      onSubmit(url, notifyLead)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error subiendo video')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: '0 0 4px',
        }}>
          🎬 Video para {lead.email ?? 'este lead'}
        </p>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          margin: 0,
        }}>
          Aparecerá en su mapa vivo
        </p>
      </div>

      {/* Script hint */}
      {profile && (
        <div style={{
          background: 'var(--color-bg-tertiary)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          borderLeft: `3px solid ${profile.color}`,
        }}>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            margin: '0 0 4px',
          }}>
            💡 Guía para {profile.shortLabel}:
          </p>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {profile.video_script_hint}
          </p>
        </div>
      )}

      {/* Upload zone */}
      <div
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        style={{
          border: '2px dashed var(--color-text-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-8) var(--space-6)',
          textAlign: 'center',
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.5 : 1,
          transition: 'opacity 200ms',
        }}
      >
        {file ? (
          <div>
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              margin: '0 0 4px',
            }}>
              📹 {file.name}
            </p>
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '12px',
              color: 'var(--color-text-tertiary)',
              margin: 0,
            }}>
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <div>
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              margin: '0 0 4px',
            }}>
              📤 Arrastra o haz clic para subir video
            </p>
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '12px',
              color: 'var(--color-text-tertiary)',
              margin: 0,
            }}>
              MP4, MOV, WebM · max 50MB
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
          style={{ display: 'none' }}
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          color: 'var(--color-error)',
          margin: 0,
        }}>
          {error}
        </p>
      )}

      {/* Uploading indicator */}
      {uploading && (
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          color: 'var(--color-accent)',
          margin: 0,
        }}>
          Subiendo video...
        </p>
      )}

      {/* Notify checkbox */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          checked={notifyLead}
          onChange={(e) => setNotifyLead(e.target.checked)}
          style={{ accentColor: 'var(--color-accent)' }}
        />
        Notificar al lead por email
      </label>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          disabled={busy}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'var(--border-subtle)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            cursor: busy ? 'not-allowed' : 'pointer',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleUploadAndSubmit}
          disabled={!file || busy}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: file && !busy ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
            color: file && !busy ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: file && !busy ? 'pointer' : 'not-allowed',
          }}
        >
          {uploading ? 'Subiendo...' : submitting ? 'Guardando...' : 'Subir video'}
        </button>
      </div>
    </div>
  )
}
