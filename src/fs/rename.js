import path from "path";
import { fileURLToPath } from "url";
import fsPromises from "fs/promises";
import * as utils from "./utils.js";

export const dirName = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(dirName, "files", "wrongFilename.txt");
const destinationPath = path.join(dirName, "files", "properFilename.md");

const rename = async () => {
  try {
    await fsPromises.access(destinationPath);
    throw Error(utils.fsErrorMsg);
  } catch (error) {
    if (error.message === utils.fsErrorMsg) {
      throw error;
    }
    // destination does not exist (ENOENT) -> proceed
  }
  try {
    await fsPromises.rename(sourcePath, destinationPath);
  } catch (error) {
    throw Error(utils.fsErrorMsg);
  }
};

await rename();
