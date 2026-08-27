import { Page, SectionHead } from '../components/Chrome.jsx'
import { SERVICES, BARBERS, GALLERY } from '../data.js'
import { href } from '../lib/paths.js'

import hero from '../assets/hero.jpg'

export default function Home() {
  return (
    <Page transparentHeader>
      <section className="hero">
        <img className="hero-img" src={hero} alt="" />
        <div className="hero-veil" />
        <div className="shell hero-inner">
          <p className="kicker">Barbershop · Tbilisi · since 2019</p>
          <h1>Sit down.<br />Stand up sharper.</h1>
          <p className="hero-lede">
            Three chairs on Aghmashenebeli. Cuts, beards and hot-towel shaves,
            booked in four taps and never rushed.
          </p>
          <div className="hero-cta">
            <a className="btn btn-solid btn-lg" href={href('book')}>Book a chair</a>
            <a className="btn btn-ghost btn-lg" href={href('services')}>See prices</a>
          </div>
          <dl className="hero-facts">
            <div><dt>Open</dt><dd>7 days</dd></div>
            <div><dt>From</dt><dd>30&#8382;</dd></div>
            <div><dt>Walk-ins</dt><dd>Welcome</dd></div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="Services"
            title="Six things, done properly"
            note="Prices are per visit, not per hour. Nothing gets added at the till."
          />
          <ul className="price-list price-list-compact">
            {SERVICES.slice(0, 4).map((s) => (
              <li key={s.id}>
                <div className="price-row">
                  <h3>{s.name}</h3>
                  <span className="dots" aria-hidden="true" />
                  <span className="price">{s.price}&#8382;</span>
                </div>
                <span className="mins">{s.minutes} min</span>
              </li>
            ))}
          </ul>
          <a className="btn btn-ghost" href={href('services')}>The full list</a>
        </div>
      </section>

      <section className="section section-dark">
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
                </div>
              </article>
            ))}
          </div>
          <a className="btn btn-ghost" href={href('barbers')}>What each of them does</a>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead eyebrow="Gallery" title="The work, not the poster" />
          <div className="gallery">
            {GALLERY.map((img) => (
              <a className="shot" key={img.src} href={href('gallery')}>
                <img src={img.src} alt={img.alt} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-split">
        <div className="shell cta">
          <div>
            <h2>Four taps and the chair is yours.</h2>
            <p>Nothing is charged when you book. We hold the slot and see you on the day.</p>
          </div>
          <a className="btn btn-solid btn-lg" href={href('book')}>Book a chair</a>
        </div>
      </section>
    </Page>
  )
}
