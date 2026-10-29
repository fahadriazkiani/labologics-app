/**
 * formatMarkdown — ported from labologics-preview.html, with two
 * production fixes: (1) HTML in the AI response is escaped before
 * markup is applied, so raw HTML can never be injected via innerHTML;
 * (2) `- ` bullets are recognised alongside `* `, and consecutive
 * list items are grouped into a single <ul>.
 *
 * The original transform order and regexes are otherwise preserved.
 */
export function formatMarkdown(text: string): string {
  // Escape HTML first so only the tags we generate below are rendered.
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/<\/li>\n<li>/gim, "</li><li>");
  // Group a run of <li>…</li> into one <ul>. The original wrapped each
  // run with the same regex; keep it, applied to the whole block.
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/gs, (match) => {
    const items = match.replace(/\s+$/, "");
    return `<ul>${items}</ul>`;
  });

  html = html
    .split("\n\n")
    .map((p) => {
      if (p.trim() !== "" && !p.startsWith("<h") && !p.startsWith("<ul")) {
        return `<p>${p.trim()}</p>`;
      }
      return p;
    })
    .join("");

  return html;
}

/** Plain-text version of a markdown summary, for copy / WhatsApp text. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "• ")
    .trim();
}
