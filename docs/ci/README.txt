Copy this file to `.github/workflows/frontend-docker.yml` and push from a machine whose Git credential has the **`workflow` scope** (or use SSH). GitHub will then build and push `ghcr.io/<your-user>/skinksa-frontend:latest` on every change under `frontend/`.

Optional: add repo secret `EASYPANEL_DEPLOY_WEBHOOK` with the POST URL from EasyPanel to trigger a redeploy after each build.
