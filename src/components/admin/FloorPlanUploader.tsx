"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";

export interface FloorPlanRow {
  title: string;
  image: string;
}

interface FloorPlanUploaderProps {
  value: FloorPlanRow[];
  onChange: (plans: FloorPlanRow[] | ((prev: FloorPlanRow[]) => FloorPlanRow[])) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

const FLOOR_NAMES = [
  "Ground Floor",
  "First Floor",
  "Second Floor",
  "Third Floor",
  "Fourth Floor",
  "Fifth Floor",
  "Sixth Floor",
  "Rooftop",
];

function suggestName(count: number) {
  return count < FLOOR_NAMES.length ? FLOOR_NAMES[count] : `Floor ${count + 1}`;
}

export default function FloorPlanUploader({ value, onChange, onUploadingChange }: FloorPlanUploaderProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingIndexRef = useRef<number | null>(null);

  const triggerUpload = (index: number) => {
    pendingIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = pendingIndexRef.current;
    if (!file || index == null) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(`${file.name} is too large — maximum size is 5MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadingIndex(index);
    onUploadingChange?.(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      onChange((prev) => prev.map((f, j) => (j === index ? { ...f, image: data.url } : f)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
    } finally {
      setUploadingIndex(null);
      onUploadingChange?.(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      pendingIndexRef.current = null;
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-off-white">Architectural Plans</h3>
          <p className="text-sm text-neutral-500">
            Upload one image per floor — ground, first, second and so on.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...value, { title: suggestName(value.length), image: "" }])}
          className="flex items-center gap-2 bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-md hover:border-neutral-900 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add floor
        </button>
      </div>

      {error && (
        <p className="mb-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>
      )}

      <div className="space-y-3">
        {value.map((plan, i) => (
          <div key={i} className="flex items-center gap-3 border border-neutral-200 rounded-lg p-4 bg-neutral-50">
            <button
              type="button"
              onClick={() => triggerUpload(i)}
              disabled={uploadingIndex != null}
              className="relative w-24 h-16 shrink-0 rounded-lg border border-neutral-300 bg-white overflow-hidden flex items-center justify-center hover:border-neutral-900 transition-colors disabled:opacity-60"
              title={plan.image ? "Replace image" : "Upload image"}
            >
              {uploadingIndex === i ? (
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              ) : plan.image ? (
                <Image src={plan.image} alt={plan.title || `Plan ${i + 1}`} fill className="object-cover" />
              ) : (
                <Upload className="w-5 h-5 text-neutral-400" />
              )}
            </button>
            <input
              value={plan.title}
              onChange={(e) => onChange(value.map((f, j) => (j === i ? { ...f, title: e.target.value } : f)))}
              placeholder="Floor name (e.g. Ground Floor)"
              className="w-52 bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-2.5 text-neutral-900 text-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => triggerUpload(i)}
              disabled={uploadingIndex != null}
              className="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-2 disabled:opacity-50"
            >
              {plan.image ? "Replace" : "Upload image"}
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              title="Remove floor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {value.length === 0 && (
          <p className="text-sm text-neutral-400 italic">
            No floor plans — the plans viewer will be hidden on the property page.
          </p>
        )}
      </div>
    </div>
  );
}
