---
name: project-orchestrator
description: "Route short project requests to the right local workflow skills. Use when the user says review PR, review MR, implement a task, PM chore, document task, debug pipeline, or provides a Jira key, branch id, PR reference, or vague project workflow request without naming the exact skill."
---

# Project Orchestrator

## Purpose

Act as the routing layer for normal project work so the user can give short instructions without naming every individual skill.

The skill must:
- Read `AGENTS.md` when it exists and use it as shared project steering.
- Classify the user's request by intent, task key, branch, PR/MR reference, or workflow phrase.
- Select the smallest set of local skills needed for the request.
- Run those skills in the right order, reading each selected skill's `SKILL.md` before acting.
- Prefer Beads orchestration only for work that will run through `parallel-executor`, while keeping sequential plan execution on the direct executor path.
- Route live parallel execution to `parallel-executor`; keep `task-executor` and `bullet-executor` sequential.
- Keep external writes gated by the selected skill's confirmation rules.

## Intent Routing

Use this routing by default:

- Story, ticket, Jira story, PM chore, or new requirement: use `jira-story-writer`.
- Architect, plan, break down, inspect ticket, or prepare task: use `task-architect`.
- Beads, materialize plan, split plan into Beads, dependency graph, durable handoff, or create local execution tasks for parallel work: use `beads-planner`.
- Parallel execute, run in parallel, worker agents, subagents, parallel agents, execute ready Beads children, or finish a Beads-backed plan in parallel: use `parallel-executor`. If the plan has no Beads child mapping yet, use `beads-planner` first and then `parallel-executor` only when the user asked to continue after materialization.
- Implement, execute, finish task, complete plan, or a Jira key with implementation intent: use `task-executor` unless the user explicitly asks for parallel execution or the request targets a Beads parent/child graph. Do not materialize this path into Beads.
- Next bullet, one bullet, continue one step, or incremental execution: use `bullet-executor`.
- Commit, commit everything, push, or conventional commit: use `conventional-committer`.
- ADR, decision record, log decision, architecture decision, document decision, or durable project convention: use `adr-logger`.
- Review PR, review MR, review branch, review my changes, or PR URL/number: use `github-reviewer`.
- Document task, Confluence docs, implementation notes, or completion page: use `confluence-documenter`.
- Debug pipeline, failing check, CI failure, build failure, test pipeline, workflow failure, or deployment log: use `pipeline-debugger`.

When a request maps to multiple skills, choose the normal sequence from `AGENTS.md`. Use `beads-planner` after `task-architect` only when the work is intended for `parallel-executor`. Use `parallel-executor` after `beads-planner` only for live parallel execution of a Beads-backed plan. Otherwise use `task-executor` or `bullet-executor` for sequential work, regardless of plan size. Do not run later workflow steps, such as commit or Confluence publication, unless the user asks for them or the active skill's confirmation flow reaches that point.

## Reference Resolution

Resolve shorthand before routing:

- Jira/task keys such as `ACTP-9` map to local plans under `plans/<KEY>.md` and Jira context.
- Beads issue IDs such as `ai-config-template-project-lvm` map to `bd show <id>` and any linked local plan in the issue description or plan `## Beads Tracking` section.
- Branch ids or branch names map to the current local branch, matching GitHub PRs, and Jira keys embedded in the name.
- PR URLs, PR numbers, or `owner/repo#123` map to GitHub review work.
- `MR` means pull request unless the repository has a different merge-request integration exposed by tools.

If multiple targets are plausible and choosing one could affect external writes, ask for the exact target.

## Parallel Context

Gather independent read-only context in parallel when identifiers are known:

- Local plan and repository files.
- Existing ADRs under `docs/adr/`.
- Beads issue details, ready work, and blockers.
- Jira issue details.
- Confluence background pages.
- GitHub PR metadata, files, checks, comments, and commits.

Do not parallelize steps that depend on previous results, modify external systems, or require confirmation.

## Safety

- Do not commit, push, approve, comment externally, create Confluence pages, transition Jira, or assign Jira unless the selected skill permits it and the user has provided the required confirmation.
- Do not create or close Beads issues for theoretical questions, simple explanations, or tiny edits where no durable tracking value exists.
- Do not create ADR files unless the user explicitly asks to create, log, write, or document the decision as an ADR.
- Preserve uncommitted user changes.
- Prefer read-only MCP calls until the workflow clearly reaches a write step.
- If the request is only a theoretical question, answer directly and do not invoke execution skills.

## Completion Response

Report:
- Which intent was detected.
- Which skills were used and in what order.
- The task, branch, PR, or document target resolved.
- Any ADR-worthy decision detected, created, or recommended.
- Any Beads issues created, claimed, closed, or skipped.
- Any external writes performed or skipped.
- Any blockers or follow-up workflow step that remains.
