const { randomBytes, randomUUID } = require("node:crypto");
const { linkSync, readFileSync, unlinkSync, writeFileSync } = require("node:fs");

const keyPath = "/var/lib/ipl-auction/auth/jwt-key";

function loadOrCreateSigningKey() {
  try {
    return readFileSync(keyPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const candidatePath = `${keyPath}.${randomUUID()}.tmp`;
  writeFileSync(candidatePath, randomBytes(32).toString("hex"), {
    flag: "wx",
    mode: 0o600,
  });

  try {
    // Publish the full key without overwriting one created by another process.
    linkSync(candidatePath, keyPath);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  } finally {
    unlinkSync(candidatePath);
  }

  return readFileSync(keyPath, "utf8");
}

if (!process.env.JWT_KEY) {
  const signingKey = loadOrCreateSigningKey();
  if (!/^[0-9a-f]{64}$/.test(signingKey)) {
    throw new Error("The stored JWT signing key is invalid.");
  }
  process.env.JWT_KEY = signingKey;
}

require("./app");
