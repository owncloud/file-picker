import { shallowMount } from '@vue/test-utils'

import resources from '../fixtures/resources'

import { listResources } from '../helpers/mocks'
import { stubs } from '../helpers/stubs'

import FilePicker from '~/src/components/FilePicker.vue'

const mockFocus = jest.fn()

function mockA11yComposable() {
  return { focusAndAnnounceBreadcrumb: mockFocus }
}

jest.mock('~/src/composables/useA11y', () => mockA11yComposable)

const SELECTORS = Object.freeze({
  headerList: '[data-testid="list-header"]',
  listResources: '[data-testid="list-resources"]'
})

const getWrapper = ({ props } = {}) => {
  const wrapper = shallowMount(FilePicker, {
    propsData: { variation: 'resource', ...props },
    stubs,
    provide: {
      client: { value: {} },
      webdav: {
        value: {
          listFiles: listResources
        }
      },
      sdk: { value: {} },
      config: { value: {} },
      capabilities: { value: { capabilities: {} } },
      user: { value: {} }
    }
  })

  return wrapper
}

describe('File picker', () => {
  const waitTillItemsLoaded = async (wrapper) => {
    // Wait twice to give the list of resources enough time to render
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
  }

  it('loads root folder on init', async () => {
    const wrapper = getWrapper()

    await waitTillItemsLoaded(wrapper)

    expect(listResources).toHaveBeenCalledWith({ driveType: 'personal' }, { path: '/' })
  })

  it('emits selected resources', async () => {
    const wrapper = getWrapper()

    await waitTillItemsLoaded(wrapper)

    // For test purpose set only the folder name instead of the whole object
    wrapper.find(SELECTORS.listResources).vm.$emit('selectResources', ['Documents'])

    // Emit click event instead of calling `trigger()` due to stubbed component
    wrapper.find(SELECTORS.headerList).vm.$emit('select')

    // Need to access nested array
    expect(wrapper.emitted().select[0][0]).toContain('Documents')
  })

  it('emits a cancel event on cancel', () => {
    const wrapper = getWrapper({
      props: {
        cancelBtnLabel: 'Cancel'
      }
    })

    wrapper.find(SELECTORS.headerList).vm.$emit('cancel')

    expect(wrapper.emitted()).toHaveProperty('cancel')
  })

  describe('emits events after loading folders in location variant', () => {
    it('emits "update" with argument of type array', async () => {
      const wrapper = getWrapper({ props: { variation: 'location' } })

      await waitTillItemsLoaded(wrapper)

      expect(Array.isArray(wrapper.emitted().update[0][0])).toBe(true)
    })

    it('emits "folderLoaded" with current folder as an argument', async () => {
      const wrapper = getWrapper({ props: { variation: 'location' } })

      await waitTillItemsLoaded(wrapper)

      expect(wrapper.emitted().folderLoaded[0][0].id).toEqual(resources['/'][0].id)
    })
  })

  describe('has focus management', () => {
    describe('initial folder load', () => {
      it('does not focus last breadcrumb item if initial focus is disabled', async () => {
        const wrapper = getWrapper()

        await waitTillItemsLoaded(wrapper)

        expect(mockFocus).not.toHaveBeenCalled()
      })

      it('focuses last breadcrumb item if initial focus is disabled', async () => {
        const wrapper = getWrapper({
          props: {
            isInitialFocusEnabled: true
          }
        })

        await waitTillItemsLoaded(wrapper)

        expect(mockFocus).toHaveBeenCalled()
      })
    })
  })
})
