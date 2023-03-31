import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import { Buffer } from 'buffer'
import EventEmitter from 'events'
import process from 'process'

import App from './App.vue'

// sax.js needs these
window.Buffer = Buffer
// TODO: figure out the following ts error
// @ts-expect-error declaring global EventEmitter on the window still leads to an error
window.EventEmitter = EventEmitter
window.process = process

Vue.config.productionTip = false

const FilePicker = wrap(Vue, App)

// @ts-expect-error mismatch in type comes from the wrapper library
customElements.define('file-picker', FilePicker)
