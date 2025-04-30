import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const childPath = path.join(dirName, "files", "script.js");

const spawnChildProcess = async (args) => {
  const child = spawn(process.execPath, [childPath, ...args], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  // Pipe streams directly
  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);
};

// Put your arguments in function call to test this functionality
spawnChildProcess(["one", "two"]);
