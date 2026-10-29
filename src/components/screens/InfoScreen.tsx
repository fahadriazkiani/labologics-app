"use client";

import { useState } from "react";
import { ARTICLES } from "../../lib/articles";

/** Health Insights — screen-blogs from labologics-preview.html, expanded. */
export default function InfoScreen() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="px-5 pb-4 pt-6 animate-fade-in">
      <h2 className="mb-1 text-2xl font-bold text-slate-900">Health Insights</h2>
      <p className="mb-6 text-sm font-medium text-slate-500">Learn about different lab tests.</p>

      <div className="flex flex-col gap-5">
        {ARTICLES.map((article) => {
          const open = openId === article.id;
          return (
            <article
              key={article.id}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                {/* Placeholder artwork, as in the original HTML (placehold.co). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://placehold.co/600x300/${article.imageBg}?text=${article.imageText}`}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <span
                  className={`absolute bottom-3 left-4 rounded-lg px-2.5 py-1 text-xs font-bold text-white backdrop-blur ${article.tagColor}`}
                >
                  {article.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg font-bold text-slate-900">{article.title}</h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{article.excerpt}</p>
                {open && (
                  <div className="mt-4 space-y-3 animate-fade-in">
                    {article.body.map((paragraph, i) => (
                      <p key={i} className="text-sm leading-relaxed text-slate-600">
                        {paragraph}
                      </p>
                    ))}
                    <p className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-medium leading-relaxed text-orange-800">
                      Educational information only — not medical advice. Discuss
                      your own results with your doctor.
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : article.id)}
                  aria-expanded={open}
                  className="mt-4 flex items-center gap-1.5 text-sm font-bold text-teal-600 transition-all hover:gap-2"
                >
                  {open ? "Show less" : "Read full article"} <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
