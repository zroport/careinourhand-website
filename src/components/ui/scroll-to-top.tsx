"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const throttled = () => {
      clearTimeout(timer);
      timer = setTimeout(handleScroll, 100);
    };
    window.addEventListener("scroll", throttled, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttled);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={[
        "fixed bottom-8 right-8 z-50 flex items-center justify-center",
        "size-12 rounded-full bg-[#620E87] text-white shadow-lg",
        "hover:bg-[#4e0b6b] hover:scale-110",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87] focus-visible:ring-offset-2",
        "transition-all duration-300",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <ChevronUp className="size-5" aria-hidden="true" />
    </button>
  );
}
