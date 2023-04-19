import path from 'path'
import { Resource } from '@ownclouders/web-client'
import {
  SHARE_JAIL_ID,
  buildWebDavSpacesPath,
  extractDomSelector,
  extractExtensionFromFile,
  extractStorageId
} from '@ownclouders/web-client/src/helpers'
import {
  LinkShareRoles,
  PeopleShareRoles,
  Share,
  SharePermissions,
  ShareStatus,
  ShareTypes,
  buildSpaceShare
} from '@ownclouders/web-client/src/helpers/share'
import { DateTime } from 'luxon'

function _fixAdditionalInfo(data) {
  if (typeof data !== 'string') {
    return null
  }
  return data
}

export function buildWebDavFilesPath(userId: string, path: string): string {
  return '/' + `files/${userId}/${path}`.split('/').filter(Boolean).join('/')
}

export function buildCollaboratorShare(s, file, allowSharePermission): Share {
  const share: Share = {
    shareType: parseInt(s.share_type),
    id: s.id,
    itemSource: s.item_source,
    file: {
      parent: s.file_parent,
      source: s.file_source,
      target: s.file_target
    }
  }
  if (
    ShareTypes.containsAnyValue(
      [ShareTypes.user, ShareTypes.remote, ShareTypes.group, ShareTypes.guest],
      [share.shareType]
    )
  ) {
    // FIXME: SDK is returning empty object for additional info when empty
    share.collaborator = {
      name: s.share_with,
      displayName: s.share_with_displayname,
      additionalInfo: _fixAdditionalInfo(s.share_with_additional_info)
    }
    share.owner = {
      name: s.uid_owner,
      displayName: s.displayname_owner,
      additionalInfo: _fixAdditionalInfo(s.additional_info_owner)
    }
    share.fileOwner = {
      name: s.uid_file_owner,
      displayName: s.displayname_file_owner,
      additionalInfo: _fixAdditionalInfo(s.additional_info_file_owner)
    }
    share.stime = s.stime
    share.permissions = parseInt(s.permissions)
    share.customPermissions = SharePermissions.bitmaskToPermissions(s.permissions)
    share.role = PeopleShareRoles.getByBitmask(
      parseInt(s.permissions),
      file.isFolder || file.type === 'folder',
      allowSharePermission
    )
    // share.email = 'foo@djungle.com' // hm, where do we get the mail from? share_with_additional_info:Object?
  }

  // expiration:Object if unset, or string "2019-04-24 00:00:00"
  if (typeof s.expiration === 'string' || s.expiration instanceof String) {
    share.expires = new Date(s.expiration)
  }
  share.path = s.path

  return share
}

function _buildLink(link): Share {
  let description = ''
  const permissions = parseInt(link.permissions)

  const role = LinkShareRoles.getByBitmask(permissions, link.item_type === 'folder')
  if (role) {
    description = role.label
  }

  const quicklinkOc10 = ((): boolean => {
    if (typeof link.attributes !== 'string') {
      return false
    }

    return (
      JSON.parse(link.attributes || '[]').find((attr) => attr.key === 'isQuickLink')?.enabled ===
      'true'
    )
  })()
  const quicklinkOcis = link.quicklink === 'true'
  const quicklink = quicklinkOc10 || quicklinkOcis

  return {
    shareType: parseInt(link.share_type),
    id: link.id,
    token: link.token as string,
    url: link.url,
    path: link.path,
    permissions,
    description,
    quicklink,
    stime: link.stime,
    name: typeof link.name === 'string' ? link.name : (link.token as string),
    password: !!(link.share_with && link.share_with_displayname),
    expiration:
      typeof link.expiration === 'string'
        ? DateTime.fromFormat(link.expiration, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy-MM-dd')
        : null,
    itemSource: link.item_source,
    file: {
      parent: link.file_parent,
      source: link.file_source,
      target: link.file_target
    }
  }
}

export function buildShare(s, file, allowSharePermission): Share {
  if (parseInt(s.share_type) === ShareTypes.link.value) {
    return _buildLink(s)
  }
  if ([ShareTypes.spaceUser.value, ShareTypes.spaceGroup.value].includes(parseInt(s.share_type))) {
    return buildSpaceShare(s, file)
  }

  return buildCollaboratorShare(s, file, allowSharePermission)
}

export function buildSharedResource(
  share,
  incomingShares = false,
  allowSharePermission = true,
  hasShareJail = false
): Resource {
  const isFolder = share.item_type === 'folder'
  let resource: Resource = {
    id: share.id,
    fileId: share.item_source,
    storageId: extractStorageId(share.item_source),
    parentFolderId: share.file_parent,
    type: share.item_type,
    mimeType: share.mimetype,
    isFolder,
    sdate: DateTime.fromSeconds(parseInt(share.stime)).toRFC2822(),
    indicators: [],
    tags: [],
    path: undefined,
    webDavPath: undefined
  }

  if (incomingShares) {
    resource.resourceOwner = {
      username: share.uid_file_owner as string,
      displayName: share.displayname_file_owner as string
    }
    resource.owner = [
      {
        username: share.uid_owner as string,
        displayName: share.displayname_owner as string,
        avatar: undefined,
        shareType: ShareTypes.user.value
      }
    ]
    resource.sharedWith = share.sharedWith || []
    resource.status = parseInt(share.state)
    resource.name = path.basename(share.file_target)
    if (hasShareJail) {
      // FIXME, HACK 1: path needs to be '/' because the share has it's own webdav endpoint (we access it's root). should ideally be removed backend side.
      // FIXME, HACK 2: webDavPath points to `files/<user>/Shares/xyz` but now needs to point to a shares webdav root. should ideally be changed backend side.
      resource.path = '/'
      resource.webDavPath = buildWebDavSpacesPath([SHARE_JAIL_ID, resource.id].join('!'), '/')
    } else {
      resource.path = share.file_target
      resource.webDavPath = buildWebDavFilesPath(share.share_with, share.file_target)
    }
    resource.canDownload = () => parseInt(share.state) === ShareStatus.accepted
    resource.canShare = () => SharePermissions.share.enabled(share.permissions)
    resource.canRename = () => parseInt(share.state) === ShareStatus.accepted
    resource.canBeDeleted = () => SharePermissions.delete.enabled(share.permissions)
    resource.canEditTags = () =>
      parseInt(share.state) === ShareStatus.accepted &&
      SharePermissions.update.enabled(share.permissions)
  } else {
    resource.sharedWith = share.sharedWith || []
    resource.shareOwner = share.uid_owner
    resource.shareOwnerDisplayname = share.displayname_owner
    resource.name = path.basename(share.path)
    resource.path = share.path
    resource.webDavPath = hasShareJail
      ? buildWebDavSpacesPath(resource.storageId, share.path)
      : buildWebDavFilesPath(share.uid_owner, share.path)
    resource.canDownload = () => true
    resource.canShare = () => true
    resource.canRename = () => true
    resource.canBeDeleted = () => true
    resource.canEditTags = () => true
  }

  resource.extension = extractExtensionFromFile(resource)
  resource.isReceivedShare = () => incomingShares
  resource.canUpload = () => SharePermissions.create.enabled(share.permissions)
  resource.isMounted = () => false
  resource.share = buildShare(share, resource, allowSharePermission)
  resource.canDeny = () => SharePermissions.denied.enabled(share.permissions)
  resource.getDomSelector = () => extractDomSelector(share.id)

  if (share.matchingSpace) {
    resource = { ...resource, ...share.matchingSpace }
  }

  return resource
}
