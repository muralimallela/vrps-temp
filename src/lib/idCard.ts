import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// Monkey-patch fs.readFileSync for pdfkit font files (.afm) in serverless / Next.js environments
const origReadFileSync = fs.readFileSync;
if (!(global as any).__pdfkit_fs_patched__) {
  (global as any).__pdfkit_fs_patched__ = true;
  fs.readFileSync = function (p: any, options?: any) {
    try {
      return origReadFileSync.call(fs, p, options);
    } catch (err: any) {
      if (err?.code === "ENOENT" && typeof p === "string" && p.endsWith(".afm")) {
        const filename = path.basename(p);
        const candidates = [
          path.join(process.cwd(), "node_modules", "pdfkit", "js", "data", filename),
          path.join(process.cwd(), "..", "node_modules", "pdfkit", "js", "data", filename),
        ];

        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            return origReadFileSync.call(fs, candidate, options);
          }
        }
      }
      throw err;
    }
  } as any;
}

type IdCardPayload = {
  membershipId: string;
  name: string;
  photoUrl?: string;
  address: string;
  memberSince: Date | string;
};

export async function createIdCardPdf(payload: IdCardPayload) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];

  const origin = process.env.NEXT_PUBLIC_APP_URL || "https://www.vaddera.org";
  const qrPayload = `${origin}/verify/${payload.membershipId}`;

  const qr = await QRCode.toDataURL(qrPayload, { margin: 1, width: 200 });
  const qrBase64 = qr.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(qrBase64, "base64");

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Page 1: ID CARD FRONT
    doc.rect(140, 50, 315, 340).fillAndStroke("#ffffff", "#0080D2");
    doc.rect(140, 50, 315, 120).fill("#0080D2");
    
    doc.fillColor("#ffffff").fontSize(16).text("VRPS", 140, 75, { align: "center", width: 315 });
    doc.fontSize(10).text("VADDERA RESERVATION PORATA SAMITHI", 140, 100, { align: "center", width: 315 });

    // Front: Member ID (Bold Red)
    doc.fillColor("#E52321").fontSize(20).text(payload.membershipId, 140, 240, { align: "center", width: 315 });

    // Front: Member Name (Blue Script/Italic style)
    doc.font("Helvetica-Oblique").fillColor("#0080D2").fontSize(18).text(payload.name, 140, 280, { align: "center", width: 315 });

    doc.font("Helvetica").fontSize(10).fillColor("#555555").text("OFFICIAL MEMBER CARD", 140, 340, { align: "center", width: 315 });

    // Page 2: ID CARD BACK (QR Code & Address)
    doc.addPage();
    doc.rect(140, 50, 315, 340).fillAndStroke("#ffffff", "#0080D2");
    doc.fillColor("#0080D2").fontSize(14).text("MEMBER VERIFICATION", 140, 70, { align: "center", width: 315 });

    // QR Code holding instant verification URL
    doc.image(qrBuffer, 237, 110, { width: 120, height: 120 });

    doc.fillColor("#333333").fontSize(10);
    doc.text(`Registered Address:`, 160, 240, { width: 275 });
    doc.fillColor("#555555").fontSize(9).text(payload.address, 160, 255, { width: 275 });

    doc.fillColor("#333333").fontSize(10).text(`Member Since: ${new Date(payload.memberSince).toLocaleDateString("en-IN")}`, 160, 305);

    doc.fontSize(8).fillColor("#888888").text("Scan QR Code to verify authenticity", 140, 355, { align: "center", width: 315 });

    doc.end();
  });
}
