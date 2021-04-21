<template>
  <div class="uk-flex-inline uk-flex-middle" :class="{ 'oc-file': item.type === 'folder' }">
    <oc-icon
      key="resource-icon"
      :name="resourceIcon"
      size="medium"
      aria-hidden="true"
      class="uk-margin-small-right"
    />
    <div class="uk-width-expand">
      <component
        :is="item.type === 'folder' ? 'oc-button' : 'div'"
        v-bind="resourceNameProps"
        class="file-row-name uk-text-truncate"
        :filename="item.name"
        v-on="resourceNameEvents"
      >
        <oc-resource-name
          :full-path="item.path"
          :name="item.name"
          :extension="item.extension"
          :type="item.type"
        />
      </component>
      <div class="uk-text-meta">
        <oc-resource-size :size="item.size" /> - Last modified {{ formDateFromNow(item.mdate) }}
      </div>
    </div>
  </div>
</template>

<script>
import { getResourceIcon } from '../helpers/resources'
import { formDateFromNow } from '../helpers/date'

export default {
  name: 'Resource',

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    resourceIcon() {
      return getResourceIcon(this.item)
    },

    davUrl() {
      const davUrl = ['..', 'dav', 'files', this.$store.getters.user.id].join('/')

      return this.$client.files.getFileUrl(davUrl)
    },

    hasIndicators() {
      return this.indicators.length > 0
    },

    navigateButtonLabel() {
      return `Navigate into ${this.item.name}`
    },

    resourceNameProps() {
      if (this.item.type === 'folder') {
        return {
          ariaLabel: 'navigateButtonLabel',
          appearance: 'raw',
          variation: 'passive'
        }
      }

      return null
    },

    resourceNameEvents() {
      if (this.item.type === 'folder') {
        return { click: this.navigate }
      }

      return null
    }
  },

  mounted() {
    if (this.displayPreview) {
      this.loadPreview()
    } else {
      this.previewLoaded = 'disabled'
    }
  },

  methods: {
    formDateFromNow(date) {
      return formDateFromNow(date)
    },

    navigate() {
      this.$emit('navigate', this.item.path)
    }
  }
}
</script>
