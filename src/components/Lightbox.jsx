import { useEffect, useState } from 'react'

/** A grid of thumbnails that open full size, with keyboard paging. */
export default function Lightbox({ images }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active === null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, images.length])

  return (
    <>
      <div className="gallery">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className="shot"
            onClick={() => setActive(i)}
            aria-label={`Open image ${i + 1} of ${images.length}`}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <img src={images[active].src} alt={images[active].alt} />
          <p>{images[active].alt}</p>
          <button className="lightbox-close" type="button" aria-label="Close">&times;</button>
        </div>
      )}
    </>
  )
}
