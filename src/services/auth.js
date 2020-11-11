import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client'

export function initVueAuthenticate(config) {
  if (config) {
    const store = new WebStorageStateStore({
      prefix: 'oc_oAuth',
      store: sessionStorage
    })

    const openIdConfig = {
      userStore: store,
      redirect_uri: window.location.origin + '/oidc-callback.html',
      response_type: 'code', // code triggers auth code grant flow
      response_mode: 'query',
      scope: 'openid profile offline_access',
      monitorSession: false,
      silent_redirect_uri: window.location.origin + '/oidc-silent-redirect.html',
      accessTokenExpiringNotificationTime: 10,
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      loadUserInfo: true,
      logLevel: Log.INFO
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
          redirect_uri: config.auth.redirectUri ? config.auth.redirectUri : window.location.origin + '/oidc-callback.html'
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
          redirect_uri: config.auth.redirectUri ? config.auth.redirectUri : window.location.origin + '/oidc-callback.html',
          response_type: 'token', // token is implicit flow - to be killed
          scope: 'openid profile',
          loadUserInfo: false
        })
      }
    }

    const mgr = new UserManager(openIdConfig)

    Log.logger = console
    Log.level = openIdConfig.logLevel

    mgr.events.addUserSignedOut(function() {
      console.log('UserSignedOut：', arguments)
    })

    return {
      authenticate() {
        return mgr.signinPopup()
      },
      getToken() {
        const storageString = sessionStorage.getItem('oc_oAuth' + mgr._userStoreKey)
        if (storageString) {
          const user = User.fromStorageString(storageString)
          if (user) {
            mgr.events.load(user, false)
            return user.access_token
          }
        }
        return null
      },
      getStoredUserObject() {
        const storageString = sessionStorage.getItem('oc_oAuth' + mgr._userStoreKey)
        if (storageString) {
          const user = User.fromStorageString(storageString)
          if (user) {
            mgr.events.load(user, false)
            return user
          }
        }
        return null
      },
      isAuthenticated() {
        return this.getToken() !== null
      },
      mgr: mgr,
      events() {
        return mgr.events
      }
    }
  }
}

export default initVueAuthenticate
