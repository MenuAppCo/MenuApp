// ScrollToHashElement.tsx
import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [location]);

  return null;
}
