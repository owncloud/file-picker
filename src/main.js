import Vue from './vue'
import App from './App.vue'

new Vue({
  render: (h) => {
    return h(App, {
      props: {
        variation: 'resource',
        locale: 'cs_CZ',
      },
    })
  },
}).$mount('#app')
