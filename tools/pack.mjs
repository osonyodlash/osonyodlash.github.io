// Usage:  TELC_KEY=... node tools/pack.mjs pack     (telc/app.html -> telc/app.bin)
//         TELC_KEY=... node tools/pack.mjs unpack   (telc/app.bin  -> telc/app.html)
import { readFileSync, writeFileSync } from "node:fs";
import { gzipSync, gunzipSync } from "node:zlib";
import { webcrypto as C, randomBytes } from "node:crypto";
const K = process.env.TELC_KEY; if (!K) { console.error("TELC_KEY yo'q"); process.exit(1); }
const key = await C.subtle.importKey("raw", Buffer.from(K, "base64url"), "AES-GCM", false, ["encrypt", "decrypt"]);
const dir = new URL("../telc/", import.meta.url);
if (process.argv[2] === "pack") {
  const iv = randomBytes(12);
  const ct = await C.subtle.encrypt({ name: "AES-GCM", iv }, key, gzipSync(readFileSync(new URL("app.html", dir))));
  writeFileSync(new URL("app.bin", dir), Buffer.concat([iv, Buffer.from(ct)]));
  console.log("telc/app.bin yozildi");
} else if (process.argv[2] === "unpack") {
  const b = readFileSync(new URL("app.bin", dir));
  const pt = await C.subtle.decrypt({ name: "AES-GCM", iv: b.subarray(0, 12) }, key, b.subarray(12));
  writeFileSync(new URL("app.html", dir), gunzipSync(Buffer.from(pt)));
  console.log("telc/app.html ochildi");
} else console.log("pack | unpack");
