import { useState } from 'react'

import { Page, PageHead, SectionHead } from '../components/Chrome.jsx'
import { SERVICES, FAQ, HOURS, SHOP } from '../data.js'
import { href } from '../lib/paths.js'

import tools from '../assets/tools.jpg'

export default function Services() {
  return (
    <Page>
      <PageHead
        eyebrow="Services"
        title="What it costs, before you sit down"
        note="Prices are per visit, not per hour. Nothing gets added at the till, and nobody will try to sell you a product on the way out."
      />

      <section className="section section-tight">
        <div className="shell">
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
          <div className="after-list">
            <a className="btn btn-solid btn-lg" href={href('book')}>Book a chair</a>
          </div>
        </div>
      </section>

      <section className="section section-split">
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

      <section className="section">
        <div className="shell narrow">
          <SectionHead eyebrow="Questions" title="Before you come in" />
          <Faq />
        </div>
      </section>
    </Page>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
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
  )
}
