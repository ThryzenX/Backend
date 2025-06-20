# Backend Git Workflow

Welcome to the backend repository. This guide outlines how we collaborate using Git, manage our branches, and contribute code efficiently.

## Branching Strategy

We use the following branches:

- `dev`: Active development (CI/CD enabled)
- `main`: Stable, reviewed code
- `prod`: Production deployment (CI/CD enabled)

All development happens on feature branches and is eventually merged into `dev`, then into `main` and then to `prod`.

## Getting Started 

### 1. Fork the Repository

Start by forking the main repository to your own GitHub account.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/your-forked-repo.git
cd your-forked-repo
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/ThryzenX/Backend.git
```

## Creating a Feature Branch

Always start from the latest `dev` branch in the upstream repository.

```bash
git fetch upstream
git checkout -b feature/your-feature-name upstream/dev
```

Make your changes, then commit them with a clear message:

```bash
git add .
git commit -m "feat: add login endpoint"
git push origin feature/your-feature-name
```

## Opening a Pull Request

1. Go to your forked repository on GitHub.
2. Open a pull request from your `feature/*` branch to the `dev` branch of the main repository.
3. Once merged Check your changes on development server.
4. if everything works fine then create a pr from dev branch to main branch .

Once merged, your changes will be included in the stable codebase.

## Keeping Your Fork Updated

To stay synced with the main repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Commit Message Format

Use clear and conventional commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for general maintenance
- `docs:` for documentation
- `refactor:` for code improvements
- `test:` for adding or updating tests

Example:

```bash
git commit -m "feat: implement JWT authentication"
```

## Deployment Flow

- Work is pushed to feature branches and merged into `dev` then upon verification on the dev server it will be merged to `main`.
- Once verified, `main` is merged into `prod`
- CI/CD automatically deploys `dev` and `prod` branches

Stay consistent, sync regularly, and write clean commits.
