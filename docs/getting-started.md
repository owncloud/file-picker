---
title: "Getting Started"
date: 2020-08-26T10:56:03
weight: 2
geekdocRepo: https://github.com/owncloud/file-picker
geekdocEditPath: edit/master/docs
geekdocFilePath: getting-started.md
---

{{< hint type=warning title="Deprecation Notice" >}}
The File Picker development has been discontinued in favour of the [Web Embed Mode](https://owncloud.dev/clients/web/embed-mode/).
{{< /hint >}}

{{< toc >}}

ownCloud File picker is a web component which can be integrated into existing web applications. It connects to an ownCloud server and enables a user to select resources which are then provided in a response of a fired event. Visit [installation]({{< ref "installation.md" >}}) to see how to integrate the File picker into your product.

{{< hint info >}}
Please be aware that the File picker provides you with an object representation of the resource and not the actual content itself. In order to perform any actions with the resource, you must utilize the APIs within your own application that integrates the File picker. To see an example of how to upload a file to the location chosen through the File picker, please refer to the following documentation: [Perform actions with selected resources]({{< ref "accessing-resources.md#perform-actions-with-selected-resources" >}}).
{{< /hint >}}

## Components of the File picker
The file picker can be used in two different variations: File picker and location picker.

### File picker
The file picker enables users to select multiple resources and is intended to bring resources from within ownCloud into your web applications.

### Location picker
The location picker allows only one folder to be selected and its main purpose is to enable users to save files into the connected ownCloud instance.