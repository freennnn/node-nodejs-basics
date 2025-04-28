import os from "os";
import { Worker } from "node:worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const workerPath = path.join(dirName, "worker.js");
const cpuCount = os.cpus().length;

const performCalculations = async () => {
  const workerPromises = [];

  for (let i = 0; i < cpuCount; i++) {
    const workerPromise = new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, { workerData: 10 + i });
      let resolved = false; // Flag to prevent double resolution
      worker.on("message", (msg) => {
        if (!resolved) {
          resolved = true;
          resolve({ status: "resolved", data: msg });
        }
      });
      worker.on("error", (err) => {
        if (!resolved) {
          resolved = true;
          resolve({ status: "error", data: null });
        }
      });
      worker.on("exit", (code) => {
        if (!resolved && code !== 0) {
          resolved = true;
          resolve({ status: "error", data: null });
        }
      });
    });

    workerPromises.push(workerPromise);
  }
  const results = await Promise.allSettled(workerPromises);
  const formattedResults = results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      console.error("Worker promise was unexpectedly rejected:", result.reason);
      return { status: "error", data: null };
    }
  });
  console.log(formattedResults);
};

await performCalculations();
