"use client";

import { useEffect, useRef } from "react";

export default function AdSenseUnit() {
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    if (!adRef.current || isPushed.current) return;

    // Check if this specific instance has already been processed
    if (adRef.current.getAttribute("data-adsbygoogle-status") === "done") {
      isPushed.current = true;
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Use contentRect or observe the parent's width
        const width = entry.contentRect.width;
        
        if (width >= 100 && !isPushed.current) {
          try {
            // Final check on status before pushing
            if (adRef.current?.getAttribute("data-adsbygoogle-status") !== "done") {
              // @ts-ignore
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              isPushed.current = true;
              observer.disconnect();
            }
          } catch (err) {
            console.error("AdSense error (ResizeObserver):", err);
          }
        }
      }
    });

    if (adRef.current) {
      // Observe the parent container for width changes
      const target = adRef.current.parentElement || adRef.current;
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full my-4 flex justify-center overflow-hidden min-h-[50px]">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-2319578381550272"
        data-ad-slot="3060488859"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
