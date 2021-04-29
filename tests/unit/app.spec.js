import { shallowMount, createLocalVue } from '@vue/test-utils'

import { stubs } from '../helpers/stubs'

import App from '@/App.vue'

const localVue = createLocalVue()

describe('App', () => {
  beforeEach(() => {
    jest.mock('vue')
  })

  it('focuses the outmost wrapper when mounted', () => {
    const wrapper = shallowMount(App, {
      propsData: {
        variation: 'resource',
        isOdsProvided: true,
        isSdkProvided: true,
        configObject: {},
        bearerToken: 'token',
      },
      stubs,
      localVue,
    })

    expect(document.activeElement).toBe(wrapper.find('#oc-file-picker').element)
  })
})
