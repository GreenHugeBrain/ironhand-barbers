import { Page, PageHead } from '../components/Chrome.jsx'
import { BARBERS, SERVICES } from '../data.js'
import { href } from '../lib/paths.js'

export default function Barbers() {
  return (
    <Page>
      <PageHead
        eyebrow="The chairs"
        title="Three barbers, three hands"
        note="Book the one you know, or leave it to us and take the first free chair. Nobody here is a junior."
      />

      <section className="section section-tight">
        <div className="shell">
          <div className="barber-list">
            {BARBERS.map((b) => (
              <article className="barber-row" key={b.id}>
                <span className="barber-initial-lg" aria-hidden="true">{b.initial}</span>
                <div className="barber-row-body">
                  <h2>{b.name}</h2>
                  <p className="role">{b.role}</p>
                  <p className="barber-blurb">{b.blurb}</p>

                  <h3 className="does-head">Books for</h3>
                  <ul className="does">
                    {b.does.map((id) => {
                      const s = SERVICES.find((x) => x.id === id)
                      if (!s) return null
                      return (
                        <li key={id}>
                          <b>{s.name}</b>
                          <span>{s.minutes} min · {s.price}&#8382;</span>
                        </li>
                      )
                    })}
                  </ul>

                  <a className="btn btn-ghost" href={href('book')}>Book {b.name}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
