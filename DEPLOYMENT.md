# 📦 GitHub Deployment Instructions for Howard's Farm

_Last updated: April 2025_

---

## ✅ Step 0: Create a Version Tag (Optional but Recommended)
Create a rollback point before making major changes.

```bash
git tag -a v1.2.0 -m "Stable version before April updates"
git push origin v1.2.0
```

Use semantic versioning (e.g., `v1.2.0`, `v1.2.1`, etc).

---

## 🛠️ Backend Deployment (Azure App Service)

```bash
# Add workflow changes if updated
git add .github/workflows/main_howards-farm-app.yml

# Stage all backend changes
git add .

# Commit the changes
git commit -m "🛠️ Backend updates - prepare for Azure deployment"

# Push to a feature branch (do NOT push directly to main)
git push origin your-feature-branch
```

1. Open a **Pull Request** into `main` on GitHub
2. Wait for all status checks to pass (e.g., `build`)
3. Merge using the GitHub UI

---

## 🌐 Frontend Deployment (Azure Static Web App)

```bash
# Navigate to project directory
cd C:\Users\Ben\Website Builds\howard-farm\howard-farm

# Stage frontend changes
git add .

# Commit the changes
git commit -m "🚀 Frontend changes for redeploy to Azure"

# Push to a feature branch
git push origin your-feature-branch
```

1. Open a **Pull Request** into `main` in GitHub
2. Confirm that all required checks pass (e.g., `build_and_deploy`)
3. Merge using the GitHub interface

---

## ✅ Final Merge
When both backend and frontend changes are ready:

- Merge both Pull Requests into `main`
- GitHub Actions will automatically:
  - ✅ Deploy the **frontend** to Azure Static Web App
  - ✅ Deploy the **backend** to Azure App Service

---

## 🔄 Rollback Instructions
If something goes wrong, revert to the last stable tag:

```bash
git checkout main
git reset --hard v1.2.0
git push --force origin main
```

This restores the `main` branch to its previously working state.

---

## 🛡️ Bypassing Protections (Not Recommended)
If you absolutely must bypass branch protections:

1. Temporarily disable the ruleset in GitHub → Settings → Rules
2. Push changes directly to `main`
3. Re-enable protections immediately after

---

_Keep this document updated with changes to your GitHub workflows or deployment process._

