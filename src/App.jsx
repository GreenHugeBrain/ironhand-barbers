import { useEffect, useMemo, useRef, useState } from 'react'
import './styles.css'

import { SHOP, HOURS, SERVICES, BARBERS, GALLERY, FAQ } from './data.js'
import { upcomingDays, slotsFor, longDate } from './booking.js'

import hero from './assets/hero.jpg'
import tools from './assets/tools.jpg'

const NAV = [
  ['Services', 'services'],
  ['Barbers', 'barbers'],
  ['Gallery', 'gallery'],
  ['Visit', 'visit'],
]

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Barbers />
        <Booking />
        <Gallery />
        <Faq />
        <Visit />
      </main>
      <Footer />
    </>
  )
}

/* ---------------------------------------------------------------- header */

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
      <div className="shell header-inner">
        <a className="wordmark" href="#top">
          Iron<span>hand</span>
        </a>

        <nav className={open ? 'nav is-open' : 'nav'}>
          {NAV.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="btn btn-solid" href="#book">Book a chair</a>
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

/* ------------------------------------------------------------------ hero */

function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero-img" src={hero} alt="" />
      <div className="hero-veil" />
      <div className="shell hero-inner">
        <p className="kicker">Barbershop · Tbilisi · since 2019</p>
        <h1>
          Sit down.<br />
          Stand up sharper.
        </h1>
        <p className="hero-lede">
          Three chairs on Aghmashenebeli. Cuts, beards and hot-towel shaves,
          booked in four taps and never rushed.
        </p>
        <div className="hero-cta">
          <a className="btn btn-solid btn-lg" href="#book">Book a chair</a>
          <a className="btn btn-ghost btn-lg" href="#services">See prices</a>
        </div>
        <dl className="hero-facts">
          <div><dt>Open</dt><dd>7 days</dd></div>
          <div><dt>From</dt><dd>30&#8382;</dd></div>
          <div><dt>Walk-ins</dt><dd>Welcome</dd></div>
        </dl>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- services */

function Services() {
  return (
    <section className="section" id="services">
      <div className="shell">
        <SectionHead
          eyebrow="Services"
          title="What it costs, before you sit down"
          note="Prices are per visit, not per hour. Nothing gets added at the till."
        />
        <ul className="price-list">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <div className="price-row">
                <h3>{s.name}</h3>
                <span className="dots" aria-hidden="true" />
                <span className="price">{s.price}&#8382;</span>
              </div>
              <p>{s.blurb}</p>
              <span className="mins">{s.minutes} min</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- barbers */

function Barbers() {
  return (
    <section className="section section-dark" id="barbers">
      <div className="shell">
        <SectionHead
          eyebrow="The chairs"
          title="Three barbers, three hands"
          note="Book the one you know, or leave it to us and take the first free chair."
        />
        <div className="barber-grid">
          {BARBERS.map((b) => (
            <article className="barber-card" key={b.id}>
              <span className="barber-initial" aria-hidden="true">{b.initial}</span>
              <div className="barber-body">
                <h3>{b.name}</h3>
                <p className="role">{b.role}</p>
                <p>{b.blurb}</p>
                <ul className="chips">
                  {b.does.map((id) => (
                    <li key={id}>{SERVICES.find((s) => s.id === id)?.name}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- booking */

const STEPS = ['Barber', 'Service', 'Time', 'Details']

function Booking() {
  const [step, setStep] = useState(0)
  const [barber, setBarber] = useState(null)      // null === no preference
  const [service, setService] = useState(null)
  const [day, setDay] = useState(null)
  const [time, setTime] = useState(null)
  const [details, setDetails] = useState({ name: '', phone: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  const days = useMemo(() => upcomingDays(14), [])

  const offered = useMemo(() => {
    if (!barber) return SERVICES
    return SERVICES.filter((s) => barber.does.includes(s.id))
  }, [barber])

  const slots = useMemo(() => {
    if (!day || !service) return []
    return slotsFor(day.iso, barber?.id ?? 'any', service.minutes)
  }, [day, service, barber])

  function goto(next) {
    setStep(next)
    setErrors({})
  }

  function chooseBarber(b) {
    setBarber(b)
    // A service the new barber does not offer must not survive the change.
    if (b && service && !b.does.includes(service.id)) {
      setService(null)
      setTime(null)
    }
    goto(1)
  }

  function chooseService(s) {
    setService(s)
    setTime(null)
    goto(2)
  }

  function chooseTime(slot) {
    setTime(slot.time)
    goto(3)
  }

  function submit(event) {
    event.preventDefault()
    const next = {}
    if (details.name.trim().length < 2) next.name = 'Tell us who the chair is for.'
    if (!/^[+\d][\d\s()-]{7,}$/.test(details.phone.trim())) {
      next.phone = 'A number we can reach you on.'
    }
    setErrors(next)
    if (Object.keys(next).length) return
    setDone({ barber, service, day, time, ...details })
  }

  function reset() {
    setBarber(null); setService(null); setDay(null); setTime(null)
    setDetails({ name: '', phone: '', notes: '' })
    setErrors({}); setDone(null); setStep(0)
  }

  if (done) return <Confirmation booking={done} onReset={reset} />

  return (
    <section className="section" id="book">
      <div className="shell">
        <SectionHead
          eyebrow="Booking"
          title="Four taps and the chair is yours"
          note="Nothing is charged now. We hold the slot and see you on the day."
        />

        <ol className="steps">
          {STEPS.map((label, i) => {
            const state = i === step ? 'is-current' : i < step ? 'is-done' : ''
            return (
              <li key={label} className={state}>
                <button
                  type="button"
                  onClick={() => i < step && goto(i)}
                  disabled={i >= step}
                >
                  <span className="step-n">{i + 1}</span>
                  {label}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="booking-panel">
          {step === 0 && (
            <div className="choice-grid">
              {BARBERS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={barber?.id === b.id ? 'choice is-picked' : 'choice'}
                  onClick={() => chooseBarber(b)}
                >
                  <span className="any-mark" aria-hidden="true">{b.initial}</span>
                  <span className="choice-name">{b.name}</span>
                  <span className="choice-sub">{b.role}</span>
                </button>
              ))}
              <button
                type="button"
                className={barber === null && step > 0 ? 'choice is-picked' : 'choice choice-any'}
                onClick={() => chooseBarber(null)}
              >
                <span className="any-mark" aria-hidden="true">?</span>
                <span className="choice-name">No preference</span>
                <span className="choice-sub">First free chair</span>
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="choice-list">
              {offered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={service?.id === s.id ? 'row-choice is-picked' : 'row-choice'}
                  onClick={() => chooseService(s)}
                >
                  <span className="row-main">
                    <strong>{s.name}</strong>
                    <em>{s.blurb}</em>
                  </span>
                  <span className="row-meta">
                    <b>{s.price}&#8382;</b>
                    <i>{s.minutes} min</i>
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="when">
              <div className="day-strip" role="group" aria-label="Choose a day">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    className={day?.iso === d.iso ? 'day is-picked' : 'day'}
                    onClick={() => { setDay(d); setTime(null) }}
                  >
                    <span className="dow">{d.isToday ? 'Today' : d.weekday}</span>
                    <span className="dom">{d.day}</span>
                    <span className="mon">{d.month}</span>
                  </button>
                ))}
              </div>

              {!day && <p className="hint">Pick a day to see what is free.</p>}

              {day && (
                slots.length ? (
                  <div className="slot-grid">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        className={`slot${s.taken ? ' is-taken' : ''}`}
                        disabled={s.taken}
                        onClick={() => chooseTime(s)}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="hint">
                    Nothing left on {longDate(day.iso)} that fits a{' '}
                    {service?.minutes}-minute {service?.name.toLowerCase()}. Try the
                    next day.
                  </p>
                )
              )}
            </div>
          )}

          {step === 3 && (
            <form className="details" onSubmit={submit} noValidate>
              <Field
                label="Name"
                value={details.name}
                error={errors.name}
                onChange={(v) => setDetails({ ...details, name: v })}
                autoComplete="name"
              />
              <Field
                label="Phone"
                value={details.phone}
                error={errors.phone}
                onChange={(v) => setDetails({ ...details, phone: v })}
                type="tel"
                autoComplete="tel"
                placeholder="+995 …"
              />
              <label className="field field-wide">
                <span className="field-label">Anything we should know <i>(optional)</i></span>
                <textarea
                  rows={3}
                  value={details.notes}
                  onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  placeholder="Grade on the sides, first time here, running from work…"
                />
              </label>
              <button className="btn btn-solid btn-lg" type="submit">
                Confirm booking
              </button>
            </form>
          )}
        </div>

        <Summary barber={barber} service={service} day={day} time={time} step={step} />
      </div>
    </section>
  )
}

function Field({ label, value, onChange, error, ...rest }) {
  return (
    <label className={error ? 'field has-error' : 'field'}>
      <span className="field-label">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

function Summary({ barber, service, day, time, step }) {
  if (step === 0) return null
  return (
    <p className="summary">
      <span>{barber ? barber.name : 'First free chair'}</span>
      {service && <span>{service.name} · {service.price}&#8382;</span>}
      {day && <span>{longDate(day.iso)}</span>}
      {time && <span>{time}</span>}
    </p>
  )
}

function Confirmation({ booking, onReset }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  return (
    <section className="section" id="book">
      <div className="shell">
        <div className="confirmed" tabIndex={-1} ref={ref}>
          <p className="kicker">Booked</p>
          <h2>See you {booking.day.isToday ? 'today' : `on ${longDate(booking.day.iso)}`}.</h2>
          <dl className="confirm-list">
            <div><dt>Who</dt><dd>{booking.name}</dd></div>
            <div><dt>Barber</dt><dd>{booking.barber ? booking.barber.name : 'First free chair'}</dd></div>
            <div><dt>Service</dt><dd>{booking.service.name} · {booking.service.price}&#8382;</dd></div>
            <div><dt>When</dt><dd>{longDate(booking.day.iso)} at {booking.time}</dd></div>
            <div><dt>Phone</dt><dd>{booking.phone}</dd></div>
            {booking.notes && <div><dt>Notes</dt><dd>{booking.notes}</dd></div>}
          </dl>
          <p className="confirm-note">
            This is a demonstration booking — nothing was sent and no chair was
            actually held. On a live site this would reach the shop by SMS and land
            in the diary.
          </p>
          <button className="btn btn-ghost" type="button" onClick={onReset}>
            Make another booking
          </button>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- gallery */

function Gallery() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active === null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % GALLERY.length)
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + GALLERY.length) % GALLERY.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <section className="section section-dark" id="gallery">
      <div className="shell">
        <SectionHead eyebrow="Gallery" title="The work, not the poster" />
        <div className="gallery">
          {GALLERY.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className="shot"
              onClick={() => setActive(i)}
              aria-label={`Open image ${i + 1}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <img src={GALLERY[active].src} alt={GALLERY[active].alt} />
          <p>{GALLERY[active].alt}</p>
          <button className="lightbox-close" type="button" aria-label="Close">&times;</button>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------- faq */

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section">
      <div className="shell narrow">
        <SectionHead eyebrow="Questions" title="Before you come in" />
        <div className="faq">
          {FAQ.map((item, i) => (
            <div key={item.q} className={open === i ? 'qa is-open' : 'qa'}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {item.q}
                <span aria-hidden="true">{open === i ? '–' : '+'}</span>
              </button>
              <div className="qa-body"><p>{item.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- visit */

function Visit() {
  return (
    <section className="section section-split" id="visit">
      <div className="shell visit">
        <div>
          <SectionHead eyebrow="Visit" title="Aghmashenebeli, by the bridge" />
          <address>
            {SHOP.street}<br />
            {SHOP.city}
          </address>
          <table className="hours">
            <tbody>
              {HOURS.map((h) => (
                <tr key={h.days}>
                  <th scope="row">{h.days}</th>
                  <td>{h.open} — {h.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="visit-links">
            <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`}>{SHOP.phone}</a>
            <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
          </p>
        </div>
        <img src={tools} alt="Clippers, comb and scissors on leather" loading="lazy" />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- pieces */

function SectionHead({ eyebrow, title, note }) {
  return (
    <div className="section-head">
      <p className="kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {note && <p className="section-note">{note}</p>}
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <a className="wordmark" href="#top">Iron<span>hand</span></a>
        <p>{SHOP.street}, {SHOP.city}</p>
        <p>
          <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`}>{SHOP.phone}</a>
          {' · '}
          <a href={`https://instagram.com/${SHOP.instagram}`} target="_blank" rel="noreferrer">
            @{SHOP.instagram}
          </a>
        </p>
        <p className="fine">
          A concept site, built as a demonstration. Ironhand is not a real business.
        </p>
      </div>
    </footer>
  )
}
