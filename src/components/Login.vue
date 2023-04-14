<template>
  <div
    class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-middle uk-flex-center uk-background-cover uk-background-center-center uk-background-norepeat"
    :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"
  >
    <div class="oc-login-card">
      <div class="oc-login-card-body">
        <h3 class="oc-login-card-title" v-text="$gettext('Welcome to ownCloud File picker')" />
        <p
          v-text="
            $gettext('Please, click the button below to authenticate and get access to your data.')
          "
        />
        <oc-button variation="primary" @click="login">
          {{ $gettext('Log in') }}
        </oc-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import backgroundImage from '../assets/img/background.jpg'

export default defineComponent({
  emits: ['login'],

  setup(props, { emit }) {
    const login = () => {
      emit('login')
    }

    return { backgroundImage, login }
  }
})
</script>
