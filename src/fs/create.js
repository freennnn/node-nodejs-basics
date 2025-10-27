import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const filePath = fileURLToPath(import.meta.url)
const dirPath = path.dirname(filePath)
const targetPath = path.join(dirPath, 'files', 'fresh.txt')
const data = 'I am fresh and young'
const errorMessage = 'FS operation failed'

const create = async () => {
  // Write your code here
  // await writeWithWX(data)
     await writeWithOpen(data)
  // await writeWithAccess(data)
  // await writeWithStat(data)
};

await create();

// 1) open() + FileHandle.write() + close()
async function writeWithOpen(data) {
  let fh
  let originalErr
  try {
    fh = await fs.open(targetPath, 'wx')
    await fh.write(data)
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error(`File at ${targetPath} already exists`)
      const customErr = new Error(errorMessage)
      originalErr = customErr
      throw customErr
    } else {
      console.error(`General FS error: ${err}`)
      originalErr = err
      throw err
    }
  } finally {
    // if finally {} block throws (fh.close()) - same-level catch {} won't catch the errors,
    // and hence the process will crash. Also if both try {} and finally {} throw - try error
    // will be lost due to replacement by finally error, and process crash stack traces
    // only one error. That's why we have separate try catch for finally. In most cases we
    // want to preserve original error and just log the cleanup error.
    // We throw finally (cleanup) error, only if it is critical or if there was no try error
    try {
      if (fh) await fh.close()
    } catch (closeErr) {
      console.error(`Failed to close file handle: ${closeErr}`)
      // don't mask original error: log close error, rethrow only if there was no earlier error
      if (!originalErr) throw closeErr
    }
  }
}

// 2) access() + writeToFile() - non-atomic, race condition prone
async function writeWithAccess(data) {
  try {
    await fs.access(targetPath, fs.constants.F_OK)
    throw new Error(errorMessage)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(targetPath, data)
    } else {
      // rethrow our custom file exist error
      throw err
    }
  }
}

// 3) writeFile() with 'wx' flag - atomic
async function writeWithWX(data) {
  try {
    await fs.writeFile(targetPath, data, { flag: 'wx' })
  }
  catch (err) {
    if (err.code === 'EEXIST') {
      throw new Error(errorMessage)
    } else {
      console.error(`unexpected writeFile error: ${err}`)
      // rethrow unexpected error
      throw err
    }
  }
}

// 4) stat() + writeFile() - non atomic, race condition prone
async function writeWithStat(data) {
  try {
    await fs.stat(targetPath);
    // file exists
    throw new Error(errorMessage);
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        await fs.writeFile(targetPath, data, { encoding: "utf8" });
      } catch (err) {
        console.error(`unexpected writeFile error: ${err}`)
        // rethrow unexpected error
        throw err
      }
    } else if (error.message === errorMessage) {
      // rethrow out 'file exists' error
      throw error;
    } else {
      // unexpected stat error
      console.error(`unexpected stat error: ${error}`)
      throw error
    }
  }
}