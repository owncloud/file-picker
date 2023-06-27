<template>
  <header class="file-picker-header oc-p-m oc-flex oc-flex-middle oc-flex-between">
    <div class="oc-flex oc-flex-middle oc-button-gap-m">
      <button
        v-if="currentFolder !== null"
        data-testid="btn-return"
        class="btn-return"
        :aria-label="$gettext('Go back')"
        @click="emitGoBack"
      >
        <oc-icon name="arrow-drop-left" size="large" fill-type="line" />
      </button>
      <h1
        data-testid="title-folder"
        class="oc-text-normal oc-text-medium oc-my-rm"
        v-text="folderName"
      />
    </div>

    <div v-if="cancelBtnLabel || isSelectBtnDisplayed">
      <oc-button
        v-if="cancelBtnLabel"
        data-testid="list-header-btn-cancel"
        class="file-picker-btn-cancel oc-margin-small-right"
        @click="cancel"
      >
        {{ cancelBtnLabel }}
      </oc-button>
      <oc-button
        v-if="isSelectBtnDisplayed"
        v-oc-tooltip="disabledSelectBtnTooltip"
        data-testid="list-header-btn-select"
        class="file-picker-btn-select-resources"
        variation="primary"
        appearance="filled"
        :disabled="!isSelectBtnEnabled"
        @click="select"
      >
        {{ submitBtnLabel }}
      </oc-button>
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, Ref } from 'vue'
import { Capabilities } from '@ownclouders/web-client/src/ocs'

export default defineComponent({
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
    isSelectBtnDisplayed: {
      type: Boolean,
      required: false,
      default: true
    },
    selectBtnLabel: {
      type: String,
      required: false,
      default: null
    },
    cancelBtnLabel: {
      type: String,
      required: false,
      default: null
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

  emits: ['go-back', 'select', 'cancel'],

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() || {}

    const capabilities = inject<Ref<Capabilities>>('capabilities')

    const folderName = computed(() => {
      if (props.currentFolder !== null) return props.currentFolder.name

      return capabilities.value.capabilities.spaces?.enabled
        ? proxy?.$gettext('Files')
        : proxy?.$gettext('All Files')
    })

    const disabledSelectBtnTooltip = computed(() => {
      if (props.isSelectBtnEnabled) return null

      return proxy?.$gettext(
        'Please, select at least one resource. You can select a resource by clicking on its row or via its checkbox.'
      )
    })

    const submitBtnLabel = computed(() => {
      if (props.selectBtnLabel) return props.selectBtnLabel

      if (props.isLocationPicker) {
        return props.areResourcesSelected
          ? proxy?.$gettext('Select folder')
          : proxy?.$gettext('Select current folder')
      }

      return proxy?.$gettext('Choose')
    })

    const emitGoBack = () => {
      emit('go-back')
    }

    const select = () => {
      emit('select')
    }

    const cancel = () => {
      emit('cancel')
    }

    return { folderName, disabledSelectBtnTooltip, submitBtnLabel, emitGoBack, select, cancel }
  }
})
</script>

<style lang="scss" scoped>
.btn-return {
  align-items: center;
  background: transparent;
  border: none;
  display: flex;
  padding: 0;

  &:hover {
    cursor: pointer;
  }
}
</style>
