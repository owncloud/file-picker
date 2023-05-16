---
title: "Accessing Resources"
date: 2020-08-26T10:56:03
weight: 4
geekdocRepo: https://github.com/owncloud/file-picker
geekdocEditPath: edit/master/docs
geekdocFilePath: accessing-resources.md
---

{{< toc >}}

If using File picker as a web component, it is returning selected resources via events called `select` and `update`. To access them, you need to set an event listener where you'll be able to get them as part of the response of the callback function.

## Access resources
```html
<file-picker id="file-picker" variation="resource"></file-picker>

<script>
  const item = document.getElementById('file-picker')
  let resources = []

  item.addEventListener('select', event => {
    resources = event.detail[0]
  })
</script>
```

## Perform actions with selected resources
Below is an example code demonstrating how to upload files to the selected location using the File picker, leveraging the [tus-js-client](https://github.com/tus/tus-js-client) library.

```html
<file-picker id="file-picker" variation="resource"></file-picker>

<script>
  const filePicker = document.querySelector('#file-picker')
  const baseURL = 'https://<your-owncloud-server-domain>/remote.php/dav'

  // A mocked file to upload
  const file = new File(['Hello world!'], 'my-upload-file.md', { type: 'text/markdown' })

  // This will be assigned a value once the token inside the File picker is set
  let accessToken = ''

  filePicker.addEventListener('select', (event) => {
    // Select the resource from the event payloads
    const resource = event.detail[0][0]

    // Create a new tus upload
    const upload = new tus.Upload(file, {
      endpoint: baseURL + resource.webDavPath,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      headers: {
        Authorization: accessToken
      },
      onError: function (error) {
        console.log('Failed because: ' + error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

        console.log(bytesUploaded, bytesTotal, percentage + '%')
      },
      onSuccess: function () {
        console.log('File %s successfully uploaded into %s', upload.file.name, upload.url)
      },
    })

    // Start the upload
    upload.start()
  })

  // Setup a listener that will get the access token necessary to upload the file
  filePicker.addEventListener('token', (event) => {
    accessToken = 'Bearer ' + event.detail[0]
  })
</script>
```