// Slot generation for the booking flow. There is no backend here: the diary is
// derived from the opening hours, and the slots that read as taken are decided by
// a hash of the day, time and barber so that they stay put across re-renders.

const OPEN = { 0: [12, 18], 1: [10, 21], 2: [10, 21], 3: [10, 21], 4: [10, 21], 5: [10, 21], 6: [10, 20] }
const STEP_MINUTES = 30

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

export function isoOf(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

/** The next `count` days, starting today. */
export function upcomingDays(count = 14, from = new Date()) {
  const days = []
  for (let i = 0; i < count; i += 1) {
    const d = new Date(from)
    d.setDate(from.getDate() + i)
    days.push({
      iso: isoOf(d),
      weekday: WEEKDAY[d.getDay()],
      day: d.getDate(),
      month: MONTH[d.getMonth()],
      isToday: i === 0,
    })
  }
  return days
}

export function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${WEEKDAY[date.getDay()]} ${d} ${MONTH[m - 1]} ${y}`
}

/**
 * Every slot the shop could offer on `iso`, each marked free or taken.
 * A slot is dropped if the service would run past closing time.
 */
export function slotsFor(iso, barberId, serviceMinutes = 45, now = new Date()) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const [openHour, closeHour] = OPEN[date.getDay()] ?? []
  if (openHour === undefined) return []

  const slots = []
  const lastStart = closeHour * 60 - serviceMinutes
  const passedToday = isoOf(now) === iso ? now.getHours() * 60 + now.getMinutes() : -1

  for (let mins = openHour * 60; mins <= lastStart; mins += STEP_MINUTES) {
    if (mins <= passedToday) continue
    const label = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
    slots.push({
      time: label,
      taken: hash(`${iso}|${barberId}|${label}`) < 0.38,
    })
  }
  return slots
}
