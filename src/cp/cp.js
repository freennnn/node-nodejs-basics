import { fork, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const childPath = path.join(dirName, "files", "script.js");

const spawnChildProcess = async (args) => {
  let child = fork(childPath, args);

  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);
};

// Put your arguments in function call to test this functionality
spawnChildProcess(["one", "two"]);
