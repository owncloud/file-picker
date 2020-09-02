# Changes in unreleased

## Summary

* Bugfix - Reset resource selection when opening folder: [#11](https://github.com/owncloud/file-picker/pull/11)
* Enhancement - Do not import Vue: [#16](https://github.com/owncloud/file-picker/pull/16)
* Enhancement - Add basic implementation of file picker: [#2](https://github.com/owncloud/file-picker/pull/2)

## Details

* Bugfix - Reset resource selection when opening folder: [#11](https://github.com/owncloud/file-picker/pull/11)

   We've added reset of selected resources when a folder is opened. This prevents from having
   selected resources which are not visible.

   https://github.com/owncloud/file-picker/pull/11


* Enhancement - Do not import Vue: [#16](https://github.com/owncloud/file-picker/pull/16)

   We've stopped importing Vue because it is not bundled during the build process and needs to be
   included as a global variable in the target web application.

   https://github.com/owncloud/file-picker/pull/16


* Enhancement - Add basic implementation of file picker: [#2](https://github.com/owncloud/file-picker/pull/2)

   We've added a basic implementation of ownCloud file picker. File picker is a web component
   which can be integrated into existing products and is firing event providing array of selected
   resources

   https://github.com/owncloud/file-picker/pull/2

