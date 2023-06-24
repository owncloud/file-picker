import { getCurrentInstance } from 'vue'

const useA11y = () => {
  const { proxy } = getCurrentInstance() || {}

  const focusAndAnnounceBreadcrumb = (itemsCount) => {
    const activeBreadcrumb: HTMLButtonElement = document.querySelector('.oc-file-picker-btn-return')

    if (!activeBreadcrumb) {
      return
    }

    const translated = proxy?.$ngettext(
      'This folder contains 1 item.',
      'This folder contains %{ itemsCount } items.',
      itemsCount
    )
    const announcement =
      itemsCount > 0
        ? proxy?.$gettextInterpolate(translated, { itemsCount })
        : proxy?.$gettext('This folder has no content.')
    const invisibleHint = document.createElement('p')

    invisibleHint.className = 'oc-invisible-sr oc-breadcrumb-sr'
    invisibleHint.innerHTML = announcement

    activeBreadcrumb.append(invisibleHint)
    activeBreadcrumb.focus()
  }

  return { focusAndAnnounceBreadcrumb }
}

export default useA11y
