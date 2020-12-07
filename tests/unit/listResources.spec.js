import { mount } from '@vue/test-utils'

import { testResources } from '../helpers/mocks'
import { stubs } from '../helpers/stubs'
import { buildResource } from '@/helpers/resources'

import ListResources from '@/components/ListResources.vue'

const resources = testResources.map(resource => buildResource(resource))

describe('List resources', () => {
  it('Resets resources selection on navigation', async () => {
    const wrapper = mount(ListResources, {
      propsData: {
        resources
      },
      stubs
    })

    await wrapper.setData({ selectedResources: resources })

    wrapper
      .findAll('.file-picker-resource')
      .at(0)
      .vm.$emit('navigate')

    // Wait twice to give the list of resources enough time to render
    await wrapper.vm.$nextTick()

    // Need to access nested array
    expect(wrapper.emitted().selectResources[0][0].length).toEqual(0)
  })
})
