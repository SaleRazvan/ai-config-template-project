# ai-config-template-project

React + Vite + TypeScript proof-of-concept app used to exercise local AI workflow configuration.

## App

- Task organizer UI in `src/components/TaskOrganizer.tsx`.
- Add, edit, delete, validate, and persist tasks with `localStorage`.
- Component tests live in `src/components/TaskOrganizer.test.tsx`.
- GitHub Actions runs the test suite on pushes and pull requests.

## Commands

Use Yarn, matching the committed lockfile.

```bash
yarn
yarn dev
yarn test
yarn lint
yarn build
```

## Agent Workflow

- `AGENTS.md` is the shared steering file for local agent work.
- `plans/` contains Jira-backed implementation plans and historical task records.
- `.codex/skills/` contains project workflow skills.
- `.agents/skills/beads/` documents when to use Beads for durable coordination.
- Beads is optional for ordinary sequential work and should be used only when durable coordination adds value.
