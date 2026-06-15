---
name: confluence-documenter
description: Create a Confluence documentation page for completed project work from a local plan under `plans/`, the related Jira issue, and relevant Confluence context. Use when Codex is asked to document what was done for a Jira/task key, publish implementation notes to Confluence, create a task completion page, or turn a completed plan into Confluence documentation.
---

# Confluence Documenter

## Purpose

Create one Confluence page that documents completed work for a Jira/task plan. The page should be factual, useful for future maintainers, and grounded in the local plan, the actual repository changes, Jira context, and any relevant Confluence pages.

## Inputs

Prefer a user-provided Jira key or plan path such as `ACTP-8` or `plans/ACTP-8.md`.

If the user provides only a Jira key, use `plans/<JIRA-KEY>.md` in the current repo.

If the user provides no task reference:
- Infer a Jira key from the current branch name when practical, for example `work/actp-8-...` maps to `plans/ACTP-8.md`.
- If exactly one plan exists under `plans/`, use it.
- Otherwise ask for the exact Jira key or plan file.

## Context Gathering

Before writing the page:
- Read the full local plan file. Treat `## Requirements`, `## Implementation Plan`, `## Validation Plan`, `## Open Questions`, and `## Out Of Scope` as source material.
- Inspect the git diff, recent commit, or file changes that correspond to the task when available, so the page documents what was actually done rather than only what was planned.
- If Atlassian/Jira tools are available and the Jira key is known, fetch the Jira issue for summary, status, description, acceptance criteria, and URL.
- Search Confluence for pages related to the Jira key, project key, task summary, and repository/project name. Use this to find relevant background pages and the best documentation parent page.
- Use Teamwork Graph tools only when reasoning about relationships between Atlassian entities is needed. Do not use Teamwork Graph for basic Jira or Confluence CRUD when direct Jira/Confluence tools are available.

If Jira or Confluence auth is unavailable, continue with local plan and repository context only until page creation is required. If page creation cannot proceed, stop with a concise draft and the missing permission/capability.

## Parent Page Selection

Create the documentation as a child page under the right Confluence parent page.

Use the parent page the user provides when they give a Confluence URL or page ID.

If no parent is provided:
- Search Confluence for project documentation pages related to the Jira project key and repository name.
- Use a parent only when it is clearly the dedicated documentation area for this project or task family.
- If multiple plausible parent pages exist, list the candidates with titles and URLs and ask the user to choose.
- If no plausible parent page exists, ask for the target Confluence parent page before creating anything.

Before creating a new page, search under the selected parent or by title to avoid duplicating an existing task documentation page. If a matching page already exists, ask whether to update it unless the user explicitly requested an update.

## Page Content

Use Confluence HTML content when the tool supports it. Keep the document concise but complete.

Recommended title:

```text
<JIRA-KEY>: <task summary>
```

Recommended structure:
- Overview: one paragraph explaining the completed work and why it was done.
- Source Links: Jira issue, plan file path, PR/branch/commit if available, and relevant Confluence references.
- Requirements Covered: summarize the requirements that were implemented.
- Implementation Summary: describe important code, configuration, workflow, or UX changes.
- Validation: list tests, lint/build commands, manual checks, and their result.
- Files/Areas Changed: group notable files by purpose rather than dumping every generated dependency entry.
- Decisions And Assumptions: include only meaningful assumptions, tradeoffs, or constraints.
- Out Of Scope: copy or summarize out-of-scope items when useful to prevent future confusion.

Use only facts supported by the plan, Jira, Confluence, git history, or inspected repository state. Do not invent acceptance criteria, decisions, URLs, or validation results.

## Creation Workflow

1. Locate and read exactly one plan file.
2. Determine the Jira key and task summary.
3. Gather repository, Jira, and Confluence context.
4. Determine one target Confluence parent page.
5. Draft the page content and title.
6. Create the page with `createConfluencePage` when available, using `contentFormat: "html"` unless the available tool requires another format.
7. If page creation fails because of invalid HTML, fix the HTML and retry once.
8. After creation, fetch or inspect the created page when possible to verify title, parent, and readable content.

## Boundaries

Do not:
- Create a Confluence page before a target parent page is clear.
- Create more than one page for a task unless the user explicitly asks.
- Comment on Jira, transition Jira, assign Jira, create PRs, commit, or push unless the user explicitly asks.
- Publish secrets, tokens, private keys, or internal credentials found in diffs or config.
- Document speculative work that was planned but not completed.

## Completion Response

Report:
- Plan file used.
- Jira issue key and summary.
- Confluence parent page used.
- Created page title and URL.
- Main sources used: local plan, Jira, Confluence pages, git diff/commit.
- Any missing context, assumptions, or skipped verification.
