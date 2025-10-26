import path from "path";
import { fileURLToPath } from "url";
import fsPromises from "fs/promises";
import * as utils from "./utils.js";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(dirName, "files");

const list = async () => {
  try {
    const files = await fsPromises.readdir(sourcePath, { withFileTypes: true });
    const onlyFiles = files.filter((d) => d.isFile()).map((d) => d.name);
    console.log(onlyFiles);
  } catch (error) {
    throw Error(utils.fsErrorMsg);
  }
};

await list();
