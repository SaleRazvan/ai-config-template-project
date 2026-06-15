# Local Skill Sequence

## Short Summary
- `jira-story-writer`: drafts Jira stories/tasks/bugs from requirements or context.
- `task-architect`: turns one Jira/task into a branch and `plans/<KEY>.md`.
- `task-executor`: executes a whole plan from unchecked bullets through validation.
- `bullet-executor`: executes exactly one unchecked plan bullet, then stops.
- `sonar-checker`: checks Sonar after the branch/PR has been committed, pushed, and analyzed.
- `conventional-committer`: creates and pushes confirmed Conventional Commits with Jira refs.
- `github-reviewer`: reviews PRs with GitHub, Jira, and Confluence context.
- `confluence-documenter`: publishes a Confluence page documenting completed work.

## Normal Sequence
1. `jira-story-writer` creates or drafts the Jira work.
2. `task-architect` creates the work branch and implementation plan.
3. `task-executor` completes the plan end to end.
4. `bullet-executor` is the incremental alternative to step 3.
5. `conventional-committer` commits and pushes the finished work.
6. `sonar-checker` checks the pushed branch/PR after Sonar analysis exists.
7. `github-reviewer` reviews the PR and leaves only relevant comments.
8. `confluence-documenter` documents what was done after completion.
