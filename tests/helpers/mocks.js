import moment from 'moment'

const getCurrentDate = () => {
  return moment().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT'
}

export const testResources = [
  {
    name: '',
    type: 'dir',
    fileInfo: {
      '{http://owncloud.org/ns}permissions': 'NVCK',
      '{http://owncloud.org/ns}favorite': '0',
      '{http://owncloud.org/ns}fileid': '144055',
      '{http://owncloud.org/ns}owner-id': 'alice',
      '{http://owncloud.org/ns}owner-display-name': 'alice',
      '{http://owncloud.org/ns}share-types': '',
      '{http://owncloud.org/ns}privatelink': 'http://host.docker.internal:8080/f/144055',
      '{http://owncloud.org/ns}size': '7505867',
      '{DAV:}getlastmodified': getCurrentDate(),
      '{DAV:}getetag': '"5fc4c975019f9"',
      '{DAV:}resourcetype': [{}]
    },
    tusSupport: null
  },
  {
    name: '/Documents',
    type: 'dir',
    fileInfo: {
      '{http://owncloud.org/ns}permissions': 'RDNVCK',
      '{http://owncloud.org/ns}favorite': '0',
      '{http://owncloud.org/ns}fileid': '144227',
      '{http://owncloud.org/ns}owner-id': 'alice',
      '{http://owncloud.org/ns}owner-display-name': 'alice',
      '{http://owncloud.org/ns}share-types': '',
      '{http://owncloud.org/ns}privatelink': 'http://host.docker.internal:8080/f/144227',
      '{http://owncloud.org/ns}size': '0',
      '{DAV:}getlastmodified': getCurrentDate(),
      '{DAV:}getetag': '"5fb64a9d08be7"',
      '{DAV:}resourcetype': [{}]
    },
    tusSupport: null
  },
  {
    name: '/Photos',
    type: 'dir',
    fileInfo: {
      '{http://owncloud.org/ns}permissions': 'RDNVCK',
      '{http://owncloud.org/ns}favorite': '0',
      '{http://owncloud.org/ns}fileid': '144228',
      '{http://owncloud.org/ns}owner-id': 'alice',
      '{http://owncloud.org/ns}owner-display-name': 'alice',
      '{http://owncloud.org/ns}share-types': '',
      '{http://owncloud.org/ns}privatelink': 'http://host.docker.internal:8080/f/144228',
      '{http://owncloud.org/ns}size': '1395095',
      '{DAV:}getlastmodified': getCurrentDate(),
      '{DAV:}getetag': '"5fb64b0c5ba65"',
      '{DAV:}resourcetype': [{}]
    },
    tusSupport: null
  },
  {
    name: '/ownCloud Manual.pdf',
    type: 'file',
    fileInfo: {
      '{http://owncloud.org/ns}permissions': 'RDNVW',
      '{http://owncloud.org/ns}favorite': '0',
      '{http://owncloud.org/ns}fileid': '144242',
      '{http://owncloud.org/ns}owner-id': 'alice',
      '{http://owncloud.org/ns}owner-display-name': 'alice',
      '{http://owncloud.org/ns}share-types': '',
      '{http://owncloud.org/ns}privatelink': 'http://host.docker.internal:8080/f/144242',
      '{DAV:}getcontentlength': '6110772',
      '{http://owncloud.org/ns}size': '6110772',
      '{DAV:}getlastmodified': getCurrentDate(),
      '{DAV:}getetag': '"4b585b2818ce17bd711919b56d1bdaf2"',
      '{DAV:}resourcetype': ''
    },
    tusSupport: null
  }
]

export const listResources = () => {
  return new Promise(resolve => {
    resolve(testResources)
  })
}
