'use client'

/**
 * SiteHeader — Header sticky con logo centrado para todas las páginas.
 *
 * Variantes:
 *   - default: opaco siempre (mapa, pago, showcase)
 *   - landing: transparente → opaco al scroll (>100px) o gateway activo
 *   - admin: opaco con posible link admin
 */

import { useState, useEffect } from 'react'

interface SiteHeaderProps {
  variant?: 'default' | 'landing' | 'admin'
}

export default function SiteHeader({ variant = 'default' }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [gatewayActive, setGatewayActive] = useState(false)

  useEffect(() => {
    if (variant !== 'landing') return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    // Check for gateway overlay in DOM (GatewayBloque components use .gateway-overlay)
    const observer = new MutationObserver(() => {
      const overlay = document.querySelector('.gateway-overlay')
      setGatewayActive(!!overlay)
    })

    observer.observe(document.body, { childList: true, subtree: true })
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [variant])

  const isOpaque = variant !== 'landing' || isScrolled || gatewayActive

  return (
    <header
      className={`site-header ${isOpaque ? 'site-header--opaque' : ''}`}
      data-variant={variant}
    >
      <div className="site-header__container">
        <a href="/" className="site-header__logo-link" aria-label="Instituto Epigenético — Ir al inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo-definitivo-IE.png"
            alt=""
            className="site-header__logo"
            width={156}
            height={28}
            loading="eager"
          />
        </a>
      </div>
    </header>
  )
}
