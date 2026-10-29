"use client";

import { forwardRef } from "react";
import { stripMarkdown } from "@/lib/formatMarkdown";

interface ShareCardProps {
  title: string;
  dateLabel: string;
  summary: string;
  language: string;
}

/**
 * The card rendered to a PNG for "Share as WhatsApp image".
 * Rendered off-screen at a fixed 1080px width so the exported image
 * is crisp on phones. Uses only system-safe styling (no external
 * images) so html-to-image can rasterise it reliably.
 */
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ title, dateLabel, summary, language }, ref) {
    const plain = stripMarkdown(summary);
    const preview = plain.length > 900 ? `${plain.slice(0, 900)}…` : plain;

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          background: "#ffffff",
          color: "#1e293b",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          padding: 48,
          borderRadius: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#0d9488",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            L
          </div>
          <div>
            <p style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>Labologics</p>
            <p style={{ fontSize: 18, color: "#64748b", margin: 0 }}>
              AI Lab Report Summary • {dateLabel}
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: 38, fontWeight: 800, margin: "0 0 16px" }}>{title}</h2>
        <p style={{ fontSize: 22, lineHeight: 1.6, color: "#334155", whiteSpace: "pre-wrap", margin: 0 }}>
          {preview}
        </p>

        <div
          style={{
            marginTop: 32,
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 16,
            padding: 20,
            fontSize: 18,
            lineHeight: 1.5,
            color: "#9a3412",
          }}
        >
          <strong>Disclaimer:</strong> AI-generated summary for education only —
          not medical advice. Always consult your physician.
          {language ? ` • Language: ${language}` : ""}
        </div>

        <p style={{ marginTop: 24, fontSize: 18, color: "#94a3b8" }}>
          Made with Labologics • Understand your labs in plain English + Urdu
        </p>
      </div>
    );
  },
);

export default ShareCard;
