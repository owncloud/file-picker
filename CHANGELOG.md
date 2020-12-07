# Changelog for [0.2.0] (2020-12-07)

The following sections list the changes in ownCloud File picker 0.2.0.

[0.2.0]: https://github.com/owncloud/file-picker/compare/v0.1.0...v0.2.0

## Summary

* Bugfix - Reset resource selection when opening folder: [#11](https://github.com/owncloud/file-picker/pull/11)
* Enhancement - Bootstrap Vue: [#19](https://github.com/owncloud/file-picker/pull/19)
* Enhancement - Do not import Vue: [#16](https://github.com/owncloud/file-picker/pull/16)

## Details

* Bugfix - Reset resource selection when opening folder: [#11](https://github.com/owncloud/file-picker/pull/11)

   We've added reset of selected resources when a folder is opened. This prevents from having
   selected resources which are not visible.

   https://github.com/owncloud/file-picker/pull/11


* Enhancement - Bootstrap Vue: [#19](https://github.com/owncloud/file-picker/pull/19)

   We've bootstrapped Vue to add access to the file picker via window.

   https://github.com/owncloud/file-picker/pull/19


* Enhancement - Do not import Vue: [#16](https://github.com/owncloud/file-picker/pull/16)

   We've stopped importing Vue because it is not bundled during the build process and needs to be
   included as a global variable in the target web application.

   https://github.com/owncloud/file-picker/pull/16

# Changelog for [0.1.0] (2020-09-01)

The following sections list the changes in ownCloud File picker 0.1.0.

[0.1.0]: https://github.com/owncloud/file-picker/compare/f9d6d96e52b9fa0c275e9971a11e02d11e9ecd85...v0.1.0

## Summary

* Enhancement - Add basic implementation of file picker: [#2](https://github.com/owncloud/file-picker/pull/2)

## Details

* Enhancement - Add basic implementation of file picker: [#2](https://github.com/owncloud/file-picker/pull/2)

   We've added a basic implementation of ownCloud file picker. File picker is a web component
   which can be integrated into existing products and is firing event providing array of selected
   resources

   https://github.com/owncloud/file-picker/pull/2

