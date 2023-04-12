import { EventEmitter } from 'stream'

declare global {
  interface Window {
    EventEmitter: EventEmitter
  }
}

window.EventEmitter = window.EventEmitter
