'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for error from redirect
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'unauthorized') {
      setError('Tu cuenta no tiene acceso al admin. Contacta con el administrador.')
    }
  }, [searchParams])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      })

      if (authError) {
        setError('Error al iniciar sesión con Google. Por favor intenta de nuevo.')
        console.error('OAuth error:', authError)
      }
    } catch (err) {
      setError('Error inesperado. Por favor intenta de nuevo.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B0F0E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Logo/Title */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#F0F1F1',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
              fontFamily: 'Cormorant Garamond, serif',
            }}
          >
            ADMIN
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#9CA3A2',
              marginTop: '12px',
            }}
          >
            Acceso restringido a administradores autorizados.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#4C2626',
              border: '1px solid #EF4444',
              color: '#F0F1F1',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '24px',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#1A1F1E',
            border: '1px solid #2D3433',
            color: '#F0F1F1',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#2D3433'
              e.currentTarget.style.borderColor = '#4ADE80'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1A1F1E'
            e.currentTarget.style.borderColor = '#2D3433'
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v5l3 3" />
          </svg>
          {loading ? 'Abriendo Google...' : 'Entrar con Google'}
        </button>

        {/* Loading indicator */}
        {loading && (
          <div
            style={{
              marginTop: '16px',
              fontSize: '13px',
              color: '#9CA3A2',
            }}
          >
            Redirigiendo...
          </div>
        )}
      </div>
    </div>
  )
}
