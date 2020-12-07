<template>
  <header class="uk-background-primary uk-padding-small uk-flex uk-flex-middle uk-flex-between">
    <!-- TODO: Use icon instead of "Home" text -->
    <oc-breadcrumb class="oc-light" :items="breadcrumbsItems" />
    <div>
      <oc-button
        class="file-picker-btn-select-resources"
        variation="primary"
        :disabled="!isSelectBtnEnabled"
        :uk-tooltip="disabledSelectBtnTooltip"
        @click="select"
      >
        {{ selectBtnLabel }}
      </oc-button>
    </div>
  </header>
</template>

<script>
import path from 'path'

export default {
  name: 'ListHeader',

  props: {
    currentFolder: {
      type: Object,
      required: false,
      default: () => null
    },
    isSelectBtnEnabled: {
      type: Boolean,
      required: true
    },
    isLocationPicker: {
      type: Boolean,
      required: true
    },
    areResourcesSelected: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    breadcrumbsItems() {
      let breadcrumbs = [
        {
          text: 'Home',
          onClick: () => this.openFolder('/')
        }
      ]

      if (!this.currentFolder) {
        return breadcrumbs
      }

      const pathSplit = this.currentFolder.path ? this.currentFolder.path.split('/') : []

      for (let i = 1; i < pathSplit.length; i++) {
        let itemPath = encodeURIComponent(path.join.apply(null, pathSplit.slice(0, i + 1)))

        if (i === pathSplit.length - 1) {
          itemPath = null
        }

        breadcrumbs.push({
          index: i,
          text: pathSplit.slice(0, i + 1)[i],
          onClick: () => this.openFolder(itemPath)
        })
      }

      return breadcrumbs
    },

    disabledSelectBtnTooltip() {
      if (this.isSelectBtnEnabled) {
        return null
      }

      return 'Please select at least one resource. You can select a resource by clicking on its row or via its checkbox.'
    },

    selectBtnLabel() {
      if (this.isLocationPicker) {
        return this.areResourcesSelected ? 'Select folder' : 'Select current folder'
      }

      return 'Select resources'
    }
  },

  methods: {
    openFolder(path) {
      this.$emit('openFolder', path)
    },

    select() {
      this.$emit('select')
    }
  }
}
</script>

<style>
/* TODO: Move to ODS */
.oc-light .oc-breadcrumb-list-item > a,
.oc-light .oc-breadcrumb-list-item .oc-icon > svg,
.oc-light .oc-breadcrumb-list-item::before {
  color: white !important;
  fill: white;
}
</style>
