"use client";

import { useEffect, useState } from "react";

/** Served from `public/` — nice illustration */
export const PERFUME_PLACEHOLDER = "/placeholder-perfume.svg";

/** Always works — used if remote + `/placeholder-perfume.svg` both fail */
const PERFUME_PLACEHOLDER_DATA_URI =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="375" height="500" viewBox="0 0 375 500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ede9fe"/><stop offset="100%" stop-color="#fce7f3"/></linearGradient></defs><rect width="375" height="500" fill="url(#g)"/><path d="M150 115h75c8 0 14 6 14 14v8c0 6-4 11-9 13l-6 2v240c0 16-13 29-29 29h-20c-16 0-29-13-29-29V152l-6-2c-5-2-9-7-9-13v-8c0-8 6-14 14-14z" fill="#a78bfa" fill-opacity="0.45" stroke="#8b5cf6" stroke-width="2"/></svg>`
  );

type PerfumeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

type Stage = "remote" | "file" | "inline";

function initialStage(src?: string | null): Stage {
  return src && String(src).trim() ? "remote" : "file";
}

export function PerfumeImage({ src, alt, className }: PerfumeImageProps) {
  const [stage, setStage] = useState<Stage>(() => initialStage(src));

  useEffect(() => {
    setStage(initialStage(src));
  }, [src]);

  const trimmed = typeof src === "string" ? src.trim() : "";

  const url =
    stage === "remote" && trimmed
      ? trimmed
      : stage === "file"
        ? PERFUME_PLACEHOLDER
        : PERFUME_PLACEHOLDER_DATA_URI;

  function handleError() {
    setStage((s) => {
      if (s === "remote") return "file";
      if (s === "file") return "inline";
      return "inline";
    });
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote perfume CDN URLs
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
}
