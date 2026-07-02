---
name: parallel-executor
description: "Execute a Beads-backed project plan through parallel child work, using Beads ready/blocked state, child issue claiming, isolated git worktrees, worker agents when available, and final reconciliation back to plans/<KEY>.md."
---

# Parallel Executor

## Purpose

Execute a project plan through Beads when the work can safely run in parallel.

This skill is the parallel counterpart to `task-executor` and `bullet-executor`:
- `bullet-executor` remains sequential and handles exactly one checklist bullet.
- `task-executor` remains sequential and handles a whole plan in plan order.
- `parallel-executor` treats Beads child issues as the execution queue, coordinates isolated workers, integrates their changes, and reconciles completed Beads work back to the markdown plan.

The skill must:
- Read `AGENTS.md`, the project `beads` skill, and the local plan before editing.
- Require an existing Beads execution graph or route to `beads-planner` first.
- Use `bd ready`, `bd blocked`, `bd show`, and `bd update --claim` as the source of execution state.
- Create one isolated git worktree per active child issue unless the runtime provides an equivalent isolated worker workspace.
- Assign each worker a disjoint Beads child issue and an explicit file or responsibility boundary.
- Keep workers from editing `plans/<KEY>.md`; the coordinator updates plan checkboxes only after integration and validation.
- Close Beads child issues only after their changes are integrated into the coordinator branch and relevant validation passes.
- Close the parent Beads issue only after all required children and final validation are complete.

## When To Use

Use this skill when the user asks to:
- run a plan in parallel
- execute Beads tasks in parallel
- use worker agents, subagents, or parallel agents for a plan
- execute a `## Beads Tracking` plan through Beads
- finish a complex plan whose child Beads issues can be worked independently

Do not use this skill for tiny, sequential, or tightly coupled changes. Use `task-executor` for ordered full-plan execution and `bullet-executor` for one-bullet execution.

## Source Resolution

Prefer a user-provided plan path such as `plans/ACTP-10.md`.

If the user provides a Jira/task key, use `plans/<TASK-KEY>.md`.

If the user provides a Beads issue ID:
- Run `bd show <id>`.
- Resolve the linked plan from the issue description or the plan's `## Beads Tracking` section.
- Treat a parent issue as the execution graph root.
- Treat a child issue as a request to execute only that child unless the user asks for the whole graph.

If no plan or Beads target is clear, ask for the exact plan file or Beads issue ID.

## Preconditions

Before launching parallel work:
1. Run `bd prime` when context is missing or stale.
2. Run `git status --short --branch` and preserve user changes.
3. Read the plan's `## Requirements`, `## Open Questions`, `## Implementation Plan`, `## Validation Plan`, `## Beads Tracking`, and `## Out Of Scope`.
4. If the plan does not have child Beads mappings, run `beads-planner` first and stop unless the user asked to continue after materialization.
5. Run `bd ready` and `bd blocked`.
6. Select only ready child issues mapped to the target plan.
7. Do not parallelize child issues that touch the same files, share uncertain ownership, or depend on each other's unmerged changes. Run those sequentially or split the Beads graph further.

Default to a small worker batch, usually two or three children at a time. Use a larger batch only when the file ownership is clearly disjoint and validation cost is low.

## Worktree Isolation

Use git worktrees to isolate concurrent edits when the runtime does not already provide isolated worker workspaces.

Recommended naming:
- Worktree path: `../<repo-name>-<beads-short-id>`
- Worker branch: `work/<task-key-lowercase>-<beads-short-id>`

For each ready child:
1. Create a worktree from the coordinator branch.
2. In that worktree, run `bd show <child-id>`.
3. Claim the child with `bd update <child-id> --claim` only when the worker is about to start.
4. Keep all edits inside the worker's assigned ownership boundary.
5. Run the smallest useful validation for that child.
6. Leave the plan file unchanged.
7. Report changed files, validation, remaining risk, and whether the child is ready for integration or blocked.

Workers must not commit, push, transition Jira, publish Confluence, publish GitHub reviews, or close Beads issues unless the coordinator explicitly delegates that authority and the user has approved any required external write.

## Worker Prompt Contract

When spawning worker agents, give each worker:
- The Beads child ID.
- The plan path and mapped plan bullet numbers.
- The files, modules, or responsibility it owns.
- The branch/worktree path it should use.
- A clear instruction that other workers may be editing nearby code and that it must not revert unrelated changes.
- A clear instruction not to edit `plans/<KEY>.md`.
- The targeted validation it should run.
- The required final report shape.

If worker agents are unavailable, the coordinator may run the ready children one at a time using the same Beads/worktree rules, or stop after preparing the Beads graph and report that live parallel execution requires a runtime with worker support.

## Coordinator Workflow

Use this loop:
1. Read `bd ready` and select a safe batch of mapped child issues.
2. Prepare one isolated worktree or worker workspace per selected child.
3. Start the workers.
4. While workers run, do not duplicate their assigned work in the coordinator.
5. Review each worker's result.
6. Integrate successful child changes into the coordinator branch.
7. Run relevant targeted validation after each integration and broader validation after the batch.
8. Close each child Beads issue only after its integrated changes pass validation.
9. For blocked children, leave the issue open and update the issue notes with the blocker.
10. Repeat until no mapped ready children remain.

After all implementation children are closed, run the plan's `## Validation Plan`. Mark validation bullets complete only after they pass.

## Plan Reconciliation

The coordinator is the only role that updates `plans/<KEY>.md` during parallel execution.

After integrating and validating child work:
- Mark mapped implementation bullets complete when their Beads child issues are closed.
- Leave bullets unchecked when their child issue is open, blocked, or only partially integrated.
- Add a concise `## Blocked Notes` section only when a real blocker remains.
- Preserve the plan structure except for checkbox updates, Beads tracking corrections, and necessary blocked notes.

This reconciliation is required before reporting completion.

## Safety

Do not:
- Run parallel workers against overlapping ownership unless the user explicitly accepts the conflict risk.
- Let multiple workers edit the same plan file.
- Close a child issue because a worker attempted the work; close it only after integration and validation.
- Close the parent issue while child issues, integration, or validation remain.
- Treat Jira, Confluence, or GitHub writes as part of this skill unless the user explicitly asks and the relevant skill's confirmation rules are satisfied.

If integration conflicts are non-trivial, stop parallel intake, resolve the conflict in the coordinator branch, rerun validation, and then continue from `bd ready`.

## Completion Response

Report:
- Plan file and parent Beads issue used.
- Child Beads issues claimed, integrated, closed, blocked, or skipped.
- Worker count and whether git worktrees or runtime-isolated worker workspaces were used.
- Plan checkboxes reconciled.
- Validation commands run and results.
- Files changed.
- Any blocked work, remaining ready Beads issues, or skipped parallelism.
- Confirmation that no commit, push, Jira transition, Confluence publication, or GitHub review publication was performed unless explicitly requested.
