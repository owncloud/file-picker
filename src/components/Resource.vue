<template>
  <!-- FIXME: oc-file class is adding underline effect which is not desired when the resource type is file
  Adding this class only when it's folder looks wrong though -->
  <div class="uk-flex-inline uk-flex-middle" :class="{ 'oc-file': item.type === 'folder' }">
    <oc-icon
      key="resource-icon"
      :name="resourceIcon"
      size="medium"
      aria-hidden="true"
      class="uk-margin-small-right"
    />
    <div class="uk-width-expand">
      <div class="file-row-name uk-text-truncate" :filename="item.name" @click="navigate">
        <span
          class="uk-text-bold oc-cursor-pointer oc-file-name uk-padding-remove-left"
          role="button"
          v-text="fileName"
        /><span
          v-if="item.extension"
          class="uk-text-meta oc-file-extension"
          v-text="'.' + item.extension"
        />
      </div>
      <div class="uk-text-meta">
        {{ getResourceSize(item.size) }} - Last modified
        {{ formDateFromNow(item.mdate) }}
      </div>
    </div>
  </div>
</template>

<script>
import { getResourceIcon, getResourceSize } from '../helpers/resources'
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
    fileName() {
      return this.item.basename
    },

    resourceIcon() {
      return getResourceIcon(this.item)
    },

    davUrl() {
      const davUrl = ['..', 'dav', 'files', this.$store.getters.user.id].join('/')

      return this.$client.files.getFileUrl(davUrl)
    },

    hasIndicators() {
      return this.indicators.length > 0
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
    getResourceSize(size) {
      return getResourceSize(size)
    },

    formDateFromNow(date) {
      return formDateFromNow(date)
    },

    navigate() {
      if (this.item.type !== 'folder') {
        return
      }

      this.$emit('navigate', this.item.path)
    }
  }
}
</script>
