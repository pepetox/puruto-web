---
title: Add your Puruto
description: How to publish your Puruto in the community showcase.
---

## Requirements to appear in the showcase

Before submitting your Puruto, verify it meets the standard:

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/my-puruto
# Should show: ✓ Valid Puruto
```

Minimum requirements:

- [ ] The repo is on GitHub (public)
- [ ] Passes the standard validation (`validate.py`)
- [ ] `.puruto-standard-version` present and up to date
- [ ] `README.md` clearly explains what the Puruto does and how to use it
- [ ] `.env.example` documented (no real secrets)

## Submission process

The showcase works via Pull Requests to this repository.

### 1. Fork the framework repo

```bash
git clone https://github.com/pepetox/puruto.git
cd puruto
```

### 2. Create the showcase entry file

Add a Markdown file in `web/src/content/docs/showcase/community/`:

```bash
# Filename: puruto-<name>.md
touch web/src/content/docs/showcase/community/puruto-my-puruto.md
```

With this format:

```markdown
---
title: puruto-my-puruto
description: One line describing what your Puruto does.
---

## Description

[Explain in 2-3 paragraphs what the Puruto does and what problem it solves]

## Skills

- `/init` — sets up the environment
- `/my-skill` — [description]
- ...

## Repository

[github.com/your-username/puruto-my-puruto](https://github.com/your-username/puruto-my-puruto)

## Standard

Version: `0.2.0`
```

### 3. Open a Pull Request

```bash
git checkout -b showcase/puruto-my-puruto
git add web/src/content/docs/showcase/community/puruto-my-puruto.md
git commit -m "showcase: add puruto-my-puruto"
git push origin showcase/puruto-my-puruto
```

Open the PR on GitHub. The team will review that the Puruto meets the requirements and merge it.

## Acceptance criteria

Showcase Purutos must:

- Solve a real and useful use case
- Have clear documentation in the README
- Pass the standard validator
- Not contain malicious code or exploits
- Not expose the author's personal data

Purutos that store personal data (customized `puruto-data`) **do not apply** to the showcase — they are private repos by design.
