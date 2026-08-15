import QRCode from "qrcode";

export function generateDottedQrSvg(text: string): string {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const margin = 2;
  const totalSize = size + margin * 2;
  const cellSize = 10;
  const viewBoxSize = totalSize * cellSize;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="100%" height="100%" fill="none">`;
  svg += `<rect width="${viewBoxSize}" height="${viewBoxSize}" fill="white" rx="36"/>`;

  function isFinderPattern(r: number, c: number): boolean {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= size - 7) return true;
    if (r >= size - 7 && c < 7) return true;
    return false;
  }

  // Draw circular dot modules for all data points
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (qr.modules.get(r, c)) {
        if (!isFinderPattern(r, c)) {
          const cx = (c + margin + 0.5) * cellSize;
          const cy = (r + margin + 0.5) * cellSize;
          const radius = cellSize * 0.44;
          svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="black"/>`;
        }
      }
    }
  }

  // Draw custom rounded finder eyes matching qr.png
  function drawFinderEye(r: number, c: number) {
    const x = (c + margin) * cellSize;
    const y = (r + margin) * cellSize;
    const s = 7 * cellSize;
    // Outer rounded rect outline
    svg += `<rect x="${x + 4}" y="${y + 4}" width="${s - 8}" height="${s - 8}" rx="${cellSize * 1.9}" stroke="black" stroke-width="${cellSize * 0.85}" fill="none"/>`;
    // Inner solid eye circle
    svg += `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${cellSize * 1.35}" fill="black"/>`;
  }

  drawFinderEye(0, 0);
  drawFinderEye(0, size - 7);
  drawFinderEye(size - 7, 0);

  svg += `</svg>`;

  const base64 = typeof window !== "undefined"
    ? window.btoa(unescape(encodeURIComponent(svg)))
    : Buffer.from(svg).toString("base64");

  return `data:image/svg+xml;base64,${base64}`;
}
