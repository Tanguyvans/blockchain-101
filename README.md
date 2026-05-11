# Blockchain 101

A short hands-on workshop on writing, deploying and interacting with smart contracts on **Arbitrum Sepolia**.

## Repo layout

```
blockchain-101/
├── docs/                 # workshop docs (Markdown, rendered with MkDocs Material)
├── my-first-contract/    # the Hardhat project students build along
├── mkdocs.yml            # docs site config
└── requirements.txt      # Python deps for MkDocs
```

## Read the workshop

- **Online** — once GitHub Pages is enabled on this repo: <https://tanguyvans.github.io/blockchain-101/>
- **On GitHub** — open the [`docs/`](./docs) folder, GitHub renders every `.md` natively.
- **Locally** — see "Run the docs locally" below.

## Run the docs locally

You need Python 3. Then:

```bash
pip install -r requirements.txt
mkdocs serve
```

Open <http://127.0.0.1:8000>. The site reloads on every save.

## Build a static site

```bash
mkdocs build
```

Output goes to `site/`.

## Deploy to GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy-docs.yml`) builds and deploys the site on every push to `main`. To enable it once:

1. Push the repo to GitHub.
2. **Settings** → **Pages** → set **Source** to **GitHub Actions**.

That's it — subsequent pushes auto-deploy.

## Run the smart contract

See [`my-first-contract/README.md`](./my-first-contract/README.md) for the Hardhat workflow.
