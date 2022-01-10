import initWasm from "../pkg";
import wasm from "../pkg/index_bg.wasm";

function asciiToBinary(str: string) {
  if (typeof atob === "function") {
    return atob(str);
  } else {
    return new Buffer(str, "base64").toString("binary");
  }
}

function decode(encoded: string) {
  const binaryString = asciiToBinary(encoded);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function init() {
  const program = await initWasm(decode(wasm as any));
  return program;
}
