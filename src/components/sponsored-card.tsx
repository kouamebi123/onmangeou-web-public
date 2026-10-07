"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
interface Sponsored {
  viewId: string;
  title: string;
  name: string;
  slug: string;
}
export function SponsoredCard({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [ad, setAd] = useState<Sponsored | null>(null);
  const element = useRef<HTMLElement | null>(null);
  const impression = useRef<Promise<unknown> | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    void fetch(`${apiBaseUrl}/sponsored`, {
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store",
    })
      .then(async (response) => {
        if (response.ok) {
          const result = (await response.json()) as { data: Sponsored | null };
          if (!controller.signal.aborted) setAd(result.data);
        }
      })
      .catch(() => undefined)
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [apiBaseUrl]);
  useEffect(() => {
    if (!ad || !element.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some((entry) => entry.isIntersecting) &&
          !impression.current
        ) {
          impression.current = fetch(
            `${apiBaseUrl}/sponsored/${ad.viewId}/events`,
            {
              method: "POST",
              credentials: "omit",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ event: "IMPRESSION" }),
              keepalive: true,
            },
          ).catch(() => undefined);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [ad, apiBaseUrl]);
  if (!ad) return null;
  return (
    <section className="section appear" ref={element}>
      <p className="eyebrow">{t("ads.sponsored")}</p>
      <h2>{ad.title}</h2>
      <Link
        href={`/restaurants/${encodeURIComponent(ad.slug)}`}
        onClick={() => {
          void impression.current
            ?.then(() =>
              fetch(`${apiBaseUrl}/sponsored/${ad.viewId}/events`, {
                method: "POST",
                credentials: "omit",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event: "CLICK" }),
                keepalive: true,
              }),
            )
            .catch(() => undefined);
        }}
      >
        {ad.name}
      </Link>
    </section>
  );
}
