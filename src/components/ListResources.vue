<template>
  <oc-table-simple data-testid="list-resources-table">
    <oc-tr
      v-for="resource in resources"
      :key="resource.viewId"
      :class="rowClasses(resource)"
      :data-testid="`list-resources-row-${resource.id}`"
      v-bind="bindRowProps(resource.name)"
      @click.native="toggleResourceSelection(resource)"
      @keydown.enter.native="toggleResourceSelection(resource)"
    >
      <oc-td v-if="!isLocationPicker" class="oc-pm" width="shrink">
        <oc-checkbox
          class="file-picker-resource-checkbox uk-margin-small-left"
          :data-testid="`list-resources-checkbox-${resource.id}`"
          :value="isResourceSelected(resource)"
          :label="selectLabel(resource.name)"
          :hide-label="true"
          @click.native.stop
          @input="toggleResourceSelection(resource)"
        />
      </oc-td>
      <oc-td class="oc-pm">
        <resource
          class="file-picker-resource uk-width-auto"
          :item="resource"
          @navigate="openFolder"
        />
      </oc-td>
    </oc-tr>
  </oc-table-simple>
</template>

<script>
import path from 'path'

import { sortByName } from '../helpers/sort'

import Resource from './Resource.vue'

export default {
  name: 'ListResources',

  components: {
    Resource,
  },

  props: {
    resources: {
      type: Array,
      required: true,
    },
    isLocationPicker: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data: () => ({
    selectedResources: [],
  }),

  computed: {
    resourcesSorted() {
      return this.sortResources(this.resources)
    },
  },

  methods: {
    openFolder(path) {
      this.resetResourceSelection()
      this.$emit('openFolder', path)
    },

    toggleResourceSelection(resource) {
      if (this.isRowDisabled(resource)) {
        return
      }

      if (this.isResourceSelected(resource)) {
        // Always pass as an array so the final product doesn't have to differentiate between two different types
        this.isLocationPicker
          ? (this.selectedResources = [])
          : this.selectedResources.splice(this.selectedResources.indexOf(resource), 1)
      } else {
        this.isLocationPicker
          ? (this.selectedResources = [resource])
          : this.selectedResources.push(resource)
      }

      this.$emit('selectResources', this.selectedResources)
    },

    selectLabel(name) {
      const translated = this.$gettext('Select %{ name }')

      return this.$gettextInterpolate(translated, { name: path.basename(name) })
    },

    isResourceSelected(resource) {
      return this.selectedResources.indexOf(resource) > -1
    },

    isRowDisabled(resource) {
      if (this.isLocationPicker) {
        return resource.type !== 'folder' || resource.canCreate() === false
      }

      return resource.canShare() === false
    },

    rowClasses(resource) {
      const classes = ['oc-file-picker-row']

      if (this.isResourceSelected(resource)) {
        classes.push('oc-background-selected')
      }

      this.isRowDisabled(resource)
        ? classes.push('files-list-row-disabled')
        : classes.push('oc-cursor-pointer')

      return classes
    },

    sortResources(resources) {
      return resources.sort(sortByName)
    },

    resetResourceSelection() {
      this.selectedResources = []
      this.$emit('selectResources', [])
    },

    bindRowProps(path) {
      if (this.isLocationPicker) {
        return { 'aria-label': this.selectLabel(path), tabindex: '0' }
      }

      return null
    },
  },
}
</script>

<style>
.files-list-row-disabled {
  opacity: 0.3;
  pointer-events: none;
}
</style>
