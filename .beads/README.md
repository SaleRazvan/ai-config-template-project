# Beads Workspace

This repository has a local Beads workspace for durable task coordination.

Use Beads when work needs dependencies, blockers, claiming, handoff, follow-up tracking, or parallel execution state. Do not create Beads issues for simple questions, tiny edits, or one-off sequential plan execution.

Useful commands:

```bash
bd prime
bd ready
bd show <id>
bd update <id> --claim
bd close <id>
```

For project-specific policy, read `AGENTS.md` and `.agents/skills/beads/SKILL.md`.
