import QRCode from "qrcode";

export const generateQr = async (data) => {
  try {
    const qrString = JSON.stringify(data);
    const qrCode = await QRCode.toDataURL(qrString);
    return qrCode;
  } catch (err) {
    console.error("QR generation failed:", err);
    throw new Error("QR code generation error");
  }
};
