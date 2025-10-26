import { Transform } from "stream";
import { pipeline } from "stream/promises";

const reversify = new Transform({
  transform(chunk, enc, cb) {
    this.push([...chunk.toString()].reverse().join(""));
    this.push("\n");
    cb();
  },
});

const transform = async () => {
  await pipeline(process.stdin, reversify, process.stdout);
};

await transform();
