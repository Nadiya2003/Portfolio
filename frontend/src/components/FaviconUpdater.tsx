'use client';

import { useEffect } from 'react';

export function FaviconUpdater({ faviconUrl }: { faviconUrl?: string }) {
  useEffect(() => {
    if (!faviconUrl) return;
    // Update existing link tag or create one
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  return null;
}
