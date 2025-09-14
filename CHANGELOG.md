# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.5] - 2025-09-14
### Added
- Allowed panning/dragging of the bottom sheet by the drag handle for smoother user interaction.

## [1.0.6] - 2025-09-14
### Added
- Support for animated dismiss via `ref` (e.g., `sheetRef.current?.dismiss()`), enabling custom close buttons inside the sheet content.
- Example usage in README demonstrating custom header layout with a close icon.

## [1.0.7] - 2025-09-14
### Added
- Fixed ref not being available in the props.
- Updated Readme.