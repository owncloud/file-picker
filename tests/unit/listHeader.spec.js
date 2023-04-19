import { shallowMount } from '@vue/test-utils'

import { stubs } from '../helpers/stubs'

import ListHeader from '~/src/components/ListHeader.vue'

const SELECTORS = Object.freeze({
  titleFolder: '[data-testid="title-folder"]',
  btnReturn: '[data-testid="btn-return"]',
  btnSelect: '[data-testid="list-header-btn-select"]'
})

const getWrapper = ({ props, provide } = {}) =>
  shallowMount(ListHeader, {
    propsData: {
      currentFolder: {
        path: '/Documents/PDF',
        name: 'PDF'
      },
      isSelectBtnEnabled: true,
      isLocationPicker: false,
      ...props
    },
    stubs,
    provide: {
      capabilities: { value: { capabilities: { spaces: { enabled: false } } } },
      ...provide
    }
  })

describe('List header', () => {
  it('shows current folder name as the title', () => {
    const wrapper = getWrapper()

    expect(wrapper.find(SELECTORS.titleFolder).text()).toBe('PDF')
  })

  it('shows text "All Files" as the title when the folder name is missing and spaces are not enabled', () => {
    const wrapper = getWrapper({ props: { currentFolder: null } })

    expect(wrapper.find(SELECTORS.titleFolder).text()).toBe('All Files')
  })

  it('shows text "Files" as the title when the folder name is missing and spaces are enabled', () => {
    const wrapper = getWrapper({
      props: { currentFolder: null },
      provide: { capabilities: { value: { capabilities: { spaces: { enabled: true } } } } }
    })

    expect(wrapper.find(SELECTORS.titleFolder).text()).toBe('Files')
  })

  it('hides select btn if it is hidden by a prop', () => {
    const wrapper = getWrapper({ props: { isSelectBtnDisplayed: false } })

    expect(wrapper.findAll('[data-testid="list-header-btn-select"]').length).toBe(0)
  })

  it('renders a cancel button if a label is provided', () => {
    const wrapper = getWrapper({ props: { cancelBtnLabel: 'Cancel' } })

    expect(wrapper.find('[data-testid="list-header-btn-cancel"]').exists()).toBeTruthy()
    expect(wrapper.find('[data-testid="list-header-btn-cancel"]').text()).toBe('Cancel')
  })

  it('hides cancel button by default', () => {
    const wrapper = getWrapper()

    expect(wrapper.find('[data-testid="list-header-btn-cancel"]').exists()).toBeFalsy()
  })

  it('emits go-back when clicking back chevron', async () => {
    const wrapper = getWrapper()

    await wrapper.find(SELECTORS.btnReturn).trigger('click')

    expect(wrapper.emitted()).toHaveProperty('go-back')
  })

  it('renders the select button with the provided label', () => {
    const wrapper = getWrapper({
      props: {
        selectBtnLabel: 'TestLabel'
      }
    })

    expect(wrapper.find(SELECTORS.btnSelect).text()).toBe('TestLabel')
  })
})
