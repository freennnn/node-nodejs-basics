import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { createReadStream } from "fs";
const dirName = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(dirName, "files", "fileToCalculateHashFor.txt");

const calculateHash = async () => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const rs = createReadStream(sourcePath);
    rs.on("data", (data) => hash.update(data));
    rs.on("end", () => {
      const hashValue = hash.digest("hex");
      console.log(hashValue);
      resolve(hashValue);
    });
    rs.on("error", (err) => reject(err));
  });
};

await calculateHash();
