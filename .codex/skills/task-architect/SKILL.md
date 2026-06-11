---
name: task-architect
description: "Plan implementation work from a task source such as a Jira ticket. Use when Codex is asked to architect, plan, inspect, or break down a task before implementation: fetch the ticket or requirements, ask questions when requirements are unclear, create a work branch from the task key and summary, and write an ordered bullet-by-bullet Markdown checklist in the project for a later executor skill."
---

# Task Architect

## Purpose

Turn a task source, usually a Jira ticket, into a project-local implementation plan without implementing the work.

The skill must:
- Look up the task source and understand the requirements.
- Ask questions before planning when material details are unclear.
- Create a new work branch using the required naming convention.
- Write an ordered bullet-by-bullet plan file inside the project.
- Stop after planning. Do not implement, commit, push, or transition Jira.

## Required Inputs

Require exactly one task reference. Prefer a Jira issue key or Jira issue URL, such as `ACTP-7`.

If the user provides no task, multiple tasks, or only vague text, ask for the exact task reference before doing anything else. For Jira-backed work, ask for the Jira issue key.

## Source Lookup

Use Atlassian/Jira tools when available:
- Fetch the issue by key or URL.
- Read the summary, description, issue type, status, assignee, labels, sprint, acceptance criteria, linked issues, comments, and relevant attachments when exposed.
- If direct fetch is blocked or the cloud/site is unknown, search Jira/Confluence for the key and fetch the matching issue.

If Jira tools are unavailable, ask the user to provide the ticket text or requirements.

Do not create, update, assign, comment on, or transition Jira issues as part of this skill.

## Ambiguity Gate

Ask concise questions before creating the branch or plan when:
- Acceptance criteria are missing or contradictory.
- The target behavior, affected user flow, environment, or integration is unclear.
- Multiple implementation directions would materially change the plan.
- Required credentials, external systems, or ownership boundaries are unknown.

If only minor details are unclear, create the plan and include them under `## Open Questions`.

## Branch Convention

Create a new branch before writing the plan.

Branch format:

```text
work/<task-key-lowercase>-<summary-slug>
```

Rules:
- Convert the task key to lowercase, for example `ACTP-7` becomes `actp-7`.
- Build `<summary-slug>` from the task summary: lowercase, ASCII, words separated by `-`, no punctuation.
- Keep the branch name under 80 characters when practical by trimming the slug.
- Example: `work/actp-7-set-up-github-actions-ci-pipeline`.

Before creating the branch:
- Run `git status --short`.
- Run `git branch --show-current`.
- If the working tree has uncommitted changes, ask whether to carry them into the new branch before switching.
- If already on the correct branch, reuse it.
- If the branch already exists, ask whether to switch to it or create a suffixed variant such as `work/actp-7-set-up-github-actions-ci-pipeline-2`.

Create the branch with:

```bash
git switch -c work/<task-key-lowercase>-<summary-slug>
```

Use `git switch work/<branch>` only when reusing an existing branch is explicitly safe.

## Plan File

Write the plan to:

```text
plans/<TASK-KEY>.md
```

Use the uppercase task key in the filename when the task has a key, for example `plans/ACTP-7.md`. Create the project-root `plans/` directory if it does not already exist.

If the file already exists, ask before overwriting. If the user wants to update it, preserve useful existing notes unless they explicitly ask for a rewrite.

## Plan Format

Use this Markdown structure:

```markdown
# <TASK-KEY>: <Task summary>

Source: <Jira URL, issue key, or task reference>
Status: <Task status>
Branch: <branch-name>
Created: <YYYY-MM-DD>

## Requirements
- <requirement inferred from the task source>

## Open Questions
- [ ] <question or "None">

## Implementation Plan
- [ ] 1. <one concrete implementation step>
- [ ] 2. <next concrete implementation step>

## Validation Plan
- [ ] <specific command, test, or manual check>

## Out Of Scope
- <explicit non-goals, if any>
```

## Bullet Quality

Make each implementation bullet:
- Ordered and independently executable by a later skill.
- Small enough to complete in one focused edit pass.
- Specific about likely files, modules, commands, or checks.
- Written as an action, not a vague goal.
- Free of implementation already performed by this skill.

Prefer 5-12 implementation bullets for normal tickets. Use fewer for tiny tickets and more only when the ticket genuinely requires it.

## Completion Response

After creating the branch and plan file, report:
- Task key/reference and summary.
- Branch name.
- Plan file path.
- Any open questions.
- A clear note that no implementation, commit, push, or Jira transition was performed.
