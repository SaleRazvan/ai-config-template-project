# ACTP-10: Add advanced AI workflow capacities to the project POC

Source: https://ai-config-template-project.atlassian.net/browse/ACTP-10
Status: In Progress
Branch: work/actp-10-add-advanced-ai-workflow-capacities-to-the-project-poc
Created: 2026-07-02

## Requirements
- Add or document central-agent steering for parallelizing light independent AI work.
- Use Git worktrees as the isolation mechanism for safe parallel agent execution.
- Add a logs/log parser capacity for large CI or pipeline logs.
- Document and apply token consumption strategies across large/noisy context workflows.
- Add Beads setup or integration guidance as part of the AI workflow POC.
- Add compression/distillation pre-agent behavior for large context packets.
- Document agent permission optimization, including file access, external writes, MCP access, and confirmation gates.
- Add agent reporting guidance for context size and MCP server/tool call usage when available.
- Keep the AI capacities discoverable through `AGENTS.md`, local skills, MCP config, and `plans/SKILL-SEQUENCE.md`.

## Open Questions
- [x] Which Beads implementation/config should this project use if no existing project convention is present? Use the repository-local `.beads` workspace with `bd`, keep Jira stakeholder-facing, keep `plans/*.md` as implementation specs, and use `beads-planner` only when durable coordination adds value.
- [ ] Does the active Codex/MCP runtime expose exact context-size and MCP/tool-call counts, or should reporting be best-effort when exact metrics are unavailable?

## Implementation Plan
- [x] 1. Inspect the current AI setup and carried uncommitted changes in `AGENTS.md`, `plans/SKILL-SEQUENCE.md`, `.codex/config.toml`, and `.codex/skills/*/SKILL.md` to separate already-covered capacities from missing ACTP-10 work.
- [x] 2. Update `AGENTS.md` with concise central-agent steering rules for light parallel work, including when parallelization is appropriate and when sequential execution is required.
- [x] 3. Add Git worktree guidance for parallel agents, including branch/worktree naming, isolation rules, cleanup expectations, and warnings around shared external writes.
- [x] 4. Update `project-orchestrator` or the relevant local steering so short requests can route light parallel work safely while preserving confirmation gates for commits, Jira, Confluence, and GitHub writes.
- [x] 5. Add a logs/log-parser capacity, either as a dedicated local skill/helper script or a documented workflow, that tails large CI logs first, strips low-value noise, searches failure patterns such as `FAIL`, and expands only when needed.
- [x] 6. Document token consumption strategies in shared steering and high-context skills, including selective MCP reads, pagination limits, context packets, source references, and deferred expansion.
- [x] 7. Add Beads setup or integration guidance after identifying the expected local configuration, and explain how it fits with Jira plans and agent execution.
- [x] 8. Ensure compression/distillation pre-agent behavior is complete and discoverable in `AGENTS.md`, relevant skills, and `plans/SKILL-SEQUENCE.md`.
- [x] 9. Document agent permission optimization for filesystem scope, MCP environment variables, read-only defaults, external write confirmations, and safe escalation boundaries.
- [x] 10. Add an agent reporting convention or template for final responses that reports context usage estimates, MCP/tool call counts, unavailable metrics, and important limitations when the runtime exposes or allows tracking them.
- [x] 11. Update `plans/SKILL-SEQUENCE.md` as the AI capacities README so it lists the new capabilities, how to invoke them naturally, their sequence, and any caveats such as best-effort reporting or missing exact metrics.
- [x] 12. Review the final AI setup for duplicated or conflicting instructions across `AGENTS.md`, local skills, `.codex/config.toml`, and `plans/SKILL-SEQUENCE.md`, then tighten wording where needed without adding unrelated abstractions.

## Validation Plan
- [x] Run `git diff --check`.
- [x] Run the skill validator for any new or changed skill when available, or a local YAML/frontmatter sanity check if the validator is blocked by missing dependencies.
- [x] If a log parser script/helper is added, run it against a representative sample log or fixture and confirm the output is a compact failure-focused context packet.
- [x] Run `rg "parallel|worktree|log parser|token|Beads|compression|permission|reporting|MCP" AGENTS.md plans/SKILL-SEQUENCE.md .codex/skills` to confirm the new capacities are discoverable.
- [x] Run `yarn test` only if application code, package scripts, or test tooling are changed.

## Beads Tracking
- Related issue: ai-config-template-project-lvm - Adapt Codex workflow for optional Beads orchestration.
- Related issue: ai-config-template-project-0em - Add Beads parallel executor workflow.
- Related issue: ai-config-template-project-tn5 - Keep sequential executors out of Beads materialization.
- Policy: Beads tracks durable execution state for parallel plan execution; this markdown plan remains the implementation spec for stakeholders and sequential executors.

## Out Of Scope
- Running multiple live agents as part of this planning task.
- Building an enterprise-grade orchestration service or production log ingestion backend.
- Committing personal tokens, machine-local paths, or private credentials.
- Changing Jira, Confluence, or GitHub data beyond what the active user explicitly requests.
- Implementing exact context-size or tool-call metrics if the runtime does not expose them programmatically.
