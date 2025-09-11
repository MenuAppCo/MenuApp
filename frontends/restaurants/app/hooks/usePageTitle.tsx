import { useEffect } from "react";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    // Restaurar el título anterior cuando el componente se desmonte
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
