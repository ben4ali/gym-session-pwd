const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPng(size, primaryColor, secondaryColor) {
  // Simple uncompressed/deflated raw RGBA PNG writer
  const width = size;
  const height = size;

  // Scanlines with filter byte 0
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const cornerRadius = size * 0.22;

  // Render a clean rounded black square with white barbell icon
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Rounded rectangle check
      const dx = Math.max(Math.abs(x - cx) - (cx - cornerRadius), 0);
      const dy = Math.max(Math.abs(y - cy) - (cy - cornerRadius), 0);
      const distFromCorner = Math.sqrt(dx * dx + dy * dy);

      if (distFromCorner > cornerRadius) {
        // Transparent outside rounded corner
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Default background: True Apple Black (#000000)
      let r = 0, g = 0, b = 0, a = 255;

      // Draw minimal barbell symbol:
      // Bar: horizontal line across center
      const barThickness = size * 0.05;
      const isBar = Math.abs(y - cy) <= barThickness && x >= width * 0.22 && x <= width * 0.78;

      // Outer plates
      const plateWidth = size * 0.05;
      const plate1 = x >= width * 0.30 && x <= width * 0.30 + plateWidth && Math.abs(y - cy) <= size * 0.32;
      const plate2 = x >= width * 0.65 - plateWidth && x <= width * 0.65 && Math.abs(y - cy) <= size * 0.32;

      // Inner plates
      const innerPlate1 = x >= width * 0.38 && x <= width * 0.38 + plateWidth && Math.abs(y - cy) <= size * 0.22;
      const innerPlate2 = x >= width * 0.57 - plateWidth && x <= width * 0.57 && Math.abs(y - cy) <= size * 0.22;

      if (isBar || plate1 || plate2 || innerPlate1 || innerPlate2) {
        // Apple Blue (#0071E3) or White
        r = 0; g = 113; b = 227; a = 255;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate IDAT data
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: 0
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);

    // CRC32 calculation
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeInt32BE(crc, 8 + len);
    return buf;
  }

  // Standard CRC32 table
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return ~c;
  }

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pubDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(pubDir, 'icon-192.png'), createPng(192));
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), createPng(512));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createPng(180));
console.log('Successfully generated PWA icon-192.png, icon-512.png, and apple-touch-icon.png');
