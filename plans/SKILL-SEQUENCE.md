# AI Workflow Quick Reference

This file is a quick map. `AGENTS.md` and each skill's `SKILL.md` remain the source of truth.

## Entry Points

- Short or ambiguous project request: `project-orchestrator`.
- New Jira story, task, bug, or PM chore: `jira-story-writer`.
- Jira/task planning into a branch and `plans/<KEY>.md`: `task-architect`.
- Sequential full-plan execution: `task-executor`.
- One sequential checklist item: `bullet-executor`.
- Parallel-ready plan materialization: `beads-planner`, then `parallel-executor`.
- Confirmed Conventional Commit and push: `conventional-committer`.
- Failing CI/check/build/test/deploy pipeline diagnosis: `pipeline-debugger`.
- Durable architecture/workflow/tooling decision capture: `adr-logger`.
- GitHub PR review: `github-reviewer`.
- Completed-task Confluence docs: `confluence-documenter`.

## State Model

- Jira is stakeholder-facing intake, status, sprint, and acceptance tracking.
- `plans/*.md` are implementation specs and execution checklists.
- `docs/adr/*.md` captures project decisions that should outlive one task.
- Beads is for durable repo-local coordination: dependencies, blockers, claiming, handoff, follow-up work, and parallel execution state.
- Sequential `task-executor` and `bullet-executor` runs use plan checkboxes directly and leave Beads untouched.
- `parallel-executor` uses Beads children as the live queue, then reconciles completed child work back to plan checkboxes after integration and validation.

## Current Caveats

- Pipeline debugging is a read-only diagnosis workflow by default; fixing diagnosed failures should route back through normal implementation flow.
- ADR detection can be recommended in the background, but ADR files should be created only when explicitly requested.
- Agent reports use best-effort tool counts and context-size estimates unless the runtime exposes exact metrics.
