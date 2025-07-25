"use client";
import { useEffect } from "react";

export default function BannerAd({ id }: { id: string }) {
  useEffect(() => {
    // Commented out Ad code for now
    /*
    window.atOptions = {
      key: "e860354e7691d325775a5c8abe1a7c1e",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    const script = document.createElement("script");
    script.src = "//www.highperformanceformat.com/e860354e7691d325775a5c8abe1a7c1e/invoke.js";
    script.async = true;
    script.id = `banner-ad-script-${id}`;
    document.getElementById(id)?.appendChild(script);

    return () => {
      document.getElementById(id)?.removeChild(script);
    };
    */
  }, [id]);

  return (
    <div className="flex justify-center my-6">
      <div id={id} style={{ width: 728, height: 90 }} />
    </div>
  );
} 