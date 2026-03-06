# Version Control Standards

## Branching

- Always create a new branch when starting a new feature or fix.
- New branches start from `main` unless the work logically depends on another in-progress branch, or unless specified otherwise.
- Use descriptive branch names in kebab-case (e.g., `feature/user-auth`, `fix/login-redirect`).

## Integrating Changes

- Always use **rebase** instead of merge when integrating changes from another branch.
- To update a feature branch with the latest `main`: `git rebase main`
- To integrate a completed feature: rebase onto the target branch before merging (fast-forward preferred).
- Never use `git merge` to pull in upstream changes into a feature branch.

## Commit Messages

- Use the imperative mood in the subject line (e.g., "Add login form" not "Added login form").
- Keep the subject line under 72 characters.
- Do not reference tooling or AI assistants in commit messages.
- Separate subject from body with a blank line when additional context is needed.
- Reference issue numbers where relevant (e.g., `Closes #42`).

### Format

```
<short summary in imperative mood>

[Optional body explaining what and why, not how]

[Optional footer with issue references]
```

### Examples

```
Add workout entry form with set tracking

Closes #12
```

```
Fix date parsing bug in history view
```

## General Rules

- Commit early and often; keep commits focused and atomic.
- Do not commit secrets, credentials, or environment files.
- Keep `main` stable and deployable at all times.
- Delete branches after they are merged into `main`. There is no data loss: all commits are preserved in the history of `main`.
