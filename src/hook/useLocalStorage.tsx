import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue = null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const item = localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return storedValue;
}
