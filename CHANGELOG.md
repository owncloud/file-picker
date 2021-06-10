# Changelog for [unreleased] (UNRELEASED)

The following sections list the changes in ownCloud File picker unreleased.

[unreleased]: https://github.com/owncloud/file-picker/compare/v0.5.0...master

## Summary

* Enhancement - Update ODS to 7.1.2: [#63](https://github.com/owncloud/file-picker/pull/63)

## Details

* Enhancement - Update ODS to 7.1.2: [#63](https://github.com/owncloud/file-picker/pull/63)

   We've updated ODS to version 7.1.2. This version brings our css custom properties so that the
   theme is properly applied.

   https://github.com/owncloud/file-picker/pull/63
   https://github.com/owncloud/owncloud-design-system/releases/tag/v7.1.2

# Changelog for [0.5.0] (2021-05-27)

The following sections list the changes in ownCloud File picker 0.5.0.

[0.5.0]: https://github.com/owncloud/file-picker/compare/v0.4.0...v0.5.0

## Summary

* Change - Remove focus management: [#61](https://github.com/owncloud/file-picker/pull/61)
* Enhancement - Add a prop to hide the select button: [#60](https://github.com/owncloud/file-picker/pull/60)
* Enhancement - Always emit event when a resource is selected: [#60](https://github.com/owncloud/file-picker/pull/60)
* Enhancement - Emit event when clicking the select button: [#60](https://github.com/owncloud/file-picker/pull/60)

## Details

* Change - Remove focus management: [#61](https://github.com/owncloud/file-picker/pull/61)

   We've removed the initial focus management and shift the responsibility to the consuming app.

   https://github.com/owncloud/file-picker/pull/61


* Enhancement - Add a prop to hide the select button: [#60](https://github.com/owncloud/file-picker/pull/60)

   We've added a new prop `isSelectBtnDisplayed` which can be used to hiding the select button.

   https://github.com/owncloud/file-picker/pull/60


* Enhancement - Always emit event when a resource is selected: [#60](https://github.com/owncloud/file-picker/pull/60)

   We've started emitting `update` event every time a resource or location is selected or
   deselected.

   https://github.com/owncloud/file-picker/pull/60


* Enhancement - Emit event when clicking the select button: [#60](https://github.com/owncloud/file-picker/pull/60)

   We've started emitting `select` event when the select button is clicked.

   https://github.com/owncloud/file-picker/pull/60

# Changelog for [0.4.0] (2021-05-04)

The following sections list the changes in ownCloud File picker 0.4.0.

[0.4.0]: https://github.com/owncloud/file-picker/compare/v0.3.0...v0.4.0

## Summary

* Bugfix - Do not propagate click event on checkbox: [#53](https://github.com/owncloud/file-picker/pull/53)
* Bugfix - Emit current folder: [#42](https://github.com/owncloud/file-picker/pull/42)
* Enhancement - Add accessible location select: [#54](https://github.com/owncloud/file-picker/pull/54)
* Enhancement - Improve resource name and info readability: [#55](https://github.com/owncloud/file-picker/pull/55)
* Enhancement - Add initial focus: [#44](https://github.com/owncloud/file-picker/pull/44)
* Enhancement - Build File picker as a library: [#32](https://github.com/owncloud/file-picker/pull/32)
* Enhancement - Make it possible to select folder via keyboard: [#51](https://github.com/owncloud/file-picker/pull/51)
* Enhancement - Add translations: [#49](https://github.com/owncloud/file-picker/pull/49)
* Enhancement - Update ODS to 6.2.0: [#36](https://github.com/owncloud/file-picker/pull/36)

## Details

* Bugfix - Do not propagate click event on checkbox: [#53](https://github.com/owncloud/file-picker/pull/53)

   When clicking on the checkbox to select a resource, it hasn't been selected because a click on
   the row would have been caught as well which would reset the selection again. We've fixed this
   issue by not propagating the click event on checkbox to the parent.

   https://github.com/owncloud/file-picker/pull/53


* Bugfix - Emit current folder: [#42](https://github.com/owncloud/file-picker/pull/42)

   When selecting the current folder in the location picker, an empty array has been emitted.
   We've fixed this by emitting the current folder.

   https://github.com/owncloud/file-picker/pull/42


* Enhancement - Add accessible location select: [#54](https://github.com/owncloud/file-picker/pull/54)

   We've added a hidden button that becomes visible only when focused via keyboard navigation to
   ensure it is possible to select a location also when using a screen reader only.

   https://github.com/owncloud/file-picker/pull/54


* Enhancement - Improve resource name and info readability: [#55](https://github.com/owncloud/file-picker/pull/55)

   We've added paragraph elements for resource name and info so that the readability is improved
   when using screen readers.

   https://github.com/owncloud/file-picker/pull/55


* Enhancement - Add initial focus: [#44](https://github.com/owncloud/file-picker/pull/44)

   We've added an initial focus so that when the File picker is mounted, it immediately becomes
   focused.

   https://github.com/owncloud/file-picker/pull/44


* Enhancement - Build File picker as a library: [#32](https://github.com/owncloud/file-picker/pull/32)

   We've added a build script which creates a library bundle with the File picker. This bundle can
   be directly imported during build time into any Vuejs app.

   https://github.com/owncloud/file-picker/pull/32


* Enhancement - Make it possible to select folder via keyboard: [#51](https://github.com/owncloud/file-picker/pull/51)

   We've made the table row in the File picker focusable and the selection of folder in location
   picker triggerable by hitting enter.

   https://github.com/owncloud/file-picker/pull/51


* Enhancement - Add translations: [#49](https://github.com/owncloud/file-picker/pull/49)

   We've added vue-gettext library to add support for translations.

   https://github.com/owncloud/file-picker/pull/49


* Enhancement - Update ODS to 6.2.0: [#36](https://github.com/owncloud/file-picker/pull/36)

   We've updated ODS to version 6.2.0. This version brings new components that we used to make the
   location picker an actual table of resources.

   https://github.com/owncloud/file-picker/pull/36
   https://github.com/owncloud/owncloud-design-system/releases/tag/v6.2.0

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

