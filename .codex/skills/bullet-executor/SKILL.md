---
name: bullet-executor
description: Execute exactly one unchecked bullet from a project implementation plan Markdown file, especially plans created by task-architect under plans/<TASK-KEY>.md. Use when the user asks Codex to do one plan item, execute the next bullet, continue one step, or complete a single checklist bullet and then stop.
---

# Bullet Executor

## Purpose

Execute one checklist bullet from an existing project plan file, update that bullet if completed, and stop. This skill is intentionally incremental.

The skill must:
- Locate and read exactly one plan file.
- Select exactly one bullet to execute.
- Complete only that selected bullet.
- Mark only that selected bullet complete when it is actually done.
- Stop immediately after reporting the result.

## Plan Source

Prefer a user-provided path such as `plans/ACTP-8.md`.

If the user provides only a Jira key or task key, use `plans/<TASK-KEY>.md` in the current repo.

If the user provides no plan reference:
- Use the current branch name to infer a task key when practical, for example `work/actp-8-...` maps to `plans/ACTP-8.md`.
- If exactly one plan exists under `plans/`, use it.
- Otherwise ask for the exact plan file before editing anything.

Read the full plan before making changes. Treat `## Requirements`, `## Open Questions`, and `## Out Of Scope` as constraints.

## Bullet Selection

If the user names a bullet number or quotes a bullet, execute that bullet.

If the user does not name a bullet:
- Select the first unchecked bullet in `## Implementation Plan`.
- If all implementation bullets are complete, select the first unchecked bullet in `## Validation Plan`.
- If no unchecked bullets remain, report that the plan is already complete.

Do not execute multiple checklist bullets in one turn. Supporting edits are allowed only when they are necessary to complete the selected bullet.

## Preflight

Before editing:
- Run `git status --short --branch`.
- Confirm the current branch matches the plan's `Branch:` line when present. If it does not match, switch only when the worktree state makes that safe; otherwise ask the user.
- Inspect files directly relevant to the selected bullet.
- Preserve uncommitted user changes. Do not overwrite, revert, or reformat unrelated work.

If open questions materially affect the selected bullet, ask before proceeding. If they do not affect the selected bullet, proceed.

## Permission And Interruption Continuation

If execution pauses for a permission request and the user replies with clarification, a constraint, or another instruction instead of a simple approval or denial, do not treat that as the end of the selected bullet. Incorporate the new instruction, re-check the current plan and worktree state, and continue the same selected bullet unless the user explicitly says to stop, pause, skip it, or switch to a different task.

If the same permission is still required after incorporating the user's reply, request it again at the point where it is needed. Do not send a completion response merely because an earlier permission request was interrupted or answered indirectly.

## Execution Workflow

For the selected bullet:

1. Perform only the implementation or validation work required by that bullet.
2. Review the changed diff for introduced deprecated APIs, types, imports, framework patterns, or warnings that normal tests may not fail on.
3. When touching TypeScript or framework-typed code, check the installed local typings or official local docs for the current specific API when an imported type or helper is marked deprecated. For React form submits, use `SubmitEventHandler<HTMLFormElement>` instead of deprecated `FormEvent` or `FormEventHandler`.
4. Run a targeted text search for any known deprecated symbol introduced or modified by the bullet, for example `rg "FormEvent|FormEventHandler"` after replacing deprecated React form event types.
5. Run the smallest useful verification for that bullet. If the selected bullet is itself a validation command, run that command.
6. If the bullet is complete, update the plan file by changing only that bullet from `- [ ]` to `- [x]`.
7. If the bullet is blocked or only partially complete, leave it unchecked and add a concise note under a `## Blocked Notes` section in the plan file.
8. Stop. Do not continue to the next unchecked bullet.

## Boundaries

Do not:
- Execute a second checklist bullet, even when it is obvious or adjacent.
- Commit, push, create PRs, transition Jira, assign Jira, or comment on Jira unless explicitly asked.
- Add features outside `## Requirements` or inside `## Out Of Scope`.
- Rewrite the plan structure except for the selected checkbox update and necessary blocked notes.

Use the repository's existing package manager, tooling, framework patterns, component structure, and style conventions.

## Completion Response

Report:
- Plan file used.
- Selected bullet.
- Whether it was completed or blocked.
- Verification performed.
- Deprecated API/type sweep performed, when relevant.
- Files changed.
- The next unchecked bullet, if one remains.
