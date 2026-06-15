# ACTP-9: Persist task organizer tasks across refreshes

Source: https://ai-config-template-project.atlassian.net/browse/ACTP-9
Status: In Progress
Branch: work/actp-9-persist-task-organizer-tasks-across-refreshes
Created: 2026-06-11

## Requirements
- Persist task organizer tasks in browser storage so added tasks still display after a page refresh.
- Persist task edits and deletions so the refreshed task list reflects the latest user changes.
- Keep the current empty state when no tasks are saved.
- Handle missing or invalid saved task data without crashing the app.
- Use `localStorage` for browser-only persistence without adding a backend.
- Preserve the existing in-memory CRUD behavior and UI flow.
- Keep task IDs stable after reload and ensure newly added task IDs do not collide with saved tasks.
- Add or update Vitest coverage for loading, saving, editing, deleting, and empty-state behavior.

## Open Questions
- [ ] None

## Implementation Plan
- [x] 1. Inspect `src/components/TaskOrganizer.tsx` and `src/components/TaskOrganizer.test.tsx` to identify the smallest persistence boundary around task loading, task updates, and `nextId` initialization.
- [x] 2. Add localStorage read/write helpers near the `Task` type in `src/components/TaskOrganizer.tsx`, including validation that accepts only arrays of tasks with numeric `id` values and non-empty string `title` values.
- [x] 3. Initialize `tasks` from the storage helper and initialize `nextId` from the highest persisted task ID plus one so IDs remain stable and do not collide after refresh.
- [x] 4. Persist task changes after successful add, edit, and delete operations while preserving the existing validation messages, empty state, and edit cancellation behavior.
- [x] 5. Update `src/components/TaskOrganizer.test.tsx` to clear `localStorage` between tests and cover loading previously saved tasks on render.
- [x] 6. Add or update component tests proving add, edit, and delete operations write the expected task list to `localStorage`.
- [x] 7. Add a component test proving invalid saved data is ignored safely and the empty state renders without throwing.
- [x] 8. Review the final diff for deprecated React/TypeScript APIs and run a targeted search for any deprecated symbols introduced by the persistence work.

## Validation Plan
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run `rg "FormEvent|FormEventHandler" src` to confirm no deprecated React form event types were introduced.

## Out Of Scope
- Backend persistence, user accounts, cross-device sync, or server APIs.
- Persisting draft input text or in-progress edit state.
- Changing the existing visual design beyond what is necessary for persistence behavior.
