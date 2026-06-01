import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

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

  const jwtSecret = process.env.ID_CARD_JWT_SECRET || "vrps-id-card-secret";
  const token = jwt.sign(
    { membershipId: payload.membershipId, name: payload.name },
    jwtSecret,
    { expiresIn: "365d" }
  );
  const qr = await QRCode.toDataURL(token);
  const qrBase64 = qr.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(qrBase64, "base64");

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(40, 40, 515, 250).fillAndStroke("#f5e6cf", "#6A160A");
    doc.fillColor("#6A160A").fontSize(18).text("VRPS Membership ID Card", 60, 55);
    doc.fontSize(12).fillColor("#111111");
    doc.text(`Membership ID: ${payload.membershipId}`, 60, 95);
    doc.text(`Name: ${payload.name}`, 60, 120);
    doc.text(`Address: ${payload.address}`, 60, 145, { width: 300 });
    doc.text(
      `Membership Date: ${new Date(payload.memberSince).toLocaleDateString("en-IN")}`,
      60,
      195
    );

    doc.image(qrBuffer, 400, 90, { width: 120, height: 120 });
    doc.fontSize(9).fillColor("#444").text("Scan to verify membership", 395, 215);
    doc.end();
  });
}
