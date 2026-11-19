import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

let backend;
try {
  backend = new URL(process.env.RENDER_BACKEND_URL);
} catch {
  throw new Error("RENDER_BACKEND_URL must be the HTTPS origin of the Render service.");
}
if (backend.protocol !== "https:" || backend.href !== `${backend.origin}/`) {
  throw new Error("RENDER_BACKEND_URL must be the HTTPS origin of the Render service.");
}

const buildDirectory = new URL("../build/", import.meta.url);
if (!existsSync(new URL("index.html", buildDirectory))) {
  throw new Error("Build the frontend before preparing Vercel output.");
}

const outputDirectory = new URL("../.vercel/output/", import.meta.url);
rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });
cpSync(buildDirectory, new URL("static/", outputDirectory), { recursive: true });

const config = {
  version: 3,
  routes: [
    { src: "^/api/(.*)$", dest: `${backend.origin}/$1` },
    { handle: "filesystem" },
    { src: "^/.*$", dest: "/index.html", methods: ["GET", "HEAD"] },
  ],
};
writeFileSync(new URL("config.json", outputDirectory), JSON.stringify(config, null, 2) + "\n");
