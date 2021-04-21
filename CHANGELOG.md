# Changelog for [unreleased] (UNRELEASED)

The following sections list the changes in ownCloud File picker unreleased.

[unreleased]: https://github.com/owncloud/file-picker/compare/v0.3.0...master

## Summary

* Enhancement - Build File picker as a library: [#32](https://github.com/owncloud/file-picker/pull/32)

## Details

* Enhancement - Build File picker as a library: [#32](https://github.com/owncloud/file-picker/pull/32)

   We've added a build script which creates a library bundle with the File picker. This bundle can
   be directly imported during build time into any Vuejs app.

   https://github.com/owncloud/file-picker/pull/32

# Changelog for [0.3.0] (2021-04-19)

The following sections list the changes in ownCloud File picker 0.3.0.

[0.3.0]: https://github.com/owncloud/file-picker/compare/v0.2.0...v0.3.0

## Summary

* Enhancement - Cancelling the file picker: [#29](https://github.com/owncloud/file-picker/pull/29)
* Enhancement - Allow string as configObject attribute: [#27](https://github.com/owncloud/file-picker/pull/27)
* Enhancement - Select button label: [#29](https://github.com/owncloud/file-picker/pull/29)

## Details

* Enhancement - Cancelling the file picker: [#29](https://github.com/owncloud/file-picker/pull/29)

   We added two options for emitting a `cancel` event from the file picker: - pressing ESC on the
   keyboard while the file picker is focussed - clicking the new `Cancel` button which appears in
   the top bar as soon as a `cancelBtnLabel` is provided

   https://github.com/owncloud/file-picker/pull/29


* Enhancement - Allow string as configObject attribute: [#27](https://github.com/owncloud/file-picker/pull/27)

   The property/attribute "configObject" is now allowed to be a string. We'll parse it as JSON.

   https://github.com/owncloud/file-picker/pull/27
   https://github.com/owncloud/file-picker/pull/28


* Enhancement - Select button label: [#29](https://github.com/owncloud/file-picker/pull/29)

   It is now possible to provide a dedicated label overriding the default Select button label.

   https://github.com/owncloud/file-picker/pull/29

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

