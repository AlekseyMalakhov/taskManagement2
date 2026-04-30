# Agent Memory Index

- [E2E test setup and file locations](project_e2e_setup.md) — Playwright config, test files, fixtures, webServer, running instructions
- [Reliable selectors and UI quirks](project_selector_patterns.md) — Tested selectors for task cards, status dropdowns, modals, TagSelectorPopup, filter panel
- [Tag persistence quirk and workaround](project_tag_persistence.md) — No DELETE /tags API; idempotent createTag helper; uniqueTagName() for UI create-tag tests
