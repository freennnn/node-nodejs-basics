import { createReadStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(dirName, "files", "fileToRead.txt");

const read = async () => {
  try {
    await pipeline(createReadStream(sourcePath), process.stdout);
  } catch (err) {
    console.error("Pipeline failed:", err);
  }
};

await read();
