import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";

const __dirname = path.resolve();

export function attachMorganLogger(app, routerPath, router, logFilename) {
  const logStream = fs.createWriteStream(
    path.join(__dirname, "./src/logs", logFilename),
    { flags: "a" },
  );

  app.use(routerPath, morgan("combined", { stream: logStream }), router);
}