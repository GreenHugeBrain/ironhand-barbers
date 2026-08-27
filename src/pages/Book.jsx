import { useEffect, useMemo, useRef, useState } from 'react'

import { Page, PageHead } from '../components/Chrome.jsx'
import { SERVICES, BARBERS } from '../data.js'
import { upcomingDays, slotsFor, longDate } from '../booking.js'
import { href } from '../lib/paths.js'

const STEPS = ['Barber', 'Service', 'Time', 'Details']

export default function Book() {
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

  if (done) {
    return (
      <Page>
        <Confirmation booking={done} onReset={reset} />
      </Page>
    )
  }

  return (
    <Page>
      <PageHead
        eyebrow="Booking"
        title="Four taps and the chair is yours"
        note="Nothing is charged now. We hold the slot and see you on the day."
      />

      <section className="section section-tight">
        <div className="shell">
          <ol className="steps">
            {STEPS.map((label, i) => {
              const state = i === step ? 'is-current' : i < step ? 'is-done' : ''
              return (
                <li key={label} className={state}>
                  <button type="button" onClick={() => i < step && goto(i)} disabled={i >= step}>
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
                <button type="button" className="choice" onClick={() => chooseBarber(null)}>
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
                <button className="btn btn-solid btn-lg" type="submit">Confirm booking</button>
              </form>
            )}
          </div>

          <Summary barber={barber} service={service} day={day} time={time} step={step} />
        </div>
      </section>
    </Page>
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
    <section className="section">
      <div className="shell">
        <div className="confirmed" tabIndex={-1} ref={ref}>
          <p className="kicker">Booked</p>
          <h1>See you {booking.day.isToday ? 'today' : `on ${longDate(booking.day.iso)}`}.</h1>
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
          <div className="confirm-actions">
            <button className="btn btn-ghost" type="button" onClick={onReset}>
              Make another booking
            </button>
            <a className="btn btn-ghost" href={href('')}>Back to the shop</a>
          </div>
        </div>
      </div>
    </section>
  )
}
