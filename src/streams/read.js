import { createReadStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(dirName, "files", "fileToRead.txt");

const read = async () => {
  try {
    const rs = createReadStream(sourcePath);
    await new Promise((resolve, reject) => {
      rs.on("error", reject);
      rs.on("end", () => {
        process.stdout.write("\n");
        resolve();
      });
      rs.pipe(process.stdout, { end: false });
    });
  } catch (err) {
    console.error("Pipeline failed:", err);
  }
};

await read();
