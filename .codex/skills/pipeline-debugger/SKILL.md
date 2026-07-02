---
name: pipeline-debugger
description: "Diagnose failing CI, GitHub Actions, build, test, lint, or deployment pipelines from GitHub checks, workflow logs, local log files, or pasted logs. Use when Codex is asked to debug a pipeline, inspect failing checks, explain CI failures, summarize large logs, identify the likely root cause, or recommend the next fix for broken automation."
---

# Pipeline Debugger

## Purpose

Diagnose failing automation without drowning the main task in logs. This skill is read-only by default: it identifies the failing check, extracts the useful evidence, and reports the likely cause and next fix path.

The skill must:
- Resolve the branch, PR, workflow run, check name, log file, or pasted log being debugged.
- Prefer focused log slices over full logs.
- Build a compact failure context before making a diagnosis.
- Distinguish root causes from downstream noise.
- Avoid changing files, rerunning pipelines, posting GitHub comments, or modifying external systems unless the user explicitly asks for that later.

## Shared Project Guidance

Read `AGENTS.md` when it exists and follow it for package manager, validation, branch, MCP, review, context compression, and safety conventions. If this skill conflicts with `AGENTS.md`, this skill's read-only diagnosis boundary wins.

## Inputs

Accept any of these targets:
- GitHub PR URL, PR number, branch name, or current branch.
- GitHub Actions workflow run URL or failing check name.
- Local log file path.
- Pasted CI, build, test, lint, deploy, or container logs.

If no target is explicit:
- Run `git status --short --branch`, `git branch --show-current`, and `git remote -v`.
- Resolve the matching PR or recent workflow run when GitHub tools are available.
- Ask for the PR, workflow run, or log file only when the target cannot be inferred safely.

## Tool Setup

Use GitHub MCP tools when available. If they are not loaded, call `tool_search` for `github pull request checks workflow logs actions`.

Use local shell reads for local files and repository context. Prefer `rg`, `tail`, `sed`, and targeted command output over loading entire logs.

Do not use Jira, Confluence, Figma, or other non-GitHub MCP context unless it is directly needed to explain the pipeline failure. Do not write to any external system.

## Log Triage

For large logs:
1. Inspect the failing job/check name and conclusion first.
2. Read the last 100-300 lines of the failing step.
3. Search the log for high-signal patterns:
   ```text
   FAIL
   failed
   error
   Error:
   TypeError
   ReferenceError
   Cannot find module
   Module not found
   TS[0-9]+
   ESLint
   expected
   received
   exit code
   permission denied
   timeout
   ```
4. Expand around the first high-confidence failure, not every matching warning.
5. Ignore dependency install progress, cache chatter, timestamps, repeated stack frames, and success output unless they explain the failure.

If multiple jobs failed, identify whether they share one upstream cause, such as install failure, missing environment variable, type error, or test setup breakage.

## Diagnosis Workflow

1. Identify the failing pipeline scope: provider, workflow, job, step, branch/PR, and commit SHA when available.
2. Extract a compact context packet:
   - Failing command or step.
   - First meaningful error.
   - Final failure lines.
   - Relevant file paths, test names, package names, or environment variables.
   - Confidence level and unresolved gaps.
3. Compare the failure with local project configuration when useful:
   - `package.json` scripts and package manager.
   - Workflow files under `.github/workflows/`.
   - Test, lint, build, TypeScript, Vite, or deployment config.
   - Recent changed files from the PR or branch.
4. Decide whether the cause is likely:
   - Code/test defect.
   - CI configuration issue.
   - Dependency or lockfile mismatch.
   - Missing secret or environment variable.
   - Toolchain/version mismatch.
   - Flaky test or infrastructure failure.
5. Recommend the smallest next fix or next inspection target.

Do not claim certainty when logs are incomplete. Say what evidence would confirm the diagnosis.

## Boundaries

Do not:
- Commit, push, rerun workflows, cancel workflows, approve PRs, post comments, transition Jira, or publish documentation unless the user explicitly asks and the relevant skill permits it.
- Read entire huge logs into context when targeted sections are enough.
- Treat warnings as root causes unless they directly precede or explain the failing exit.
- Fix files as part of this skill unless the user explicitly asks for implementation after the diagnosis.
- Expose secrets from logs. Redact tokens, private keys, passwords, and credential-like values in responses.

If the user asks to fix the diagnosed failure, route to `task-executor` or normal code-editing flow after reporting the diagnosis.

## Completion Response

Report:
- Pipeline target inspected.
- Failing workflow/job/step and command.
- Compact evidence excerpt or summary.
- Likely root cause with confidence.
- Recommended fix or next command/check.
- Context sources used: GitHub checks/logs, local workflow files, package scripts, pasted logs, or local log files.
- Any missing access, incomplete logs, skipped large sections, or assumptions.
- Confirmation that no external write was performed.
