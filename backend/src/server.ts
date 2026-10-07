import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

/**
 * Entry point: starts the HTTP server and closes the DB
 * connection cleanly on shutdown signals.
 */
const app = createApp();

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(
    `API listening on 0.0.0.0:${env.PORT} (docs at /docs)`,
  );
});

async function shutdown() {
  console.log("Shutting down server...");

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);