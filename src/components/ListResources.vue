<template>
  <RecycleScroller
    v-if="resources.length"
    v-slot="{ item: rowItem, index, active }"
    :key="resources.length"
    :items="resourcesSorted"
    :item-size="68"
  >
    <div
      :key="rowItem.viewId"
      :data-is-visible="active"
      :class="rowClasses(rowItem)"
      @click="toggleResourceSelection(rowItem)"
    >
      <oc-grid
        :id="'file-row-' + rowItem.id"
        :ref="index === 0 ? 'firstRow' : null"
        gutter="small"
        flex
        class="uk-padding-small oc-border-top"
      >
        <div v-if="!isLocationPicker">
          <oc-checkbox
            class="uk-margin-small-left"
            :value="isResourceSelected(rowItem)"
            :label="selectCheckboxLabel(rowItem.name)"
            :hide-label="true"
            @click.stop
            @change.native="toggleResourceSelection(rowItem)"
          />
        </div>
        <resource class="uk-width-auto" :item="rowItem" @navigate="openFolder" />
      </oc-grid>
    </div>
  </RecycleScroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import { sortByName } from '../helpers/sort'
import Resource from './Resource.vue'

export default {
  name: 'ListResources',

  components: {
    RecycleScroller,
    Resource
  },

  props: {
    resources: {
      type: Array,
      required: true
    },
    isLocationPicker: {
      type: Boolean,
      required: false,
      default: false
    },
    currentFolder: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    selectedResources: []
  }),

  computed: {
    resourcesSorted() {
      return this.sortResources(this.resources)
    }
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

    selectCheckboxLabel(name) {
      return `Select ${name}`
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
      const classes = []

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
    }
  }
}
</script>

<style scoped>
@import '../../node_modules/vue-virtual-scroller/dist/vue-virtual-scroller.css';

.files-list-row-disabled {
  opacity: 0.3;
  pointer-events: none;
}
</style>
