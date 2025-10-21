"use client";
import { useState, useEffect } from "react";

interface ColorInputProps {
  name: string;
  defaultValue?: string;
  className?: string;
}

export function ColorInput({ name, defaultValue = "#7C3AED", className = "" }: ColorInputProps) {
  const [color, setColor] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return (
      <>
        <div className={`w-16 h-10 border border-gray-300 rounded-lg bg-gray-100 ${className}`}></div>
        <input type="hidden" name={name} value={defaultValue} />
      </>
    );
  }

  return (
    <>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className={`w-16 h-10 border border-gray-300 rounded-lg cursor-pointer ${className}`}
      />
      <input type="hidden" name={name} value={color} />
    </>
  );
}
