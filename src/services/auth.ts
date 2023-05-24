import {
  Log,
  UserManager,
  InMemoryWebStorage,
  WebStorageStateStore,
  UserManagerSettings
} from 'oidc-client-ts'

const AUTH_STORAGE_PREFIX = 'oc_oAuth'

export function initVueAuthenticate(config) {
  if (config) {
    const storage = config.storage === 'memory' ? new InMemoryWebStorage() : localStorage
    const store = new WebStorageStateStore({
      prefix: AUTH_STORAGE_PREFIX,
      store: storage
    })

    let logLevel = Log.INFO

    if (Object.prototype.hasOwnProperty.call(config, 'logLevel')) {
      logLevel = config.logLevel
    }

    const openIdConfig: UserManagerSettings = {
      stateStore: store,
      userStore: store,
      popup_redirect_uri: window.location.origin + '?redirect=true',
      redirect_uri: window.location.origin + '?redirect=true',
      response_type: 'code', // code triggers auth code grant flow
      response_mode: 'query',
      scope: 'openid profile offline_access',
      monitorSession: false,
      silent_redirect_uri: window.location.origin + '?redirect=true&silent=true',
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      loadUserInfo: true,
      authority: '',
      client_id: ''
    }

    if (config.openIdConnect && config.openIdConnect.authority) {
      Object.assign(openIdConfig, config.openIdConnect)
    } else {
      // old openidconnect setup
      if (config.auth.metaDataUrl) {
        Object.assign(openIdConfig, {
          authority: config.auth.url,
          metadataUrl: config.auth.metaDataUrl,
          client_id: config.auth.clientId,
          redirect_uri: config.auth.redirectUri
            ? config.auth.redirectUri
            : window.location.origin + '?redirect=true'
        })
      } else {
        // oauth2 setup
        Object.assign(openIdConfig, {
          authority: config.auth.url,
          // with OAuth2 we need to set the metadata manually
          metadata: {
            issuer: config.auth.url,
            authorization_endpoint: config.auth.authUrl,
            token_endpoint: config.auth.url,
            userinfo_endpoint: ''
          },
          client_id: config.auth.clientId,
          client_secret: config.auth.clientSecret,
          redirect_uri: config.auth.redirectUri ? config.auth.redirectUri : window.location.origin,
          popup_redirect_uri: config.auth.redirectUri
            ? config.auth.redirectUri
            : window.location.origin,
          scope: 'profile',
          loadUserInfo: false
        })

        if (Object.prototype.hasOwnProperty.call(config.auth, 'clientSecret')) {
          openIdConfig.client_authentication = 'client_secret_basic'
        }
      }
    }

    const mgr = new UserManager(openIdConfig)

    Log.setLogger(console)
    Log.setLevel(logLevel)

    mgr.events.addUserSignedOut(function (...args) {
      console.log('UserSignedOut：', args)
    })

    mgr.events.addSilentRenewError(() => {
      return mgr.clearStaleState()
    })

    return {
      async authenticate() {
        await mgr.clearStaleState()
        return mgr.signinPopup()
      },

      async getUser() {
        const user = await mgr.getUser()

        return user
      },

      async getToken() {
        const user = await mgr.getUser()

        return user?.access_token || ''
      },

      async isAuthenticated() {
        const user = await mgr.getUser()

        return !!user?.access_token
      },

      isOfflineAccessSupported() {
        return openIdConfig?.scope?.includes('offline_access')
      },

      mgr
    }
  }
}

export default initVueAuthenticate
