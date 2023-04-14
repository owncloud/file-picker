<template>
  <oc-list>
    <li class="oc-p-m">
      <button class="btn-space" @click="() => openSpace('personal', $gettext('Personal'))">
        <oc-icon name="resource-type-folder" color="var(--oc-color-icon-folder)" size="large" />
        <span v-text="$gettext('Personal')" />
      </button>
    </li>
    <li class="oc-border-t oc-p-m">
      <button class="btn-space" @click="() => openSpace('shares', $gettext('Shares'))">
        <oc-icon name="resource-type-folder" color="var(--oc-color-icon-folder)" size="large" />
        <span v-text="$gettext('Shares')" />
      </button>
    </li>
    <li v-for="space in spaces" :key="space.id" class="oc-border-t oc-p-m">
      <button class="btn-space" @click="() => openSpace(space.id, space.name)">
        <oc-icon name="layout-grid" size="large" />
        <span v-text="space.name" />
      </button>
    </li>
  </oc-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PropType } from 'vue/types/v3-component-props'

import { Space } from '~/src/helpers/spaces'

export default defineComponent({
  props: {
    spaces: { type: Array as PropType<Space[]>, required: true }
  },

  emits: ['open-space'],

  setup(props, { emit }) {
    const openSpace = (spaceId: string, spaceName: string) => {
      emit('open-space', { id: spaceId, name: spaceName })
    }

    return { openSpace }
  }
})
</script>

<style scoped lang="scss">
.btn-space {
  align-items: center;
  background: transparent;
  border: none;
  display: flex;
  gap: 0.5rem;
  padding: 0;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
