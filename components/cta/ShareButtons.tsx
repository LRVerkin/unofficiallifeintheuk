"use client";

import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

interface ShareButtonsProps {
  summary: string;
  url?: string;
}

export function ShareButtons({ summary, url = "https://unofficiallifeinthe.uk" }: ShareButtonsProps) {
  const sharePayload = { title: "Unofficial Life in the UK", text: summary, url };

  async function handleShare() {
    trackEvent({ name: "share_click", payload: { channel: "web_share" } });
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(sharePayload);
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${summary} ${url}`);
    }
  }

  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${summary} ${url}`);
    }
    trackEvent({ name: "share_click", payload: { channel: "clipboard" } });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleShare} variant="primary">
        Share
      </Button>
      <Button onClick={handleCopy} variant="secondary">
        Copy Link
      </Button>
    </div>
  );
}
