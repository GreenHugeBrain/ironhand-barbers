import { useEffect, useState } from 'react'

import { SHOP } from '../data.js'
import { NAV } from './Nav.js'
import { href, isCurrent } from '../lib/paths.js'

/** Wraps every page so the header, footer and skip link exist in one place. */
export function Page({ children, transparentHeader = false }) {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header transparent={transparentHeader} />
      {/* Only the hero page sits under the fixed header; the rest clear it. */}
      <main id="main" className={transparentHeader ? undefined : 'below-header'}>
        {children}
      </main>
      <Footer />
    </>
  )
}

function Header({ transparent }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!transparent) return undefined
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparent])

  const solid = !transparent || scrolled

  return (
    <header className={solid ? 'site-header is-solid' : 'site-header'}>
      <div className="shell header-inner">
        <a className="wordmark" href={href('')}>Iron<span>hand</span></a>

        <nav className={open ? 'nav is-open' : 'nav'} aria-label="Main">
          {NAV.map((item) => (
            <a
              key={item.path}
              href={href(item.path)}
              aria-current={isCurrent(item.path) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="btn btn-solid" href={href('book')}>Book a chair</a>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <a className="wordmark" href={href('')}>Iron<span>hand</span></a>
          <p>{SHOP.street}, {SHOP.city}</p>
          <p>
            <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`}>{SHOP.phone}</a>
            {' · '}
            <a href={`https://instagram.com/${SHOP.instagram}`} target="_blank" rel="noreferrer">
              @{SHOP.instagram}
            </a>
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {NAV.map((item) => (
            <a key={item.path} href={href(item.path)}>{item.label}</a>
          ))}
        </nav>
      </div>

      <div className="shell">
        <p className="fine">
          A concept site, built as a demonstration. Ironhand is not a real business.
        </p>
      </div>
    </footer>
  )
}

export function PageHead({ eyebrow, title, note }) {
  return (
    <section className="page-head">
      <div className="shell">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        {note && <p className="page-note">{note}</p>}
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, note }) {
  return (
    <div className="section-head">
      <p className="kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {note && <p className="section-note">{note}</p>}
    </div>
  )
}
