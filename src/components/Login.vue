<template>
  <div
    class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-middle uk-flex-center"
    :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"
  >
    <div class="oc-login-card">
      <div class="oc-login-card-body">
        <h3 class="oc-login-card-title">
          Welcome to ownCloud File picker
        </h3>
        <p>
          Please click the button below to authenticate and get access to your data.
        </p>
        <oc-button variation="primary" @click="login">Log in</oc-button>
      </div>
    </div>
  </div>
</template>

<script>
import backgroundImage from '../assets/img/background.jpg'

export default {
  name: 'Login',

  computed: {
    backgroundImage() {
      return backgroundImage
    }
  },

  methods: {
    login() {
      this.$emit('login')
    }
  }
}
</script>
