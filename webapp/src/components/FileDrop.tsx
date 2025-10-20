"use client";
import { useRef, useState, DragEvent } from "react";

type Props = {
  name: string;
  label: string;
  accept?: string;
  className?: string;
  existingFileName?: string | null;
};

export default function FileDrop({ name, label, accept = "image/*", className, existingFileName }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const dt = new DataTransfer();
    dt.items.add(files[0]);
    if (inputRef.current) {
      inputRef.current.files = dt.files;
      setFileName(files[0].name);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setHovered(false);
    onFiles(e.dataTransfer.files ?? null);
  }

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded p-4 text-sm cursor-pointer select-none ${
          hovered ? "border-black bg-gray-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setHovered(true);
        }}
        onDragLeave={() => setHovered(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label={`Upload ${label}`}
      >
        <div className="font-medium mb-1">{label}</div>
        <div className="text-gray-500">
          {fileName ? (
            <span>Selected: {fileName}</span>
          ) : existingFileName ? (
            <span>Current: {existingFileName}</span>
          ) : (
            <span>Drag & drop, or click to choose a file</span>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" name={name} accept={accept} className="hidden" onChange={(e) => onFiles(e.target.files)} />
    </div>
  );
}


