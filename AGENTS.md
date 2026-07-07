# Project Agent Guidelines

Use this file as shared steering for local project skills and ad hoc agent work.

## Project Defaults

- This is a React + Vite + TypeScript app.
- Use the repository lockfile and package manager already in place. This project uses Yarn.
- Prefer existing source structure, components, tests, and style conventions over new patterns.
- Use `rg`/`rg --files` for repository searches.
- Keep changes scoped to the Jira task, plan, PR, or branch being handled.

## Normal Workflow

1. `jira-story-writer` drafts or creates Jira work when requirements start as plain text.
2. `task-architect` turns a Jira/task key into a branch and `plans/<KEY>.md`.
3. `beads-planner` materializes only plans intended for `parallel-executor` into Beads tasks and dependencies.
4. `parallel-executor` runs Beads-backed plan work through ready child issues and isolated worktrees when the plan can safely run in parallel.
5. `task-executor` implements the full plan sequentially, or `bullet-executor` handles one bullet sequentially. These executors do not create, claim, close, or update Beads issues.
6. `conventional-committer` commits and pushes the confirmed changes.
7. `pipeline-debugger` diagnoses failing CI, build, test, lint, deployment, or workflow logs without external writes.
8. `adr-logger` captures durable architecture, workflow, tooling, or process decisions when explicitly requested or when an agent recommends ADR capture.
9. `github-reviewer` reviews the PR/MR with Jira, Confluence, and local plan context.
10. `confluence-documenter` documents completed work after implementation and review context exist.

Use `project-orchestrator` as the front door for short requests such as `review PR`, `review MR`, `implement ACTP-9`, `debug pipeline`, `document task`, or a branch/task id.

## Workflow State Model

- Jira remains the stakeholder-facing intake, status, sprint, and defect-tracking layer when external visibility is needed.
- `plans/<KEY>.md` files are implementation specs and execution checklists for agents; they are not the durable backlog.
- ADRs under `docs/adr/` capture durable project decisions that future work should preserve; do not use ADRs for ordinary implementation details.
- Beads is the repo-local durable coordination layer for work that needs dependency tracking, blockers, claiming, follow-up issues, handoff, or parallel agent coordination.
- Do not create Beads issues for simple questions, tiny edits, one-off sequential work, or current-turn scratch tracking. Use direct execution, `bullet-executor`, or `task-executor` for those cases.
- Materialize plan work into Beads only when the execution path is `parallel-executor`. Sequential `task-executor` and `bullet-executor` runs should use the markdown plan directly and leave Beads untouched.
- When a plan is materialized into Beads, add a `## Beads Tracking` section with the parent and child issue IDs. `parallel-executor` uses those IDs as the worker queue and reconciles completed child issues back to plan checkboxes.

## Parallel Beads Execution

- Keep `task-executor` and `bullet-executor` sequential. Use them for ordered work, tiny changes, or cases where a single agent should own plan checkbox updates directly.
- Use `beads-planner` only when the next execution path is `parallel-executor`; use `parallel-executor` only after `beads-planner` has created or confirmed a Beads graph for the plan.
- Treat Beads child issues, not markdown checkboxes, as the live parallel execution state. Use `bd ready`, `bd blocked`, `bd show`, `bd update --claim`, and `bd close` to coordinate worker progress.
- Use Git worktrees as the default isolation mechanism for parallel implementation. Prefer sibling worktree paths such as `../<repo-name>-<beads-short-id>` and worker branches such as `work/<task-key-lowercase>-<beads-short-id>`.
- Assign each worker a single ready Beads child issue and a disjoint file/module ownership boundary. Do not parallelize children that are likely to edit the same files or depend on each other's unmerged changes.
- Workers should not edit `plans/<KEY>.md`. The coordinator integrates worker changes, runs validation, closes completed child Beads issues, and then updates plan checkboxes from the closed child mappings.
- Close the parent Beads issue only after all required child issues are closed, integration is complete, and the plan validation checks have passed.
- External writes remain gated: parallel workers must not commit, push, transition Jira, publish Confluence pages, or publish GitHub reviews unless the user explicitly asks and the relevant skill permits it.

## Branch And Commit Conventions

- Work branches use `work/<task-key-lowercase>-<summary-slug>`.
- Commit subjects use Conventional Commits: `<type>[optional scope]: <description>`.
- Commit messages include a Jira footer: `Refs: <JIRA-KEY>`.
- Do not commit, push, transition Jira, create Confluence pages, or publish GitHub reviews unless the active skill and user confirmation allow it.

## Validation

- Use targeted checks first, then broader checks when the change risk warrants it.
- Common commands are `yarn test`, `yarn build`, and `yarn lint`.
- For TypeScript or React changes, watch for deprecated local typings and framework APIs, not only failing tests.

## Decision Records

- Consider `adr-logger` for non-trivial workflow, architecture, dependency, CI, release, review, or permission decisions that future agents should preserve.
- If a decision looks ADR-worthy but the user did not ask to create one, recommend ADR capture instead of writing a file silently.
- Do not create ADRs for one-off implementation details, small refactors, or ordinary bug fixes.

## MCP Context

- Use Jira for ticket requirements, status, assignee, sprint, and acceptance criteria.
- Use Confluence for project context, decisions, prior documentation, and completion docs.
- Use GitHub for PR files, commits, checks, review comments, and published reviews.
- Use Figma MCP for Figma design reads or writes when requested.

## Review Policy

- GitHub-visible review text must disclose AI involvement.
- Publish PR review comments only for medium-or-higher concerns.
- Suppress low-priority nits and nuances from GitHub comments.
- Approve or leave an all-good AI-disclosed review when there are no medium-or-higher concerns and approval is available.

## Context Compression

- Read the smallest useful local files and MCP objects first.
- Before reasoning over large or noisy inputs, create a compact context packet instead of loading everything into the main task.
- Use compression for CI logs over a few thousand lines, large PR diffs, long Jira/Confluence threads, or broad commit histories.
- Preserve key facts, source references, confidence, unresolved gaps, and the next expansion target if more context is needed.
- For large logs, inspect the tail or pre-filtered failure sections first, then expand only if the failure is not found.
- Do not compress small local tasks where the compression step would cost more context than it saves.

## Agent Reporting

- For non-trivial workflows, end with a short best-effort agent report.
- Include MCP servers used and approximate call counts grouped by server, for example Atlassian, GitHub, or Figma.
- Include local tool usage grouped by type, such as shell reads, file edits, validation commands, browser checks, or image/design tools.
- State whether context compression was used and what large inputs were compressed or skipped.
- Report context size as `small`, `medium`, or `large` unless exact token metrics are exposed by the runtime.
- Say `exact token count unavailable` or `exact MCP/tool-call count unavailable` when exact metrics cannot be observed.
- Skip the agent report for tiny questions, simple explanations, or one-command checks where the report would add noise.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:970c3bf2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for durable/shared task tracking such as parallel work, blockers, dependencies, handoff, and follow-up work. Do not create Beads issues for tiny edits or purely sequential current-turn work.
- Do not use TodoWrite, TaskCreate, or ad hoc markdown TODO lists as a durable backlog.
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for durable/shared task tracking when it adds coordination value. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd dolt push
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->
