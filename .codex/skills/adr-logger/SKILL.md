---
name: adr-logger
description: "Create or update Architecture Decision Records for durable project decisions. Use when Codex is asked to write an ADR, log a decision, document an architecture/workflow/tooling choice, capture alternatives and tradeoffs, or preserve a project convention that future agents and developers should follow."
---

# ADR Logger

## Purpose

Capture durable decisions without turning ordinary implementation details into documentation noise.

This skill must:
- Decide whether the decision is ADR-worthy.
- Create one concise ADR under `docs/adr/`.
- Use the repository ADR template when present.
- Ground the ADR in the task, plan, code, and discussion context.
- Avoid creating ADRs silently in the background.

## Shared Project Guidance

Read `AGENTS.md` when it exists and follow it for branch, validation, MCP, review, and external-write conventions. If this skill conflicts with `AGENTS.md`, this skill's ADR scope and no-silent-write rules win.

## ADR-Worthy Decisions

Create or recommend an ADR for decisions that future work should preserve:
- Project-wide architecture, workflow, or process conventions.
- Dependency, framework, runtime, package-manager, CI, deployment, or integration choices with tradeoffs.
- Task tracking, planning, branching, review, release, documentation, or permission models.
- Rejected alternatives that future agents or developers are likely to reconsider.
- Cross-cutting design constraints that affect multiple future tasks.

Do not create ADRs for:
- One-off implementation details.
- Small refactors or bug fixes with no durable policy.
- Decisions already fully captured in `AGENTS.md`, a plan, or existing ADR.
- Speculation that has not been accepted by the user or task context.

If a decision looks ADR-worthy but the user did not ask to create an ADR, report the recommendation instead of writing a file.

## Source Resolution

Use existing ADRs under `docs/adr/` to pick the next number. Use four digits:

```text
docs/adr/0001-short-slug.md
docs/adr/0002-another-decision.md
```

Use `docs/adr/0000-template.md` when present. If it does not exist, use the template structure in this skill.

Slug rules:
- Lowercase ASCII.
- Words separated by hyphens.
- No punctuation.
- Keep it short and descriptive.

## ADR Format

Use this structure:

```markdown
# ADR NNNN: <Decision Title>

Date: <YYYY-MM-DD>
Status: Proposed | Accepted | Superseded
Source: <Jira key, plan path, PR, or discussion reference>

## Context
- <facts and forces that made the decision necessary>

## Decision
- <the decision future work should follow>

## Alternatives Considered
- <alternative>: <why not chosen>

## Consequences
- <positive, negative, and operational consequences>
```

Prefer `Accepted` only when the user, task plan, or existing project steering makes the decision clear. Use `Proposed` when documenting a recommendation that still needs approval.

## Workflow

1. Read existing `docs/adr/*.md` files enough to avoid duplicates and choose the next number.
2. Read relevant context: `AGENTS.md`, local plan, Jira key, PR, code/config, or conversation summary.
3. State whether the decision is ADR-worthy.
4. If the user explicitly asked to create/log/write the ADR, create the ADR file.
5. If the user did not ask for file creation, recommend creating an ADR and include a concise draft in the response.
6. Do not edit unrelated ADRs unless the new decision supersedes one; when superseding, update only the old ADR `Status` line and add a short reference to the new ADR.

## Boundaries

Do not:
- Create an ADR for every task.
- Use ADRs as implementation plans.
- Rewrite `AGENTS.md` or plans as part of this skill unless the user asks.
- Publish Confluence pages, transition Jira, commit, or push unless explicitly requested and the relevant skill permits it.
- Invent rationale or alternatives not supported by source context.

## Completion Response

Report:
- ADR-worthy decision detected or skipped.
- ADR file created or draft recommended.
- Status used.
- Source context used.
- Any existing ADR superseded or duplicate avoided.
- Confirmation that no external write was performed.
