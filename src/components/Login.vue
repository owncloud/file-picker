<template>
  <div
    class="oc-height-1-1 oc-width-1-1 oc-flex oc-flex-middle oc-flex-center oc-background-cover oc-background-center-center oc-background-norepeat"
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
