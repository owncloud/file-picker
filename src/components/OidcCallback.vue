<template>
  <div
    class="oc-height-1-1 oc-width-1-1 oc-flex oc-flex-middle oc-flex-center oc-background-cover oc-background-center-center oc-background-norepeat"
    :style="{ backgroundImage: 'url(' + BACKGROUND_IMAGE + ')' }"
  >
    <div class="oc-login-card">
      <div v-if="error !== ''" key="msg-error" class="oc-login-card-body">
        <h3 class="oc-login-card-title" v-text="$gettext('Authentication failed')" />
        <p v-text="$gettext('Please contact the administrator if this error persists.')" />
      </div>

      <div v-else key="msg-processing" class="oc-login-card-body">
        <h3 class="oc-login-card-title" v-text="$gettext('Logging you in')" />
        <p v-text="$gettext('Please wait, you are being redirected.')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getQueryParam } from '~/src/helpers/url'
import { defineComponent, onBeforeMount, ref } from 'vue'
import BACKGROUND_IMAGE from '../assets/img/background.jpg'

export default defineComponent({
  setup() {
    const error = ref('')

    onBeforeMount(() => {
      const query_error = getQueryParam('error')

      if (!query_error) return

      error.value = query_error
    })

    return { BACKGROUND_IMAGE, error }
  }
})
</script>
