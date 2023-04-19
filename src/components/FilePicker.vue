<template>
  <div class="oc-flex oc-height-1-1 oc-flex-column oc-overflow-hidden">
    <list-header
      data-testid="list-header"
      :current-folder="currentFolder"
      :is-select-btn-enabled="isSelectBtnEnabled"
      :is-select-btn-displayed="isSelectBtnDisplayed"
      :is-location-picker="isLocationPicker"
      :are-resources-selected="areResourcesSelected"
      :select-btn-label="selectBtnLabel"
      :cancel-btn-label="cancelBtnLabel"
      @select="emitSelectBtnClick"
      @cancel="emitCancel"
      @go-back="goBack"
    />
    <div
      v-if="state === 'loading'"
      key="loading-message"
      class="oc-flex oc-flex-1 oc-flex-middle oc-flex-center"
    >
      <oc-spinner :aria-label="$gettext('Loading resources')" />
    </div>

    <template v-if="state === 'loaded'">
      <spaces-list
        v-if="currentFolder === null && drives.length > 0"
        key="list-spaces"
        :spaces="spaces"
        @open-space="openSpace"
      />
      <list-resources
        v-else
        key="resources-list"
        data-testid="list-resources"
        class="oc-flex-1"
        :resources="resources"
        :is-location-picker="isLocationPicker"
        @openFolder="loadFolder"
        @selectResources="selectResources"
        @selectLocation="emitSelectBtnClick"
        @open-share="openShare"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, nextTick, Ref, ref } from 'vue'
import { client as webClient } from '@ownclouders/web-client'
import { webdav as initWebdav } from '@ownclouders/web-client/src/webdav'
import {
  buildShareSpaceResource,
  buildSpace as buildDrive,
  SpaceResource,
  User
} from '@ownclouders/web-client/src/helpers'
import { OwnCloudSdk } from '@ownclouders/web-client/src/types'
import { Capabilities } from '@ownclouders/web-client/src/ocs'

import { buildSharedResource } from '~/src/helpers/resources'
import { buildSpace, Space } from '~/src/helpers/spaces'

import useA11y from '~/src/composables/useA11y'

import ListResources from './ListResources.vue'
import ListHeader from './ListHeader.vue'
import SpacesList from './SpacesList.vue'

import { FilePickerConfig } from '~/types/file-picker'

export default defineComponent({
  name: 'FilePicker',

  components: { ListHeader, ListResources, SpacesList },

  props: {
    variation: {
      type: String,
      required: true,
      validator: (value) => value === 'resource' || value === 'location'
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
    isSelectBtnDisplayed: {
      type: Boolean,
      required: false,
      default: true
    },
    isInitialFocusEnabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  emits: ['select', 'cancel', 'update', 'folderLoaded'],

  setup(props, { emit }) {
    let currentSpace = null
    let isInitial = true

    const { proxy } = getCurrentInstance() || {}
    const { focusAndAnnounceBreadcrumb } = useA11y()

    const client = inject<Ref<ReturnType<typeof webClient>>>('client')
    const webdav = inject<Ref<ReturnType<typeof initWebdav>>>('webdav')
    const sdk = inject<Ref<OwnCloudSdk>>('sdk')
    const config = inject<Ref<FilePickerConfig>>('config')
    const user = inject<Ref<User>>('user')
    const capabilities = inject<Ref<Capabilities>>('capabilities')

    const state = ref('loading')
    const resources = ref([])
    const currentFolder = ref(null)
    const spaces = ref<Space[]>([])
    const drives = ref<SpaceResource[]>([])
    const selectedResources = ref([])

    const isLocationPicker = computed(() => props.variation === 'location')

    const areResourcesSelected = computed(() => selectedResources.value.length > 0)

    const isSelectBtnEnabled = computed(() => isLocationPicker.value || areResourcesSelected.value)

    const loadDrives = async () => {
      state.value = 'loading'

      try {
        const {
          data: { value }
        } = await client.value.graph.drives.listMyDrives('name')

        drives.value = value.map(buildDrive)
        spaces.value = value.filter((drive) => drive.driveType === 'project').map(buildSpace)
        state.value = 'loaded'

        if ((isInitial && props.isInitialFocusEnabled) || !isInitial) {
          nextTick(() => focusAndAnnounceBreadcrumb(resources.value.length))
        }

        isInitial = false
      } catch (error) {
        console.error(error)

        state.value = 'failed'
      }
    }

    const loadFolder = async (path: string) => {
      state.value = 'loading'

      try {
        const { resource, children } = await webdav.value.listFiles(currentSpace, { path })

        console.log(path, currentSpace.driveType)

        currentFolder.value =
          resource.path === '/' && currentSpace.driveType === 'personal'
            ? { ...resource, name: proxy?.$gettext('Personal') }
            : resource
        resources.value = children

        if (isLocationPicker.value) {
          emit('update', [currentFolder.value])
        }

        emit('folderLoaded', currentFolder.value)

        state.value = 'loaded'

        if ((isInitial && props.isInitialFocusEnabled) || !isInitial) {
          nextTick(() => focusAndAnnounceBreadcrumb(resources.value.length))
        }

        isInitial = false
      } catch (error) {
        console.error(error)

        state.value = 'failed'
      }
    }

    const openShare = ({ path, shareId }: { path: string; shareId: string }) => {
      const [shareName, ...item] = path.replace(/^[\/]/, '').split('/').slice(1)

      currentSpace = buildShareSpaceResource({
        shareId,
        serverUrl: config.value.server,
        shareName: encodeURIComponent(shareName)
      })

      loadFolder(item.join('/'))
    }

    const loadShares = async () => {
      const res = await sdk.value.shares.getShares('', { shared_with_me: true, state: 'accepted' })

      currentFolder.value = {
        name: proxy?.$gettext('Shares'),
        path: '/'
      }
      resources.value = res.map((share) => buildSharedResource(share.shareInfo))
    }

    const openSpace = (space: Space) => {
      if (space.id === 'shares') {
        loadShares()

        return
      }

      currentSpace =
        drives.value.find((drive) => {
          if (space.id === 'personal') {
            return drive.driveType === 'personal'
          }

          return drive.id === space.id
        }) || {}

      nextTick(() => {
        loadFolder('/')
      })
    }

    const goBack = () => {
      if (currentFolder.value === null) return

      if (currentFolder.value.path === '/') {
        if (currentSpace?.driveType === 'share') {
          loadShares()

          nextTick(() => {
            currentSpace = null
          })

          return
        }

        currentFolder.value = null
        currentSpace = null

        return
      }

      const parentFolderPath = currentFolder.value.path.slice(
        0,
        currentFolder.value.path.lastIndexOf('/')
      )

      loadFolder(parentFolderPath)
    }

    const selectResources = (resources) => {
      selectedResources.value = resources
      emit('update', resources)
    }

    const emitSelectBtnClick = () => {
      const resources =
        selectedResources.value.length < 1 && isLocationPicker.value
          ? [currentFolder.value]
          : selectedResources.value

      emit('select', resources)
    }

    const emitCancel = () => {
      emit('cancel')
    }

    // Init
    if (capabilities.value.capabilities.spaces?.enabled) {
      loadDrives()
    } else {
      currentSpace = buildDrive({
        id: user.value.id,
        driveAlias: `personal/${user.value.id}`,
        driveType: 'personal',
        name: proxy?.$gettext('All Files') || 'All Files',
        serverUrl: config.value.server,
        webDavPath: `/files/${user.value.id}`
      })

      nextTick(() => {
        loadFolder('/')
      })
    }

    return {
      state,
      resources,
      currentFolder,
      spaces,
      drives,
      isSelectBtnEnabled,
      isLocationPicker,
      areResourcesSelected,
      openSpace,
      loadFolder,
      openShare,
      goBack,
      selectResources,
      emitSelectBtnClick,
      emitCancel
    }
  }
})
</script>
