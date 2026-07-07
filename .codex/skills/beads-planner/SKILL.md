---
name: beads-planner
description: "Convert a non-trivial local implementation plan into Beads tasks and dependencies for parallel-executor. Use when Codex is asked to materialize a plan into Beads for parallel agents, split a complex plan into a dependency graph, create Beads tracking for a Jira-backed plan that will run in parallel, or prepare durable parallel handoff state from plans/<KEY>.md."
---

# Beads Planner

## Purpose

Turn one project plan into a Beads execution graph for `parallel-executor`. This skill creates durable repo-local Beads issues from meaningful plan chunks, links dependencies, and records the Beads IDs back in the plan for parallel execution.

The skill must:
- Read `AGENTS.md` and the project `beads` skill before mutating Beads.
- Locate and read exactly one plan file.
- Decide whether Beads adds coordination value before creating issues.
- Create a parent Beads issue for the plan when one does not already exist.
- Create child Beads issues only for meaningful, claimable chunks.
- Add dependencies where order matters.
- Add or update a `## Beads Tracking` section in the plan.
- Stop after planning/tracking. Do not implement code, run `parallel-executor`, commit, push, transition Jira, or publish external updates unless a later explicit user instruction asks for those steps.

## When To Materialize

Use Beads materialization when the user explicitly asks to prepare work for `parallel-executor`, the plan already has Beads tracking, or the plan is complex enough to benefit from parallel execution with durable coordination.

Good signals:
- The plan has several implementation bullets with separable ownership.
- Work can run in parallel through `parallel-executor`.
- The task may span sessions or agents.
- The plan has blockers, dependencies, validation gates, or discovered follow-up work.
- Another developer or agent should be able to resume from `bd ready`.

Skip Beads creation when the work is intended for sequential `task-executor` or `bullet-executor` execution, even if the plan is moderately complex. In that case, report that direct sequential execution is more appropriate. Only tasks that will go to `parallel-executor` should be materialized into Beads.

## Source Resolution

Prefer a user-provided path such as `plans/ACTP-10.md`.

If the user provides only a Jira key or task key, use `plans/<TASK-KEY>.md`.

If no plan is provided:
- Infer the task key from the current branch when practical.
- If exactly one plausible plan exists, use it.
- Otherwise ask for the exact plan file.

Read the full plan before creating Beads issues. Preserve `## Requirements`, `## Open Questions`, `## Implementation Plan`, `## Validation Plan`, and `## Out Of Scope` as constraints.

## Beads Workflow

1. Run `bd prime` when Beads context is missing or stale.
2. Search existing Beads issues before creating duplicates:
   ```bash
   bd search <task-key-or-summary>
   ```
3. Create or reuse one parent Beads issue for the whole plan:
   ```bash
   bd create --title="<TASK-KEY>: <summary>" --description="Source: <plan path and Jira URL if present>" --type=feature --priority=2
   ```
4. Group implementation bullets into child issues. Do not create one child per checkbox unless each checkbox is independently claimable.
5. Put the plan path, source Jira key/URL, relevant bullet numbers, and acceptance/validation notes in each child description.
6. Add dependencies with:
   ```bash
   bd dep add <issue> <depends-on>
   ```
   This means `<issue>` is blocked until `<depends-on>` is closed.
7. Use `bd ready` and `bd blocked` to verify the graph behaves as expected.

## Plan Update

Add or update this section in the plan file:

```markdown
## Beads Tracking
- Parent: <beads-id> - <title>
- Children:
  - <beads-id> - <title> (plan bullets: <numbers>; dependencies: <ids or none>)
- Policy: Beads tracks durable execution state; this markdown plan remains the implementation spec.
```

Do not mark implementation or validation checkboxes complete while materializing Beads. Checkbox updates belong to `parallel-executor` after actual work succeeds and is reconciled.

`parallel-executor` consumes this section as its execution map. Keep child mappings specific enough that a coordinator can assign each ready child to one worker without rereading the entire plan.

## Completion Response

Report:
- Plan file used.
- Parent Beads issue created or reused.
- Child issues created or reused.
- Dependencies added.
- Whether `bd ready`/`bd blocked` was checked.
- That no implementation, commit, push, Jira transition, or external publication was performed.
