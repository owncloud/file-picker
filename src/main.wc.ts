import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import { Buffer } from 'buffer'
import EventEmitter from 'events'
import process from 'process'
import styles from './style.css'

import App from './App.vue'

// sax.js needs these
window.Buffer = Buffer
window.EventEmitter = new EventEmitter()
window.process = process

Vue.config.productionTip = false

const FilePicker = wrap(Vue, App, styles)

// @ts-expect-error mismatch in type comes from the wrapper library
customElements.define('file-picker', FilePicker)
