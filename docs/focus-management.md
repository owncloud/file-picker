---
title: "Focus Management"
weight: 7
geekdocRepo: https://github.com/owncloud/file-picker
geekdocEditPath: edit/master/docs
geekdocFilePath: focus-management.md
---

{{< toc >}}

File Picker doesn't come with a focus management. Any element needs to be focused through a code in the consuming app.

## Focusing content of File Picker
If you're including File Picker as a web component, managing focus is slightly different from focusing content of any other component in the DOM tree. Since web component are living in shadow root, we need to send the focus into it. To focus e.g. a checkbox within the File Picker, you can use the following code.

```js
document.querySelector('#file-picker').shadowRoot.querySelector('#oc-checkbox-3').focus()
```

{{< hint info >}}
The `#file-picker` selector is coming from the consuming app, not from File Picker.
{{< /hint >}}