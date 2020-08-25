import moment from 'moment'
import { uniqueId, chain } from 'lodash'
import filesize from 'filesize'
import fileTypeIconMappings from './fileTypeIconMappings.json'

function _extName(fileName) {
  let ext = ''
  const ex = fileName.match(/\.[0-9a-z]+$/i)
  if (ex) {
    ext = ex[0].substr(1)
  }
  return ext
}

export function buildResource(resource) {
  const ext = resource.type !== 'dir' ? _extName(resource.name) : ''
  return {
    type: resource.type === 'dir' ? 'folder' : resource.type,
    // actual file id (string)
    id: resource.fileInfo['{http://owncloud.org/ns}fileid'],
    // temporary list id, to be used for view only and for uniqueness inside the list
    viewId: uniqueId('file-'),
    starred: resource.fileInfo['{http://owncloud.org/ns}favorite'] !== '0',
    mdate: resource.fileInfo['{DAV:}getlastmodified'],
    mdateMoment: moment(resource.fileInfo['{DAV:}getlastmodified']),
    size: (function() {
      if (resource.type === 'dir') {
        return resource.fileInfo['{http://owncloud.org/ns}size']
      } else {
        return resource.fileInfo['{DAV:}getcontentlength']
      }
    })(),
    extension: (function() {
      return ext
    })(),
    name: (function() {
      const pathList = resource.name.split('/').filter(e => e !== '')
      return pathList.length === 0 ? '' : pathList[pathList.length - 1]
    })(),
    basename: (function() {
      const pathList = resource.name.split('/').filter(e => e !== '')
      const name = pathList.length === 0 ? '' : pathList[pathList.length - 1]
      // FIXME: this is really just a view/formatting thing, should better
      // be processed at render time instead of storing an extra value
      if (ext) {
        return name.substring(0, name.length - ext.length - 1)
      }
      return name
    })(),
    path: resource.name,
    permissions: resource.fileInfo['{http://owncloud.org/ns}permissions'] || '',
    etag: resource.fileInfo['{DAV:}getetag'],
    sharePermissions:
      resource.fileInfo['{http://open-collaboration-services.org/ns}share-permissions'],
    shareTypes: (function() {
      let shareTypes = resource.fileInfo['{http://owncloud.org/ns}share-types']
      if (shareTypes) {
        shareTypes = chain(shareTypes)
          .filter(
            xmlvalue =>
              xmlvalue.namespaceURI === 'http://owncloud.org/ns' &&
              xmlvalue.nodeName.split(':')[1] === 'share-type'
          )
          .map(xmlvalue => parseInt(xmlvalue.textContent || xmlvalue.text, 10))
          .value()
      }
      return shareTypes || []
    })(),
    privateLink: resource.fileInfo['{http://owncloud.org/ns}privatelink'],
    owner: {
      username: resource.fileInfo['{http://owncloud.org/ns}owner-id'],
      displayName: resource.fileInfo['{http://owncloud.org/ns}owner-display-name']
    },
    canUpload: function() {
      return this.permissions.indexOf('C') >= 0
    },
    canDownload: function() {
      return this.type !== 'folder'
    },
    canBeDeleted: function() {
      return this.permissions.indexOf('D') >= 0
    },
    canRename: function() {
      return this.permissions.indexOf('N') >= 0
    },
    canShare: function() {
      return this.permissions.indexOf('R') >= 0
    },
    canCreate: function() {
      return this.permissions.indexOf('C') >= 0
    },
    isMounted: function() {
      return this.permissions.indexOf('M') >= 0
    },
    isReceivedShare: function() {
      return this.permissions.indexOf('S') >= 0
    }
  }
}

export function getResourceIcon(resource) {
  if (resource) {
    if (resource.type === 'folder') {
      return 'folder'
    }
    const icon = fileTypeIconMappings[resource.extension.toLowerCase()]
    if (icon) return `${icon}`
  }
  return 'x-office-document'
}

export function getResourceSize(size) {
  if (size < 0) {
    return ''
  }

  if (isNaN(size)) {
    return '?'
  }

  const mb = 1048576

  // TODO: Pass current language as locale to display correct separator
  return filesize(size, {
    round: size < mb ? 0 : 1
  })
}
