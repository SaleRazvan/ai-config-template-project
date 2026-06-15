---
name: sonar-checker
description: Check SonarQube/SonarCloud status for the current git branch using the Sonar MCP. Use when Codex is asked to check Sonar, inspect branch quality, summarize Sonar errors/issues, review the quality gate, or report whether the current branch has Sonar problems.
---

# Sonar Checker

## Purpose

Report a short, read-only Sonar summary for the branch currently checked out in the repo.

The skill must:
- Resolve the current git branch.
- Resolve the Sonar project key using local config first.
- Prefer a matching Sonar pull request analysis for the current branch.
- Report counts and highest-impact issues briefly.
- Avoid changing Sonar issue statuses or project settings.

## Tool Setup

Use the SonarQube MCP tools. If they are not loaded, call `tool_search` for `sonarqube project issues quality gate pull requests`.

Never use `change_sonar_issue_status` unless the user explicitly asks to accept, false-positive, or reopen an issue.

## Workflow

1. Run `git status --short --branch` and `git rev-parse --abbrev-ref HEAD`.
2. Resolve the Sonar project key in this order:
   - `.sonarlint/connectedMode.json` in the workspace root or a parent directory, using `projectKey`.
   - Root project config containing `sonar.projectKey`: `sonar-project.properties`, `pom.xml`, `build.gradle`, `build.gradle.kts`, or `package.json`.
   - CI config containing `sonar.projectKey`: `.github/workflows/*.yml`, `Jenkinsfile`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/config.yml`.
   - `search_my_sonarqube_projects` only if local config does not identify the project.
3. Call `list_pull_requests` for the project and match the current branch to a PR source branch.
4. Query quality status:
   - If a matching PR exists, call `get_project_quality_gate_status` with `projectKey` and `pullRequest`.
   - If no matching PR exists, call `get_project_quality_gate_status` with `projectKey` and clearly say the result is project-level, not branch-specific.
5. Query issues with `search_sonar_issues_in_projects`:
   - Use `projects: [projectKey]`.
   - Use `pullRequestId` when a matching PR exists.
   - Use `issueStatuses: ["OPEN", "CONFIRMED"]`.
   - Use `ps: 500` unless a smaller sample is enough.
6. Summarize the result in a short response:
   - Branch and project key.
   - Matched PR id, or `No matching PR analysis found`.
   - Quality gate status.
   - Total open/confirmed issue count.
   - Counts by severity: BLOCKER, HIGH, MEDIUM, LOW, INFO.
   - Counts by software quality when available: SECURITY, RELIABILITY, MAINTAINABILITY.
   - Up to five highest-severity issue examples with file, line, rule/key, and short message.

## Output Style

Keep the answer short. Prefer this shape:

```text
Sonar summary for <branch>:
- Project: <projectKey>
- Scope: PR <id> / project-level fallback
- Quality gate: <status>
- Issues: <total> open/confirmed
- Severity: <counts>
- Quality: <counts>
- Top issues: <max 5 concise bullets>
```

If the project key cannot be resolved or Sonar has no branch/PR analysis for the current branch, say that clearly and stop after the shortest useful summary.
