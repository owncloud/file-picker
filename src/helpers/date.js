import moment from 'moment'

// TODO: Investiage if we can set language manually
// Getting the browser set language is not a good UX
// Passing as a prop doesn't seem like a nice solution
const browserSetLanguage = navigator.language || navigator.userLanguage

export function formDateFromNow(date) {
  return moment(date)
    .locale(browserSetLanguage)
    .fromNow()
}
