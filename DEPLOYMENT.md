# Deploy IPL Auction

[GitHub Actions](.github/workflows/ci-cd.yml) runs the Docker Compose smoke checks on pull requests and pushes to `master`. After setup, a successful run on `master` deploys that commit to Render, waits for the backend health check, then publishes the React build to Vercel.

## Set up Vercel

1. Select an existing Vercel project or run `vercel link` from the repository root to create one. Keep **Root Directory** at its default. If the project is connected to Git, disconnect the repository in **Settings → Git** so GitHub Actions controls releases. [Vercel project linking](https://vercel.com/docs/cli/project-linking) · [Vercel Git settings](https://vercel.com/docs/git/vercel-for-github#changing-the-github-repository-of-a-project)
2. Copy the project's stable production URL from **Settings → Domains**, such as `https://ipl-auction-example.vercel.app`. Use an HTTPS origin without a path or trailing slash. If you linked the project with the CLI, the `orgId` and `projectId` fields are in `.vercel/project.json`. [Vercel production domains](https://vercel.com/docs/domains/working-with-domains)

## Set up Render and MongoDB

1. Once [`render.yaml`](render.yaml) is on GitHub, [create the Render Blueprint](https://dashboard.render.com/blueprint/new?repo=https://github.com/Amritanshu02/IPL-Auction-Website) from `master`. It creates a Docker web service on the Free plan with `/healthz` as its health check and automatic Git deployments turned off. After provisioning, set **Auto Sync** to **No** in the Blueprint settings and apply future Blueprint changes with **Manual Sync**. For an existing Render backend, use the same Docker context (`server`), Dockerfile (`server/Dockerfile`), health path, and auto-deploy setting. [Render Blueprint setup](https://render.com/docs/infrastructure-as-code)
2. Set `MONGO_URL` to the connection string for your hosted MongoDB database and `FRONTEND_ORIGIN` to the stable Vercel origin from the previous section. Render generates `JWT_KEY` for a new Blueprint service. For an existing service, keep its current signing key or set one in Render if it has none. [Render environment variables](https://render.com/docs/configure-environment-variables)
3. If MongoDB uses an IP access list, copy the backend's IP ranges from **Connect → Outbound** on Render and allow those ranges on the database provider. In Atlas, use **Database & Network Access → IP Access List**. [Render outbound IP ranges](https://render.com/docs/outbound-ip-addresses) · [Atlas IP access list](https://www.mongodb.com/docs/atlas/security/ip-access-list/)

## Configure GitHub Actions

In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and add these repository variables.

| Variable | Value |
| --- | --- |
| `RENDER_SERVICE_ID` | The Render backend's service ID, starting with `srv-`. |
| `VERCEL_ORG_ID` | The Vercel project owner's organization or team ID. |
| `VERCEL_PROJECT_ID` | The Vercel project's ID. |
| `VERCEL_FRONTEND_URL` | The same stable HTTPS origin used for Render's `FRONTEND_ORIGIN`. |

Add `RENDER_API_KEY` and `VERCEL_TOKEN` as GitHub Actions secrets. They can be repository secrets or secrets on the GitHub `production` environment. Give the Render key access to read the service and trigger deployments in its workspace. Use a Vercel access token scoped to the account or team that owns the frontend project. Keep the database connection string and JWT key in Render. [Render API keys](https://render.com/docs/api) · [Vercel access tokens](https://vercel.com/docs/rest-api#authentication) · [GitHub Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)

## Release and verify

Once all four repository variables are set, select the [CI/CD workflow](https://github.com/Amritanshu02/IPL-Auction-Website/actions/workflows/ci-cd.yml) under **Actions**, choose **Run workflow**, and select `master`. Later pushes to `master` run the same release automatically after CI passes.

Open the production frontend at `VERCEL_FRONTEND_URL` after the workflow succeeds. The frontend uses `/api/*` through Vercel for HTTP requests and connects directly to Render for Socket.IO. If Render fails its health check, inspect the exact deployment in Render and verify that it can connect to MongoDB.
