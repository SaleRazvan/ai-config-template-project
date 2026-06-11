---
name: conventional-committer
description: "Create and push git commits for the user using the Conventional Commits subject format and always include a Jira issue key in the commit message. Use when Codex is asked to commit changes, make a commit, write a commit message, prepare a git commit, or commit and push with a structured message such as type(scope): description. Always require explicit user confirmation before running git commit or git push."
---

# Conventional Committer

## Purpose

Create commits authored as the user, using this subject structure:

```text
<type>[optional scope]: <description>
```

Use a single-line subject plus a Jira footer by default:

```text
<type>[optional scope]: <description>

Refs: <JIRA-KEY>
```

Add an additional body only when the user explicitly asks for one or when required by the repository's existing commit style. After a confirmed successful commit, push the new commit using the confirmed normal push command.

## Required Workflow

1. Inspect the repository state before proposing a commit:
   - Run `git status --short`.
   - Review staged changes with `git diff --staged`.
   - If nothing is staged, review unstaged changes with `git diff` and ask what should be staged before committing.
   - Do not stage unrelated, untracked, generated, secret, or binary files without calling them out and getting confirmation.

2. Check the commit author identity:
   - Run `git config user.name` and `git config user.email`.
   - Use the configured identity when it matches the user or is clearly the user's normal repository identity.
   - If name or email is missing, generic, or does not look like the user, ask for the correct author identity before committing.
   - Do not commit under an AI, bot, or assistant identity unless the user explicitly requests it.

3. Inspect the branch and push target:
   - Run `git branch --show-current`.
   - Run `git remote -v`.
   - Check the upstream with `git rev-parse --abbrev-ref --symbolic-full-name @{u}` when possible.
   - If an upstream exists, propose `git push`.
   - If there is no upstream but a single obvious remote exists, propose `git push -u <remote> <branch>`.
   - If the branch is detached, no remote exists, or multiple push targets are plausible, ask the user which remote/branch to use before proposing the commit.
   - Do not propose or run force-push commands.

4. Choose the Conventional Commit type:
   - `feat`: user-facing feature
   - `fix`: bug fix
   - `docs`: documentation-only change
   - `style`: formatting or whitespace only, no behavior change
   - `refactor`: code change that neither fixes a bug nor adds a feature
   - `perf`: performance improvement
   - `test`: tests added or corrected
   - `build`: build system or dependency change
   - `ci`: CI configuration or scripts
   - `chore`: maintenance not touching source or tests
   - `revert`: revert a previous commit

5. Select an optional scope only when it adds useful precision:
   - Use a short repository-relevant noun such as `auth`, `ci`, `deps`, `app`, `docs`, or `tests`.
   - Use lowercase letters, digits, dots, slashes, underscores, or hyphens.
   - Omit scope when it would be vague or forced.

6. Resolve the Jira issue key:
   - Always include one Jira issue key in the commit message.
   - Prefer an issue key explicitly provided by the user, such as `ACTP-7`.
   - If the user does not provide one, look for a Jira key in the branch name, staged diff, filenames, recent commits, or related Jira context.
   - If no Jira key can be determined, ask the user for the ticket key before proposing the commit.
   - If multiple plausible Jira keys are present, ask which one to use.
   - Do not invent a Jira issue key.

7. Write the description:
   - Before writing the message, gather enough task context to describe the committed work accurately:
     - Read local planning artifacts for the Jira key, such as `plans/<JIRA-KEY>.md`, `plans/<JIRA-KEY>/`, or a repository Jira-ticket/task folder if present.
     - If Atlassian/Jira tools are available and a Jira key is known, fetch the Jira issue for context.
     - If Confluence tools are available, search for pages related to the Jira key, project key, or task summary when they could clarify scope or acceptance criteria.
     - If Jira or Confluence access is unavailable, proceed from the local plan and diff; mention that limitation only when it affects confidence.
   - Use the staged diff as the source of truth, and use plan/Jira/Confluence context to make the commit subject and any needed body complete without adding unsupported claims.
   - Keep it concise and specific.
   - Prefer present-tense imperative wording.
   - Do not end the subject with a period.
   - Ensure the final subject matches `type(scope): description` or `type: description`.
   - Keep the Jira key out of the subject unless the repository's existing commit history consistently puts Jira keys in subjects.
   - Add the Jira key as the final footer line: `Refs: <JIRA-KEY>`.

8. Ask for confirmation before committing and pushing:
   - Show the exact files to be committed.
   - Show the Jira issue key that will be included.
   - Show the exact commit command or exact commit message.
   - Show the exact push command that will run after a successful commit.
   - Ask the user to confirm before running `git commit` or `git push`.
   - Do not treat the original request to commit as confirmation. Confirmation must happen after the message, file set, Jira key, and push command are shown.
   - A single explicit confirmation authorizes both the commit and the normal push command shown in the prompt.

9. Commit and push only after confirmation:
   - Stage only the confirmed files if staging is needed.
   - Run `git commit -m "<type>[optional scope]: <description>" -m "Refs: <JIRA-KEY>"` when no body is needed.
   - If a body is needed, keep the Jira footer as the final `-m` argument.
   - Use `--author "Name <email>"` only when required to commit in the user's name and after the user confirms that author.
   - If the commit fails, stop and do not push.
   - After a successful commit, run the confirmed normal push command.
   - After pushing, report the commit hash, subject, push target, and any files left uncommitted.

## Confirmation Template

Use a concise confirmation prompt:

```text
I will commit these files:
- path/to/file

Jira ticket:
ABC-123

Commit message:
type(scope): description

Refs: ABC-123

Push command:
git push

Confirm and I will run the commit, then push it.
```

## Guardrails

- Never run `git commit` without explicit confirmation in the current task.
- Never run `git commit` without a confirmed Jira issue key in the commit message.
- Never run `git push` without showing the exact push command and receiving explicit confirmation in the current task.
- Never push if the commit fails.
- Never amend, rebase, reset, force-push, or discard changes unless the user explicitly requests that operation.
- Never use `git push --force` or `git push --force-with-lease` as part of this skill.
- Preserve user changes that are outside the confirmed file set.
- If the diff contains credentials, tokens, private keys, or suspicious secrets, stop and ask before committing.
- If the change set mixes unrelated work, propose splitting it into multiple commits.
