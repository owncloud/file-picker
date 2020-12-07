import { mount, createLocalVue } from '@vue/test-utils'

import { listResources } from '../helpers/mocks'
import { stubs } from '../helpers/stubs'

import FilePicker from '@/components/FilePicker.vue'

const localVue = createLocalVue()

localVue.prototype.$client = {
  files: {
    list: listResources
  }
}

describe('File picker', () => {
  it('renders list of resources', async () => {
    const wrapper = mount(FilePicker, {
      localVue,
      propsData: {
        variation: 'resource'
      },
      stubs
    })

    // Wait twice to give the list of resources enough time to render
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('[filename="ownCloud Manual.pdf"]').length).toEqual(1)
    expect(wrapper).toMatchSnapshot()
  })

  it('emits selected resources', async () => {
    const wrapper = mount(FilePicker, {
      localVue,
      propsData: {
        variation: 'resource'
      },
      stubs
    })

    // Wait twice to give the list of resources enough time to render
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // For test purpose set only the folder name instead of the whole object
    await wrapper.setData({ selectedResources: 'Documents' })

    // Emit click event instead of calling `trigger()` due to stubbed component
    wrapper.find('.file-picker-btn-select-resources').vm.$emit('click')

    await wrapper.vm.$nextTick()

    // Need to access nested array
    expect(wrapper.emitted().selectResources[0][0]).toContain('Documents')
  })
})
