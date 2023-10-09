import { shallowMount } from '@vue/test-utils'

import resources from '../fixtures/resources'
import { stubs } from '../helpers/stubs'

import ListResources from '~/src/components/ListResources.vue'

const SELECTORS = Object.freeze({
  resource: '[data-testid="resource"]'
})

const getWrapper = () =>
  shallowMount(ListResources, { propsData: { resources: resources['/'] }, stubs })

describe('List resources', () => {
  it('Resets resources selection on navigation', async () => {
    const wrapper = getWrapper()

    await wrapper.setData({ selectedResources: resources['/'] })

    wrapper.findAll(SELECTORS.resource).at(0).vm.$emit('navigate')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().selectResources[0][0].length).toEqual(0)
  })

  it('should be able to select/deselect all resources using computed', async () => {
    const wrapper = getWrapper()

    await wrapper.setData({ selectedResources: [] })

    // Test the "select all" scenario
    await wrapper.vm.toggleSelectAll()
    expect(wrapper.vm.selectedResources).toEqual(resources['/'])

    // Wait for next tick to confirm emission
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().selectResources[0][0]).toEqual(resources['/'])

    // Test the "deselect all" scenario
    await wrapper.vm.toggleSelectAll()
    expect(wrapper.vm.selectedResources).toEqual([])
  })
})
