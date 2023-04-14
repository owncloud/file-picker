import 'vue'

declare module 'Vue' {
  interface GlobalComponents {
    OcSpinner: {
      'aria-label': string
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $gettext: (msgid: string) => string
    $pgettext: (context: string, msgid: string) => string
    $ngettext: (msgid: string, plural: string, n: number) => string
    $npgettext: (context: string, msgid: string, plural: string, n: number) => string
    $gettextInterpolate: (msgid: string, context: object, disableHtmlEscaping?: boolean) => string
  }
}
