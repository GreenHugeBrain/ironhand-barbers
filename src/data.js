import cutting from './assets/cutting.jpg'
import shave from './assets/shave.jpg'
import clipper from './assets/clipper.jpg'
import tools from './assets/tools.jpg'

export const SHOP = {
  name: 'Ironhand',
  street: '62 Davit Aghmashenebeli Avenue',
  city: 'Tbilisi 0102',
  phone: '+995 555 41 07 22',
  email: 'book@ironhand.ge',
  instagram: 'ironhand.tbilisi',
}

export const HOURS = [
  { days: 'Monday — Friday', open: '10:00', close: '21:00' },
  { days: 'Saturday', open: '10:00', close: '20:00' },
  { days: 'Sunday', open: '12:00', close: '18:00' },
]

export const SERVICES = [
  {
    id: 'cut',
    name: 'Haircut',
    price: 45,
    minutes: 45,
    blurb: 'Consultation, wash, cut and finish. However long it takes to get right.',
  },
  {
    id: 'cut-beard',
    name: 'Cut & beard',
    price: 65,
    minutes: 60,
    blurb: 'The full sit-down. Haircut, beard shaped and lined, hot towel to finish.',
  },
  {
    id: 'beard',
    name: 'Beard trim',
    price: 30,
    minutes: 30,
    blurb: 'Shaped with clipper and scissor, edged with a razor, oiled.',
  },
  {
    id: 'shave',
    name: 'Hot towel shave',
    price: 40,
    minutes: 40,
    blurb: 'Steamed, lathered, shaved with a straight razor. Twice, against the grain.',
  },
  {
    id: 'skin',
    name: 'Skin fade',
    price: 55,
    minutes: 50,
    blurb: 'Taken down to the skin and blended clean. Our most requested cut.',
  },
  {
    id: 'kids',
    name: "Kids' cut",
    price: 30,
    minutes: 30,
    blurb: 'Under twelves. Patience included, no extra charge.',
  },
]

export const BARBERS = [
  {
    id: 'levan',
    name: 'Levan',
    initial: 'L',
    role: 'Owner · 14 years',
    blurb: 'Trained in Istanbul, opened Ironhand in 2019. Classic scissor work and '
      + 'the steadiest razor in the room.',
    does: ['cut', 'cut-beard', 'shave', 'beard'],
  },
  {
    id: 'nika',
    name: 'Nika',
    initial: 'N',
    role: 'Barber · 7 years',
    blurb: 'Fades, tapers and anything that needs a clipper. Ask him for something '
      + 'sharp and he will talk you into something sharper.',
    does: ['cut', 'skin', 'cut-beard', 'kids'],
  },
  {
    id: 'saba',
    name: 'Saba',
    initial: 'S',
    role: 'Barber · 4 years',
    blurb: 'Beards are his subject. Shapes to the jaw rather than to a trend, and '
      + 'will tell you honestly when to grow it out.',
    does: ['beard', 'shave', 'cut', 'kids'],
  },
]

export const GALLERY = [
  { src: cutting, alt: 'A barber working through a fade with clippers' },
  { src: shave, alt: 'Hot towel straight razor shave in progress' },
  { src: clipper, alt: 'Close work around the ear with a trimmer' },
  { src: tools, alt: 'Clippers, comb and scissors laid out on leather' },
]

export const FAQ = [
  {
    q: 'Do you take walk-ins?',
    a: 'Yes, but the chair you want may not be free. Booking takes about twenty '
      + 'seconds and guarantees it.',
  },
  {
    q: 'How do I pay?',
    a: 'Cash or card in the shop. Nothing is charged when you book — the slot is '
      + 'simply held for you.',
  },
  {
    q: 'What if I am running late?',
    a: 'Call us. We hold a chair ten minutes past the hour; after that we may have '
      + 'to move you to the next free slot.',
  },
  {
    q: 'Can I book for someone else?',
    a: 'Of course. Put their name in the booking and your own number, so we can '
      + 'reach someone if anything changes.',
  },
]
