Follow these steps in order:

## 1. Determine current branch context

Run `git branch --show-current` to get the current branch name.

**If on a feature branch** (anything other than `master`):

- Check for uncommitted changes with `git status`.
- If there are changes, stage all with `git add -A` and commit them. Write a commit message following the standards in `docs/version-control.md`: imperative mood, under 72 characters, no AI/tool attribution.
- Rebase the feature branch onto `master`: `git rebase master`
- Switch to `master`: `git checkout master`
- Fast-forward merge: `git merge --ff-only <feature-branch>`
- Delete the feature branch: `git branch -d <feature-branch>`

**If already on `master`**:

- Check for uncommitted changes with `git status`.
- If there are uncommitted changes, ask the user: "You are on master with uncommitted changes. Should these be committed directly to master?" Wait for confirmation before proceeding. If confirmed, stage and commit them with a message following `docs/version-control.md`.
- If there are no uncommitted changes, continue to step 2.

## 2. Prompt for a new feature branch

Ask the user: "Should a new feature branch be created? If yes, briefly describe the feature."

- If the user provides a description, derive a short kebab-case branch name from it (prefixed with `feature/` or `fix/` as appropriate) and create it: `git checkout -b <branch-name>`
- If the user declines, do nothing further.
