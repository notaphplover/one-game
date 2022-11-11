# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!--
## [UNRELEASED]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
### Docs
-->




## [UNRELEASED]

### Changed
- Updated dependencies require `reflect-metadata` as dev dependency.
- Update dependencies with `@cuaklabs/iocuak-` internal libraries.




## 0.3.1 - 2022-07-09

### Changed
- Updated `ContainerModuleFactoryMetadata.injects` to allow `ClassElementMetadata`.




## 0.3.0 - 2022-06-28

### Added
- Added `Tag`.
- Added `BindValueOptions`.
- Added `ClassElementMetadata`.
- Added `ClassElementMetadatType`.
- Added `ClassElementServiceIdMetadata`.
- Added `ClassElementTagMetadata`.
- Added `injectTag`.

### Changed
- Updated `Container` with `getByTag`.
- Updated `ContainerModuleMetadata` to allow module classes and modules.
- Updated `InjectableOptions` with tags.
- [BC]: Updated `ClassMetadata` to contain `ClassElementMetadata` based properties and constructor arguments.
- [BC]: Updated `Container.bindToValue` to require `BindValueOptions`.




## 0.2.1 - 2022-04-30

### Changed
- Updated `Container.get` to create instance of newable unbinded types.
- Updated `ContainerModuleMetadata` to allow class metadata
- Updated `ContainerModuleMetadata.imports` to be optional.
- Updated `ContainerModuleMetadata.injects` to be optional.

### Fixed
- Fixed `Container.unbind` to remove unbound singleton services
- Fixed `Container.get` to successfully create request scoped services instances.




## 0.2.0 - 2022-04-19

### Added
- Added `BindingType`.
- Added `ContainerModuleBindingService`.
- Added `ContainerModuleMetadata`

### Changed
- Updated `ContainerModuleServiceApi` with `loadMetadata`.
- Updated `ContainerModule` to receive a `ContainerModuleBindingService`.




## 0.1.1 - 2022-03-08

### Fixed
- Fixed wrong compiled files.




## 0.1.0 - 2022-03-08

### Added
- Added `Binding`
- Added `ClassMetadata`
- Added `MetadataProvider`.
- Added `MetadataService`
- Added `TypeBinding`
- Added `ValueBinding`

### Changed
- Updated `ContainerApi` with `build` and `createChild` methods.
- `ContainerServiceApi` interface is now exposed.
- [BC]: Updated `ContainerApi` constructor to be private.
- [BC]: Renamed `BindingApi` to `InjectableOptions`.
- [BC]: Renamed `TaskScope` to `BindingScope`.
- [BC]: Renamed `ContainerApi` to `Container`.



## v0.0.7 - 2021-11-09

### Changed
- `Binding` model is no longer exposed
- `BindingApi` model is now exposed.
- `TaskScope` enum is now exposed.
- Updated `ContainerBindingApiService` with `bindToValue`.
- Updated `TaskScope` with `request` scope.
- Updated `inject` to throw an error if it's not used in a constructor parameter.




## v0.0.6 - 2021-10-25

### Changed
- Updated npm config to ignore source files.




## v0.0.5 - 2021-10-25

### Changed
- Updated npm publish config with public access.




## v0.0.4 - 2021-10-25

### Added
- Added `Binding`.
- Added `ContainerApi`.
- Added `ContainerModuleApi`.
- Added `inject`.
- Added `injectable`.
- Added `injectFrom`.
- Added `injectFromBase`.
- Added `Newable`.
- Added `ServiceId`.



