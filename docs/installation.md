---
title: "Installation"
date: 2020-08-26T10:56:03
weight: 3
geekdocRepo: https://github.com/owncloud/file-picker
geekdocEditPath: edit/master/docs
geekdocFilePath: installation.md
---

{{< toc >}}

## Setup authorization
The config for authorization is provided via a json file. Location of the file can be provided via a prop called `configLocation`. This requires full URL address (e.g. `https://<your-server>/<path-to-the-config>`). If the prop is not defined, the location will fallback to `https://<your-server>/file-picker-config.json`. The config can point to both oauth2 and OIDC. You can take a look at the following example to see how OIDC can be defined:

```json
{
  "server": "<owncloud-server>",
  "openIdConnect": {
    "metadata_url": "<your-server>/.well-known/openid-configuration",
    "authority": "<your-server>",
    "client_id": "<client-id>",
    "response_type": "code",
    "scope": "openid profile email"
  },
} 
```

## Install File picker package
To integrate File picker into your own product, you can install it via one of the following commands:

```bash
npm install @owncloud/file-picker --save
# OR
yarn add @owncloud/file-picker
```

## Integrate in HTML page with vanilla JavaScript
When including File picker in an HTML page, it is important to include Vue.js as well. In this case, we will import it via [unpkg](https://unpkg.com). Without this, the component won't work. Vue needs to be included also if you're importing the File picker into a web application built with other framework than Vue (e.g. React, Angular).

For the purpose of this example, we will assume that you do not move installed packages and include the folder "node_modules" with installed packages in the same location as your index.html file on your server.

```html
...
<meta charset="utf-8">
<title>File picker example</title>
<script src="https://unpkg.com/vue"></script>
<script src="./node_modules/file-picker/dist/file-picker.js"></script>
...


<file-picker id="file-picker" variation="resource"></file-picker>
```

## Integrate in Vue web application
There is a caveat when using the File picker inside an existing Vue application. Since the web component will be imported before Vue, we need to define it as a global variable on our own.
This requires us to separate the import of Vue into a bootstrap file.

vue.js:
```js
import Vue from 'vue'
window.Vue = Vue
```

main.js:
```js
import Vue from './vue'

new Vue(...)
```

When importing the component, we need to reach it under the `.default` key.

```vuejs
<template>
  <file-picker variation="location" />
</template>

<script>
export default: {
  components: {
    FilePicker: require('@owncloud/file-picker').default
  }
}
</script>
```

## Set correct variation
As described in [Getting Started]({{< ref "getting-started.md#components-of-the-file-picker" >}}), File picker comes in two variations. To define which one should be used, you need to pass it to the component via its `variation` property. Valid values are:
- `resource` - File picker
- `location` - Location picker