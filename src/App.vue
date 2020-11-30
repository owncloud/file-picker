<template>
  <div id="oc-file-picker" class="uk-height-1-1">
    <div
      v-if="state === 'loading'"
      class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-middle uk-flex-center oc-border"
    >
      <oc-spinner aria-label="Loading ownCloud file picker" />
    </div>
    <login v-if="state === 'unauthorized'" key="login-form" @login="authenticate" />
    <file-picker
      v-if="state === 'authorized'"
      key="file-picker"
      class="uk-height-1-1"
      :variation="variation"
      @selectResources="selectResources"
    />
  </div>
</template>

<script>
import sdk from 'owncloud-sdk'
import DesignSystem from 'owncloud-design-system'
import initVueAuthenticate from './services/auth'
import FilePicker from './components/FilePicker.vue'
import Login from './components/Login.vue'

// Init sdk and design system
/* global Vue */
if (!Vue.prototype.$client) {
  Vue.prototype.$client = new sdk()
}

// TODO: After we enable importing single components, remove this
Vue.use(DesignSystem)

export default {
  name: 'App',

  components: {
    FilePicker,
    Login
  },

  props: {
    variation: {
      type: String,
      required: true,
      validator: value => value === 'resource' || value === 'location'
    },
    configLocation: {
      type: String,
      required: false,
      default: () => window.location.origin + '/file-picker-config.json'
    },
    bearerToken: {
      type: String,
      required: false,
      default: null
    },
    configObject: {
      type: Object,
      required: false,
      default: null
    },
    isSdkProvided: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    authInstance: null,
    state: 'loading',
    config: null
  }),

  created() {
    this.initAuthentication()
  },

  beforeDestroy() {
    this.authInstance.mgr.events.removeUserLoaded()
  },

  methods: {
    initApp() {
      if (!this.isSdkProvided) {
        const bearerToken = this.bearerToken || this.authInstance.getToken()

        // Init owncloud-sdk
        this.$client.init({
          baseUrl: this.config.server,
          auth: {
            bearer: bearerToken
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
      }

      this.state = 'authorized'
    },

    async initAuthentication() {
      // If configObject is passed - use that one instead of fetching one
      if (this.configObject !== null) {
        this.config = this.configObject
      } else {
        let config = await fetch(this.configLocation)
        this.config = await config.json()
      }

      if (this.bearerToken) {
        return this.initApp()
      }

      this.authInstance = initVueAuthenticate(this.config)
      this.checkUserAuthentication()
    },

    checkUserAuthentication() {
      if (this.authInstance.isAuthenticated()) {
        return this.initApp()
      }

      this.state = 'unauthorized'

      // If the user is not authenticated, we add event listener when he logs in to automatically init the application afterwards
      this.authInstance.mgr.events.addUserLoaded(() => {
        this.initApp()
      })
    },

    authenticate() {
      this.authInstance.authenticate()
    },

    selectResources(resources) {
      this.$emit('selectResources', resources)
    }
  }
}
</script>

<style>
/* Import oC CI font and design system styles */
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
@import '../node_modules/owncloud-design-system/dist/system/system.css';

* {
  font-family: 'Source Sans Pro', sans-serif;
}
</style>
