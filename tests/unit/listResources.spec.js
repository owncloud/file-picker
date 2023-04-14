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

    // Wait twice to give the list of resources enough time to render
    await wrapper.vm.$nextTick()

    // Need to access nested array
    expect(wrapper.emitted().selectResources[0][0].length).toEqual(0)
  })
})
