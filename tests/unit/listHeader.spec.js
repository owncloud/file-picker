import { shallowMount } from '@vue/test-utils'

import { stubs } from '../helpers/stubs'

import ListHeader from '@/components/ListHeader.vue'

const defaultProps = {
  currentFolder: {
    path: '/Documents/PDF'
  },
  isSelectBtnEnabled: true,
  isLocationPicker: false
}

describe('List header', () => {
  it('builds correct path for breadcrumbs', async () => {
    const wrapper = shallowMount(ListHeader, {
      propsData: defaultProps,
      stubs
    })

    expect(wrapper.vm.breadcrumbsItems.length).toEqual(3)
    expect(wrapper.vm.breadcrumbsItems[2].text).toEqual('PDF')
  })
})
