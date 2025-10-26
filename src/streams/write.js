import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";
const dirName = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(dirName, "files", "fileToWrite.txt");

const write = async () => {
  await pipeline(process.stdin, createWriteStream(sourcePath));
};

await write();
