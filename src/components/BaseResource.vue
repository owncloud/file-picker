<template>
  <div class="oc-flex-inline oc-flex-middle oc-button-gap-m">
    <oc-resource-icon :resource="resource" />
    <div class="oc-width-expand">
      <component
        :is="resource.type === 'folder' ? 'oc-button' : 'p'"
        v-bind="resourceNameProps"
        class="file-row-name oc-text-truncate oc-my-rm"
        :filename="resource.name"
        @click="navigate"
      >
        <oc-resource-name
          :full-path="resource.path"
          :name="resource.name"
          :extension="resource.extension"
          :type="resource.type"
        />
      </component>
      <p class="oc-text-meta oc-my-rm">
        <template v-if="resource.size">
          <oc-resource-size :size="resource.size" /> - {{ mDate }}
        </template>

        <span v-else v-text="mDate" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { computed, defineComponent, getCurrentInstance, PropType } from 'vue'
import { Resource } from '@ownclouders/web-client'

import { formDateFromNow } from '../helpers/date'

export default defineComponent({
  props: {
    resource: {
      type: Object as PropType<Resource>,
      required: true
    }
  },

  emits: ['navigate', 'open-share'],

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() || {}

    const mDate = computed(() => {
      if (props.resource.mdate) {
        const translated = proxy?.$gettext('Last modified %{ date }')

        return proxy?.$gettextInterpolate(translated, {
          date: formDateFromNow(props.resource.mdate)
        })
      }

      if (props.resource.sdate) {
        const translated = proxy?.$gettext('Shared %{ date }')

        return proxy?.$gettextInterpolate(translated, {
          date: formDateFromNow(props.resource.sdate)
        })
      }

      return ''
    })

    const navigateButtonLabel = computed(() => {
      const translated = proxy?.$gettext('Navigate into %{ name }')

      return proxy?.$gettextInterpolate(translated, { name: path.basename(props.resource.name) })
    })

    const resourceNameProps = computed(() => {
      if (props.resource.type === 'folder') {
        return {
          ariaLabel: navigateButtonLabel.value,
          appearance: 'raw',
          variation: 'passive'
        }
      }

      return null
    })

    const navigate = (e: MouseEvent) => {
      if (props.resource.type !== 'folder') return

      e.stopPropagation()

      if (Object.prototype.hasOwnProperty.call(props.resource, 'share')) {
        emit('open-share', { path: props.resource.path, shareId: props.resource.id })

        return
      }

      emit('navigate', props.resource.path)
    }

    return { mDate, resourceNameProps, navigate }
  }
})
</script>
