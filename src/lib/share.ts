import { stripMarkdown } from "./formatMarkdown";

/** Download a Blob as a file (used for the PNG fallback). */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function whatsappText(title: string, summary: string): string {
  const plain = stripMarkdown(summary);
  const body = plain.length > 800 ? `${plain.slice(0, 800)}…` : plain;
  return (
    `Labologics — ${title}\n\n${body}\n\n` +
    `Disclaimer: AI summary for education only, not medical advice. Consult your doctor.`
  );
}

/**
 * Share the summary as a WhatsApp image:
 * 1. Try the Web Share API with the PNG file (works on Android/iOS share sheets, including WhatsApp).
 * 2. Otherwise download the PNG and open wa.me with the text, so the user can attach the image.
 */
export async function shareViaWhatsApp(
  pngBlob: Blob,
  fileName: string,
  title: string,
  summary: string,
): Promise<"shared" | "downloaded"> {
  const file = new File([pngBlob], fileName, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };
  try {
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({
        files: [file],
        title: `Labologics — ${title}`,
        text: whatsappText(title, summary),
      });
      return "shared";
    }
  } catch {
    // User cancelled the share sheet — treat as done, do not fall through to download.
    return "shared";
  }
  downloadBlob(pngBlob, fileName);
  const url = `https://wa.me/?text=${encodeURIComponent(whatsappText(title, summary))}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return "downloaded";
}
