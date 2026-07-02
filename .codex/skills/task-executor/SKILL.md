---
name: task-executor
description: "Execute a full project implementation plan from a Markdown checklist, especially plans created by task-architect under plans/<TASK-KEY>.md. Use when the user asks Codex to implement a task, execute a plan, finish a Jira key, carry out work, or complete an entire task plan file end to end, including all unchecked implementation and validation bullets."
---

# Task Executor

## Purpose

Execute an existing project plan file end to end. This skill is for implementation, verification, and plan progress updates; it must not create a new plan.

This is a sequential executor. It does not create, claim, close, or update Beads issues. If the user asks to run a Beads-backed plan or to materialize work into Beads, use `parallel-executor` and `beads-planner` instead.

The skill must:
- Locate and read exactly one plan file.
- Execute every unchecked bullet in `## Implementation Plan` in order.
- Execute every unchecked bullet in `## Validation Plan` in order after implementation work is complete.
- Update the plan file checkboxes as bullets are completed.
- Stop only when the plan is complete or a real blocker prevents further progress.

## Shared Project Guidance

Read `AGENTS.md` when it exists and follow it for package manager, validation, branch, MCP, review, and safety conventions. If this skill conflicts with `AGENTS.md`, this skill's full-plan execution and validation rules win.

## Plan Source

Prefer a user-provided path such as `plans/ACTP-8.md`.

If the user provides only a Jira key or task key, use `plans/<TASK-KEY>.md` in the current repo.

If the user provides no plan reference:
- Use the current branch name to infer a task key when practical, for example `work/actp-8-...` maps to `plans/ACTP-8.md`.
- If exactly one plan exists under `plans/`, use it.
- Otherwise ask for the exact plan file before editing anything.

Read the full plan before making changes. Treat `## Requirements`, `## Open Questions`, and `## Out Of Scope` as constraints on the implementation.

If the plan has a `## Beads Tracking` section, do not use it as execution state. This skill executes the markdown plan sequentially and leaves Beads untouched.

## Preflight

Before editing:
- Run `git status --short --branch`.
- Confirm the current branch matches the plan's `Branch:` line when present. If it does not match, switch only when the worktree state makes that safe; otherwise ask the user.
- Inspect the files named by the next implementation bullets and any nearby project configuration.
- If there are uncommitted changes, preserve them. Do not overwrite, revert, or reformat unrelated user work.

If open questions are not `None` and materially affect implementation, ask before proceeding. If they are minor, proceed and document assumptions in the final response.

## Beads Exclusion

Do not create Beads issues, run `beads-planner`, claim Beads issues, close Beads issues, or update Beads issue state as part of this skill.

Only work intended for `parallel-executor` should be materialized into Beads. If the user asks to materialize a plan into Beads, use worker agents, use subagents, use isolated worktrees, execute from `bd ready`, or coordinate dependencies through Beads, route to `beads-planner` followed by `parallel-executor` instead of this skill.

If the user provides a Beads issue ID or the plan already has `## Beads Tracking`, treat that as a signal that `parallel-executor` may be the intended path. If the user explicitly asks for sequential execution anyway, execute only the plan checkboxes and report that Beads state was left unchanged.

## Permission And Interruption Continuation

If execution pauses for a permission request and the user replies with clarification, a constraint, or another instruction instead of a simple approval or denial, do not treat that as the end of the task. Incorporate the new instruction, re-check the current plan and worktree state, and continue from the first unchecked implementation or validation bullet unless the user explicitly says to stop, pause, skip the remaining plan, or switch to a different task.

If the same permission is still required after incorporating the user's reply, request it again at the point where it is needed. Do not send a completion response merely because an earlier permission request was interrupted or answered indirectly.

## Execution Workflow

Work through the checklist in this order:

1. Execute the first unchecked `## Implementation Plan` bullet.
2. Review the changed diff for introduced deprecated APIs, types, imports, framework patterns, or warnings that normal tests may not fail on.
3. When touching TypeScript or framework-typed code, check installed local typings or official local docs for current APIs when an imported type or helper is marked deprecated.
4. Run a targeted text search for any known deprecated symbol introduced or modified by the bullet.
5. Verify that specific bullet enough to know it is complete.
6. Mark that bullet complete in the plan file by changing `- [ ]` to `- [x]`.
7. Continue with the next unchecked implementation bullet until none remain.
8. Execute each unchecked `## Validation Plan` bullet.
9. Mark each validation bullet complete only after the command or manual check succeeds.

When a validation bullet fails because of implementation defects, fix the defects and rerun the validation. Keep going until validation passes or a blocker is reached.

Do not mark a bullet complete just because work was attempted. If a bullet is partially complete, leave it unchecked and add a concise note under a `## Blocked Notes` section in the plan file.

## Boundaries

Do not:
- Commit, push, create PRs, transition Jira, assign Jira, or comment on Jira unless the user explicitly asks.
- Add features outside `## Requirements` or inside `## Out Of Scope`.
- Rewrite the plan structure except for checkbox updates and necessary blocked notes.
- Skip validation because it is slow, unless the user explicitly says to skip it.

Use the repository's existing package manager, tooling, framework patterns, component structure, and style conventions.

## Completion Response

Report:
- Plan file executed.
- Branch used.
- Confirmation that no Beads issues were created, claimed, closed, or updated.
- Implementation bullets completed.
- Validation bullets completed, including exact commands run.
- Deprecated API/type sweeps performed, when relevant.
- Any files changed.
- Any blockers, skipped checks, or assumptions.
