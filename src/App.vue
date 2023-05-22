<template>
  <div id="oc-file-picker" tabindex="-1" @keyup.esc="cancel">
    <div
      v-if="state === 'loading'"
      class="oc-height-1-1 oc-width-1-1 oc-flex oc-flex-middle oc-flex-center oc-border"
    >
      <oc-spinner :aria-label="$gettext('Loading ownCloud File Picker')" />
    </div>
    <login v-if="state === 'unauthorized'" key="login-form" @login="authenticate" />
    <oidc-callback v-if="state === 'authorizing'" />
    <file-picker
      v-if="state === 'authorized'"
      key="file-picker"
      class="oc-height-1-1"
      :variation="variation"
      :select-btn-label="selectBtnLabel"
      :is-select-btn-displayed="isSelectBtnDisplayed"
      :cancel-btn-label="cancelBtnLabel"
      :is-initial-focus-enabled="isInitialFocusEnabled"
      @auth-error="handleAuthError"
      @cancel="cancel"
      @folder-loaded="onFolderLoaded"
      @select="emitSelectBtnClick"
      @update="selectResources"
    />
  </div>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  provide,
  ref
} from 'vue'
import DesignSystem from 'owncloud-design-system'
import VueGettext from 'vue-gettext'
import merge from 'lodash-es/merge'
import { client as webClient } from '@ownclouders/web-client'
import axios from 'axios'
import owncloudSdk from 'owncloud-sdk'
import { webdav as initWebdav } from '@ownclouders/web-client/src/webdav'

import initVueAuthenticate from './services/auth'

import { loadConfig } from './helpers/config'
import { getQueryParam } from './helpers/url'

import filePickerTranslations from '../l10n/translations.json'
import odsTranslations from 'owncloud-design-system/dist/system/translations.json'

import FilePicker from './components/FilePicker.vue'
import Login from './components/Login.vue'
import OidcCallback from './components/OidcCallback.vue'

if (!Vue.prototype.$gettext) {
  const supportedLanguages = {
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    cs: 'Czech',
    fr: 'Français',
    it: 'Italiano',
    gl: 'Galego'
  }
  const translations = merge({}, filePickerTranslations, odsTranslations)

  Vue.use(VueGettext, {
    availableLanguages: supportedLanguages,
    defaultLanguage: navigator.language.substring(0, 2),
    translations,
    silent: true
  })
}

export default {
  name: 'App',

  components: { FilePicker, Login, OidcCallback },

  props: {
    variation: {
      type: String,
      required: true,
      validator: (value) => value === 'resource' || value === 'location'
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
      type: [Object, String],
      required: false,
      default: null
    },
    isSdkProvided: {
      type: Boolean,
      required: false,
      default: false
    },
    selectBtnLabel: {
      type: String,
      required: false,
      default: null
    },
    isSelectBtnDisplayed: {
      type: Boolean,
      required: false,
      default: true
    },
    cancelBtnLabel: {
      type: String,
      required: false,
      default: null
    },
    isOdsProvided: {
      type: Boolean,
      required: false,
      default: false
    },
    locale: {
      type: String,
      required: false,
      default: null
    },
    isInitialFocusEnabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  emits: ['update', 'select', 'cancel', 'folderLoaded', 'token'],

  setup(props, { emit }) {
    let authInstance = null
    let axiosInstance = null

    const { proxy } = getCurrentInstance()

    const config = ref(null)
    const state = ref('loading')
    const client = ref(null)
    const capabilities = ref(null)
    const user = ref(null)
    const webdav = ref(null)
    const sdk = ref(null)

    provide('client', client)
    provide('capabilities', capabilities)
    provide('user', user)
    provide('webdav', webdav)
    provide('sdk', sdk)
    provide('config', config)

    const currentLocale = computed(() => {
      return props.locale || navigator.language.substring(0, 2)
    })

    const authorizeUser = () => {
      authInstance.mgr.signinPopupCallback()
    }

    const handleAuthError = async () => {
      if (authInstance) {
        await authInstance.mgr.clearStaleState()
        state.value = 'unauthorized'
      }
    }

    const createAxiosInstance = (token) => {
      const instance = axios.create({
        headers: { Authorization: token.startsWith('Bearer') ? token : `Bearer ${token}` }
      })
      instance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error?.response?.status === 401) {
            return handleAuthError()
          }
        }
      )
      return instance
    }

    const initSdk = (token) => {
      if (props.isSdkProvided) {
        sdk.value = proxy.$client

        return
      }

      sdk.value = new owncloudSdk({
        baseUrl: config.value.server,
        auth: {
          bearer: token
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
    }

    const initApp = async () => {
      try {
        const token = await authInstance.getToken()
        axiosInstance = createAxiosInstance(token)
        const _client = webClient(config.value.server, axiosInstance)
        // const { data: userData } = await _client.graph.users.getMe()

        initSdk(token)

        const login = await sdk.value.getCurrentUser()

        client.value = _client
        capabilities.value = await _client.ocs.getCapabilities()
        webdav.value = initWebdav({ sdk: sdk.value })
        user.value = login

        state.value = 'authorized'

        emit('token', token)

        return true
      } catch (error) {
        console.error(error)
        return false
      }
    }

    const updateBearerToken = async () => {
      const token = await authInstance.getToken()
      const auth = token.startsWith('Bearer') ? token : `Bearer ${token}`

      axiosInstance.defaults.headers.common.Authorization = auth

      sdk.value.helpers.setAuthorization(auth)

      emit('token', token)
    }

    const initAuthentication = async () => {
      config.value = await loadConfig(props.configObject, props.configLocation)

      if (props.bearerToken) {
        return initApp()
      }

      authInstance = initVueAuthenticate(config.value)

      if (getQueryParam('redirect') === 'true' || getQueryParam('code') !== null) {
        state.value = 'authorizing'

        nextTick(() => {
          authorizeUser()
        })

        return
      }

      authInstance.mgr.events.addUserLoaded(() => {
        if (state.value === 'authorized') {
          updateBearerToken()
        } else {
          initApp()
        }
      })

      authInstance.mgr.events.addSilentRenewError(() => {
        handleAuthError()
      })

      if (await authInstance.isAuthenticated()) {
        if (await initApp()) {
          return
        }
        await authInstance.mgr.clearStaleState()
      }
      state.value = 'unauthorized'
    }

    const authenticate = () => {
      authInstance.authenticate()
    }

    const selectResources = (resources) => {
      emit('update', resources)
    }

    const emitSelectBtnClick = (resources) => {
      emit('select', resources)
    }

    const cancel = () => {
      if (props.cancelBtnLabel === null) {
        // don't propagate cancel events if we don't have a cancel button
        return
      }

      emit('cancel')
    }

    const onFolderLoaded = (folder) => {
      emit('folderLoaded', folder)
    }

    onBeforeMount(() => {
      if (!props.isOdsProvided) {
        // TODO: After we enable importing single components, remove this
        Vue.use(DesignSystem)
      }

      initAuthentication()
    })

    onMounted(() => {
      proxy.$language.current = currentLocale.value
    })

    onBeforeUnmount(() => {
      authInstance.mgr.events.removeUserLoaded()
    })

    return {
      config,
      state,
      authorizeUser,
      cancel,
      authenticate,
      emitSelectBtnClick,
      onFolderLoaded,
      selectResources,
      handleAuthError
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
