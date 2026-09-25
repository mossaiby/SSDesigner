const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Simple PNG encoder from raw RGBA buffer
function createPng(width, height, getPixel) {
  // getPixel(x, y) returns [r, g, b, a]
  const rowBytes = width * 4 + 1; // 1 filter byte per scanline
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(len + 12);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, len + 8));
    buf.writeInt32BE(crc, len + 8);
    return buf;
  }

  // Precomputed CRC table
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = -1;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ -1) | 0;
  }

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw geometric space lattice badge
function renderIcon(x, y, w, h) {
  // Normalize coordinates -1 to 1
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const rDist = Math.hypot(nx, ny);

  // Rounded rectangle boundary (radius ~ 0.8)
  const qx = Math.max(Math.abs(nx) - 0.72, 0);
  const qy = Math.max(Math.abs(ny) - 0.72, 0);
  const cornerDist = Math.hypot(qx, qy);

  if (cornerDist > 0.22) {
    // Outside icon boundary
    return [0, 0, 0, 0];
  }

  // Base slate-950 dark background (#020617)
  let r = 2;
  let g = 6;
  let b = 23;
  let a = 255;

  // Outer border glow
  if (cornerDist > 0.18) {
    r = 30;
    g = 41;
    b = 59;
  }

  // Subtle radial gradient in center
  if (rDist < 0.7) {
    const blend = 1 - rDist / 0.7;
    r = Math.min(255, Math.floor(r + 15 * blend));
    g = Math.min(255, Math.floor(g + 23 * blend));
    b = Math.min(255, Math.floor(b + 42 * blend));
  }

  // Space Frame Node positions:
  // Top: (0, -0.6)
  // Left: (-0.55, 0.35)
  // Right: (0.55, 0.35)
  // Center: (0, 0.05)
  // Bottom: (0, 0.65)
  const nodes = [
    { x: 0, y: -0.6, rad: 0.10, isCentral: false },
    { x: -0.55, y: 0.35, rad: 0.10, isCentral: false },
    { x: 0.55, y: 0.35, rad: 0.10, isCentral: false },
    { x: 0, y: 0.05, rad: 0.12, isCentral: true },
    { x: 0, y: 0.65, rad: 0.07, isCentral: false },
  ];

  // Helper: line segment distance
  function distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  const struts = [
    [0, 1], [0, 2], [1, 2], // Outer triangle
    [0, 3], [1, 3], [2, 3], // Struts to central 3D node
    [3, 4], [1, 4], [2, 4], // Bottom pyramid struts
  ];

  // Draw struts
  for (const [i1, i2] of struts) {
    const d = distToSegment(nx, ny, nodes[i1].x, nodes[i1].y, nodes[i2].x, nodes[i2].y);
    const thickness = (i1 === 3 || i2 === 3) ? 0.045 : 0.035;
    if (d < thickness) {
      const strA = 1 - (d / thickness);
      // Cyan #06b6d4 / #38bdf8
      r = Math.min(255, Math.floor(r + (56 - r) * strA));
      g = Math.min(255, Math.floor(g + (189 - g) * strA));
      b = Math.min(255, Math.floor(b + (248 - b) * strA));
    }
  }

  // Draw nodes
  for (const n of nodes) {
    const nd = Math.hypot(nx - n.x, ny - n.y);
    if (nd < n.rad) {
      if (nd < n.rad * 0.35) {
        // Core highlight (white)
        r = 255; g = 255; b = 255;
      } else if (n.isCentral) {
        // Bright cyan #38bdf8
        r = 56; g = 189; b = 248;
      } else {
        // Silver-blue node #e0f2fe
        r = 224; g = 242; b = 254;
      }
    }
  }

  return [r, g, b, a];
}

const pubDir = path.resolve(__dirname, '../public');
fs.writeFileSync(path.join(pubDir, 'icon-192.png'), createPng(192, 192, renderIcon));
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), createPng(512, 512, renderIcon));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createPng(180, 180, renderIcon));
console.log('Successfully generated icon-192.png, icon-512.png, and apple-touch-icon.png');
