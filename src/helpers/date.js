import { DateTime } from 'luxon'

// TODO: Investiage if we can set language manually
// Getting the browser set language is not a good UX
// Passing as a prop doesn't seem like a nice solution

export function formDateFromNow(date) {
  return DateTime.fromJSDate(new Date(date)).toRelative()
}
