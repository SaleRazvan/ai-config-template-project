---
name: jira-story-writer
description: "Draft Jira stories, tasks, bugs, and subtasks from requirements, code changes, PRs, or discussions. Use when the user asks to write a Jira story, create a ticket, draft a PM chore, turn requirements into Jira work, or assign work to a sprint/user."
---

# Jira Story Writer

## Shared Project Guidance

Read `AGENTS.md` when it exists and follow it for package manager, validation, branch, MCP, review, and safety conventions. If this skill conflicts with `AGENTS.md`, this skill's Jira draft and confirmation guardrails win.

When requirements, PRs, Jira threads, or repository context are large or noisy, apply the `AGENTS.md` context compression rule before drafting tickets.

## Ticket Drafting

When asked to create Jira tickets:

- Infer information from repository context, git history, branch names, PRs, AGENTS.md, and Jira MCP data.
- Ask questions only when missing information materially affects the outcome.

For each ticket determine:
- project key
- issue type
- summary
- business value
- acceptance criteria
- technical notes
- dependencies

Output format:

Summary:
<short actionable title>

Description:

Context:
...

User Story:
As a ...
I want ...
So that ...

Acceptance Criteria:
- Given ...
  When ...
  Then ...

Technical Notes:
- ...

If Atlassian MCP is available:
- Discover Jira projects when needed.
- Search for similar tickets.
- Avoid duplicates.

Never create, update, or transition Jira tickets without user confirmation.
Always show drafts first.
