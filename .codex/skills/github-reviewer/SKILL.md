---
name: github-reviewer
description: Review GitHub pull requests with GitHub MCP, using Jira and Confluence MCP context when helpful, and publish AI-disclosed medium-or-higher PR review comments or clean approvals on GitHub. Use when Codex is asked to review a GitHub PR, inspect PR changes, comment on a PR, approve a PR, check PR conventions, verify branch or commit naming against local task/commit conventions, or provide high-signal review feedback.
---

# GitHub Reviewer

## Purpose

Review a GitHub pull request and publish concise, relevant AI-disclosed impressions on GitHub unless the user asks for a local-only review.

The skill must:
- Read the PR, diff, changed files, existing comments, checks, branch, and commits.
- Use Jira and Confluence context when it clarifies requirements or acceptance criteria.
- Check branch naming against `task-architect`.
- Check commit messages against `conventional-committer`.
- Classify findings by severity and comment only on medium-or-higher concerns.
- Suppress low-priority findings, nuances, and nits from GitHub review comments.
- Clearly say the review was done by AI in every GitHub-visible review body, line comment, issue comment, or approval body.
- Submit a concise all-good approval when no medium-or-higher findings remain and the PR is otherwise healthy.
- Avoid noisy comments on insignificant style nits.

## Tool Setup

Use GitHub MCP tools. If they are not loaded, call `tool_search` for `github pull request review comments files commits`.

Use Atlassian/Jira and Confluence MCP tools only when a Jira key or task context is present or needed. Read context only; do not update Jira or Confluence as part of this skill.

Do not merge, close, update, request changes, push files, or request Copilot review unless the user explicitly asks.

## PR Resolution

Accept any of these inputs:
- GitHub PR URL.
- `owner/repo#123`.
- PR number when the local remote clearly identifies `owner/repo`.
- Current branch when it has exactly one matching open PR.

When the PR is not explicit:
1. Run `git status --short --branch`, `git branch --show-current`, and `git remote -v`.
2. Resolve the repository from the remote.
3. Use `list_pull_requests` or `search_pull_requests` to find the matching PR.
4. If more than one PR matches, ask for the exact PR.

## Context Gathering

Use these GitHub reads before reviewing:
- `pull_request_read` with `get` for title, body, base, head branch, author, and head SHA.
- `pull_request_read` with `get_files` for changed files.
- `pull_request_read` with `get_diff` for reviewable hunks.
- `pull_request_read` with `get_review_comments`, `get_reviews`, and `get_comments` to avoid duplicates.
- `pull_request_read` with `get_check_runs` and `get_status` for CI context.
- `list_commits` or `get_commit` for commit subjects and details when needed.

Extract Jira keys from the PR title, body, branch name, commit messages, changed file paths, and local plan filenames.

For each likely Jira key:
- Read `plans/<JIRA-KEY>.md` if it exists locally.
- Fetch Jira issue details when Atlassian tools are available.
- Search Confluence for pages related to the Jira key, project key, or task summary only when requirements are unclear or the PR claims work that needs context.

Gather GitHub, Jira, Confluence, and local plan reads in parallel when their identifiers are already known and the reads are independent.

## Convention Checks

Check the head branch against the `task-architect` convention:

```text
work/<task-key-lowercase>-<summary-slug>
```

Rules:
- Task key must be lowercase in the branch, for example `ACTP-7` becomes `actp-7`.
- Summary slug must be lowercase ASCII words separated by `-`, with punctuation removed.
- Keep the branch under 80 characters when practical.

Check commits against the `conventional-committer` convention:

```text
<type>[optional scope]: <description>

Refs: <JIRA-KEY>
```

Rules:
- Subject must be Conventional Commits style.
- Type must be one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`.
- Jira key must be present as a footer line `Refs: <JIRA-KEY>`.
- Do not require the Jira key in the subject unless the repository history consistently does that.

For convention failures, prefer a single concise general review comment instead of many repeated line comments.

## Review Judgment

Classify every candidate finding before deciding whether it belongs on GitHub:
- `High`: likely bug, security issue, data loss, broken requirement, failing check, or workflow violation that should block merge until addressed.
- `Medium`: plausible bug, missing explicit requirement coverage, meaningful test gap for risky behavior, or convention/check issue worth addressing before merge.
- `Low`: minor docs cleanup, naming nuance, formatting preference, already-covered test improvement, readability suggestion, or anything unlikely to affect behavior or workflow.

Only publish GitHub line comments or finding comments for `Medium` or `High` findings. Do not publish `Low` findings to GitHub. If the review has only `Low` findings or no findings, treat the PR as good for review purposes.

Prioritize comments on:
- Bugs, regressions, data loss, race conditions, broken UX, or incorrect state.
- Security, secrets, authorization, privacy, or unsafe dependency behavior.
- Requirement gaps compared with Jira, local plan, or Confluence context.
- Missing or weak tests for risky changed behavior.
- CI/check failures that indicate real defects.
- Branch or commit convention violations that would affect repository workflow.

Usually skip:
- Pure preference comments.
- Minor formatting already covered by tooling.
- Naming suggestions with no behavioral impact.
- Comments that only restate what the code does.
- Low-priority documentation cleanup or test nuance when the behavior is already covered.
- Multiple comments about the same underlying issue.

It is expected to leave zero line comments when there are no medium-or-higher findings. In that case, publish an AI-disclosed approval saying the PR looks good, unless the user asked for a local-only review or explicitly said not to approve.

## Commenting Workflow

If the user asks for a local-only review, dry run, draft findings, or says not to post, report findings locally and do not write to GitHub.

Otherwise publish the review on GitHub:
1. Build a short candidate finding list first.
2. Classify each candidate as `High`, `Medium`, or `Low`.
3. Drop weak, duplicate, and `Low` findings from GitHub comments. Do not publish low-priority comments as line comments, issue comments, or review-body findings.
4. Aim for 0-5 `Medium`/`High` comments; exceed that only when the PR has many independent material issues.
5. Prefer line review comments for `Medium`/`High` issues that can be anchored to changed diff lines.
6. Prefix every GitHub-visible review body with `AI review by Codex.` so the source is explicit before any findings or approval text.
7. Prefix every line review comment and issue comment with `AI review:`. Do not hide the disclosure in HTML comments or only in the final summary.
8. Use the review body for the overall impression, unanchored findings, convention results, check status, or a clean-review summary.
9. If posting line comments, create a pending review with `pull_request_review_write` method `create`, add AI-disclosed line comments with `add_comment_to_pending_review`, then submit with an AI-disclosed review body through `submit_pending`.
10. If posting only a review body, use `pull_request_review_write` method `create` with an AI-disclosed `body` and an `event`.
11. Use event `COMMENT` for reviews with `Medium` or `High` findings.
12. Use event `APPROVE` when there are no `Medium` or `High` findings and all of these are true: branch and commit conventions pass, required checks are passing or clearly not available, and no blocker prevents a confident review. The approval body must still start with `AI review by Codex.`.
13. If GitHub rejects approval, for example because the reviewer cannot approve their own PR, fall back to event `COMMENT` with an AI-disclosed all-good review body and say approval was unavailable in the completion response.
14. Use `add_issue_comment` only when review comments are not appropriate or the review API is unavailable, and prefix that issue comment with `AI review by Codex.`.

Never use `REQUEST_CHANGES` unless the user explicitly asks for that review decision.

## Comment Style

Write comments that are specific, actionable, and brief:
- Start every published GitHub comment with the required AI disclosure.
- State the concrete risk or requirement mismatch.
- Point to the behavior that should change.
- Mention Jira/Confluence context only when it supports the finding.
- Avoid exaggerated language.
- Do not include long code rewrites unless a short snippet makes the fix obvious.

Good shape:

```text
AI review:

This allows an empty title to be saved after trimming whitespace, which breaks the ACTP-8 requirement that task titles stay non-empty. Consider validating the trimmed value before updating state.
```

## Completion Response

Report:
- PR reviewed.
- Context used: GitHub only, or GitHub plus Jira/Confluence/local plan.
- Convention checks performed.
- GitHub review event submitted: `COMMENT`, `APPROVE`, or none for local-only.
- Number of line comments posted and whether a review body was posted.
- Any blockers, such as missing PR access or unanchorable findings.
