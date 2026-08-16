/**
 * Compress and resize large images under assets/ for web delivery.
 * Keeps filenames and formats so HTML paths stay the same.
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const MIN_SIZE_BYTES = 400 * 1024;
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 80;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeFile(filePath) {
  const before = (await fs.stat(filePath)).size;
  if (before < MIN_SIZE_BYTES) {
    return null;
  }

  const ext = path.extname(filePath).toLowerCase();
  const image = sharp(filePath, { failOn: "none" }).rotate();
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true });
  }

  const buffer = await pipeline.toBuffer();
  if (buffer.length >= before) {
    return null;
  }

  const tempPath = `${filePath}.opt.tmp`;
  await fs.writeFile(tempPath, buffer);
  await fs.rename(tempPath, filePath);
  return { filePath, before, after: buffer.length };
}

const files = await walk(ASSETS_DIR);
let saved = 0;
let optimized = 0;

console.log(`Scanning ${files.length} images under assets/ ...\n`);

for (const filePath of files) {
  try {
    const result = await optimizeFile(filePath);
    if (!result) {
      continue;
    }

    optimized += 1;
    saved += result.before - result.after;
    const rel = path.relative(ROOT, result.filePath);
    console.log(`${rel}`);
    console.log(`  ${formatMb(result.before)} -> ${formatMb(result.after)}`);
  } catch (error) {
    const rel = path.relative(ROOT, filePath);
    console.warn(`Skipped ${rel}: ${error.message}`);
  }
}

console.log(`\nDone. Optimized ${optimized} file(s), saved ${formatMb(saved)}.`);
