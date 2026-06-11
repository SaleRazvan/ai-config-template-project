---
name: task-executor
description: Execute a full project implementation plan from a Markdown checklist, especially plans created by task-architect under plans/<TASK-KEY>.md. Use when the user asks Codex to implement, execute, carry out, or complete an entire task plan file end to end, including all unchecked implementation and validation bullets.
---

# Task Executor

## Purpose

Execute an existing project plan file end to end. This skill is for implementation, verification, and plan progress updates; it must not create a new plan.

The skill must:
- Locate and read exactly one plan file.
- Execute every unchecked bullet in `## Implementation Plan` in order.
- Execute every unchecked bullet in `## Validation Plan` in order after implementation work is complete.
- Update the plan file checkboxes as bullets are completed.
- Stop only when the plan is complete or a real blocker prevents further progress.

## Plan Source

Prefer a user-provided path such as `plans/ACTP-8.md`.

If the user provides only a Jira key or task key, use `plans/<TASK-KEY>.md` in the current repo.

If the user provides no plan reference:
- Use the current branch name to infer a task key when practical, for example `work/actp-8-...` maps to `plans/ACTP-8.md`.
- If exactly one plan exists under `plans/`, use it.
- Otherwise ask for the exact plan file before editing anything.

Read the full plan before making changes. Treat `## Requirements`, `## Open Questions`, and `## Out Of Scope` as constraints on the implementation.

## Preflight

Before editing:
- Run `git status --short --branch`.
- Confirm the current branch matches the plan's `Branch:` line when present. If it does not match, switch only when the worktree state makes that safe; otherwise ask the user.
- Inspect the files named by the next implementation bullets and any nearby project configuration.
- If there are uncommitted changes, preserve them. Do not overwrite, revert, or reformat unrelated user work.

If open questions are not `None` and materially affect implementation, ask before proceeding. If they are minor, proceed and document assumptions in the final response.

## Permission And Interruption Continuation

If execution pauses for a permission request and the user replies with clarification, a constraint, or another instruction instead of a simple approval or denial, do not treat that as the end of the task. Incorporate the new instruction, re-check the current plan and worktree state, and continue from the first unchecked implementation or validation bullet unless the user explicitly says to stop, pause, skip the remaining plan, or switch to a different task.

If the same permission is still required after incorporating the user's reply, request it again at the point where it is needed. Do not send a completion response merely because an earlier permission request was interrupted or answered indirectly.

## Execution Workflow

Work through the checklist in this order:

1. Execute the first unchecked `## Implementation Plan` bullet.
2. Verify that specific bullet enough to know it is complete.
3. Mark that bullet complete in the plan file by changing `- [ ]` to `- [x]`.
4. Continue with the next unchecked implementation bullet until none remain.
5. Execute each unchecked `## Validation Plan` bullet.
6. Mark each validation bullet complete only after the command or manual check succeeds.

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
- Implementation bullets completed.
- Validation bullets completed, including exact commands run.
- Any files changed.
- Any blockers, skipped checks, or assumptions.
