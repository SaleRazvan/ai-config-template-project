# ACTP-8: Build a simple task organizer CRUD UI

Source: https://ai-config-template-project.atlassian.net/browse/ACTP-8
Status: In Progress
Branch: work/actp-8-build-a-simple-task-organizer-crud-ui
Created: 2026-06-10

## Requirements
- Replace the starter React/Vite screen with a simple task organizer experience.
- Allow users to add, edit, and delete tasks from the UI.
- Prevent blank or whitespace-only task titles from being added or saved.
- Preserve the existing light/dark color theme and reuse the current CSS variable scheme.
- Keep reusable React UI under `src/components` and keep `src/App.tsx` focused on composition.
- Add basic automated tests for the task CRUD behavior.
- Add a real GitHub Actions test pipeline so tests run on pushes and pull requests.
- Use the existing Yarn v1 lockfile as the package-manager source of truth.

## Open Questions
- [ ] None

## Implementation Plan
- [x] 1. Inspect `src/App.tsx`, `src/App.css`, `src/index.css`, `package.json`, `vite.config.ts`, and `.github/workflows/test.yml` to confirm the current app structure and available scripts before editing.
- [x] 2. Add the test tooling needed for React component tests, including Vitest, React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom`, and jsdom, then update `package.json` and `yarn.lock`.
- [x] 3. Add a test setup file such as `src/setupTests.ts` and configure Vitest to use jsdom and the setup file through the existing Vite/Vitest configuration.
- [x] 4. Create `src/components/TaskOrganizer.tsx` with typed task state, controlled add/edit inputs, trimmed validation, and handlers for add, save edit, cancel edit, and delete.
- [x] 5. Keep any additional reusable task UI, such as task item or form components, inside `src/components` only if it reduces real duplication or keeps `TaskOrganizer` readable.
- [x] 6. Update `src/App.tsx` to compose the task organizer as the primary app experience and remove the starter counter/documentation UI that is no longer part of the feature.
- [x] 7. Update `src/App.css` using existing theme variables such as `--bg`, `--text`, `--text-h`, `--border`, `--accent`, `--accent-bg`, `--accent-border`, `--social-bg`, and `--shadow`; keep the UI responsive and consistent with the current light/dark scheme.
- [x] 8. Add focused tests for adding a task, editing an existing task without duplicating it, deleting a task, and rejecting empty submissions.
- [x] 9. Replace the placeholder `.github/workflows/test.yml` steps with a CI job that checks out the repo, sets up Node, installs dependencies with Yarn, and runs the test script.
- [x] 10. Run formatting or lint-driven cleanup only where required by the existing project configuration, avoiding unrelated refactors.

## Validation Plan
- [x] Run `yarn test` and confirm all task organizer tests pass.
- [x] Run `yarn lint` and fix any lint violations introduced by the feature.
- [x] Run `yarn build` and confirm the TypeScript/Vite production build succeeds.
- [x] Review `.github/workflows/test.yml` to confirm the CI pipeline runs the same test script used locally.

## Out Of Scope
- Persisting tasks across page reloads or sessions.
- Adding authentication, task ownership, due dates, priorities, search, filtering, or drag-and-drop.
- Introducing a backend API or external storage.
- Redesigning the broader visual identity beyond adapting the current theme to the task organizer UI.
