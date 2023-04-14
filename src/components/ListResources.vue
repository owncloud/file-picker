<template>
  <oc-table-simple data-testid="list-resources-table">
    <oc-tr
      v-for="resource in resources"
      :key="resource.fileId"
      :class="rowClasses(resource)"
      :data-testid="`list-resources-row-${resource.id}`"
      @click.native="() => toggleResourceSelection(resource)"
    >
      <oc-td class="oc-pm oc-display-relative" width="shrink">
        <oc-checkbox
          v-if="!isLocationPicker"
          class="file-picker-resource-checkbox uk-margin-small-left"
          :data-testid="`list-resources-checkbox-${resource.id}`"
          :value="isResourceSelected(resource)"
          :label="selectLabel(resource.name)"
          :hide-label="true"
          @click.native.stop
          @input="() => toggleResourceSelection(resource)"
        />
        <button
          v-else-if="isLocationPicker && resource.type === 'folder'"
          class="file-picker-btn-sr-select"
          tabindex="0"
          @click="() => selectLocation(resource)"
          v-text="selectLabel(resource.name)"
        />
      </oc-td>
      <oc-td class="oc-py-m oc-pr-m">
        <base-resource
          data-testid="resource"
          class="uk-width-auto"
          :resource="resource"
          @navigate="openFolder"
          @open-share="openShare"
        />
      </oc-td>
    </oc-tr>
  </oc-table-simple>
</template>

<script lang="ts">
import path from 'path'
import { computed, defineComponent, getCurrentInstance, PropType, ref } from 'vue'
import { Resource } from '@ownclouders/web-client'

import { sortByName } from '../helpers/sort'

import BaseResource from '~/src/components/BaseResource.vue'

export default defineComponent({
  components: { BaseResource },

  props: {
    resources: {
      type: Array as PropType<Resource[]>,
      required: true
    },
    isLocationPicker: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  emits: ['selectResources', 'openFolder', 'selectLocation', 'open-share'],

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() || {}

    const selectedResources = ref([])

    const resourcesSorted = computed(() => sortResources(props.resources))

    const resetResourceSelection = () => {
      selectedResources.value = []
      emit('selectResources', [])
    }

    const openFolder = (path: string) => {
      resetResourceSelection()
      emit('openFolder', path)
    }

    const openShare = (share: { path: string; shareId: string }) => {
      resetResourceSelection()
      emit('open-share', share)
    }

    const toggleResourceSelection = (resource) => {
      if (isRowDisabled(resource)) return

      if (isResourceSelected(resource)) {
        // Always pass as an array so the final product doesn't have to differentiate between two different types
        props.isLocationPicker
          ? (selectedResources.value = [])
          : selectedResources.value.splice(selectedResources.value.indexOf(resource), 1)
      } else {
        props.isLocationPicker
          ? (selectedResources.value = [resource])
          : selectedResources.value.push(resource)
      }

      emit('selectResources', selectedResources.value)
    }

    const selectLabel = (name) => {
      const translated = proxy?.$gettext('Select %{ name }')

      return proxy.$gettextInterpolate(translated, { name: path.basename(name) })
    }

    const isResourceSelected = (resource) => {
      return selectedResources.value.indexOf(resource) > -1
    }

    const isRowDisabled = (resource) => {
      if (props.isLocationPicker) {
        return resource.type !== 'folder' || resource.canCreate() === false
      }

      return resource.canShare() === false
    }

    const rowClasses = (resource) => {
      const classes = ['oc-file-picker-row']

      if (isResourceSelected(resource)) {
        classes.push('oc-background-selected')
      }

      isRowDisabled(resource)
        ? classes.push('files-list-row-disabled')
        : classes.push('oc-cursor-pointer')

      return classes
    }

    const sortResources = (resources) => {
      return resources.sort(sortByName)
    }

    const selectLocation = (location) => {
      emit('selectLocation', [location])
    }

    return {
      selectedResources,
      resourcesSorted,
      openFolder,
      openShare,
      selectLocation,
      rowClasses,
      selectLabel,
      toggleResourceSelection,
      isResourceSelected
    }
  }
})
</script>

<style lang="scss">
.files-list-row-disabled {
  opacity: 0.3;
  pointer-events: none;
}

.file-picker-btn-sr-select {
  position: absolute;
  z-index: -1;
  top: var(--oc-space-xsmall);
  left: var(--oc-space-xsmall);
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;

  &:focus {
    opacity: 1;
    z-index: 1;
    pointer-events: auto;
  }
}
</style>
