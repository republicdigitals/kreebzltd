"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface MediaItem {
  id: string;
  url: string;
  storageKey: string;
  isCover: boolean;
  order: number;
  altText?: string | null;
  mimeType?: string;
  size?: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface MediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export default function MediaUploader({ media, onChange }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeMedia = media.filter(m => !m.isDeleted).sort((a, b) => a.order - b.order);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const newMediaItems: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          let errorMessage = "Upload failed";
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        newMediaItems.push({
          id: `temp-${Date.now()}-${i}`,
          url: data.url,
          storageKey: data.path,
          mimeType: data.mimeType,
          size: data.size,
          isCover: activeMedia.length === 0 && i === 0, // First ever image is cover
          order: activeMedia.length + i,
          isNew: true,
        });
      } catch (err) {
        console.error("Error uploading file:", err);
        setError(err instanceof Error ? err.message : "Failed to upload one or more files. Please check your connection.");
      }
    }

    if (newMediaItems.length > 0) {
      onChange([...media, ...newMediaItems]);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const normalizeOrder = (items: MediaItem[]) => {
    const active = items.filter(m => !m.isDeleted).sort((a, b) => a.order - b.order);
    const orderOf = new Map(active.map((m, i) => [m.id, i]));
    return items.map((m) => ({ ...m, order: orderOf.get(m.id) ?? m.order }));
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    const sorted = media.filter(m => !m.isDeleted).sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((m) => m.id === id);
    const swapWith = sorted[idx + dir];
    if (idx < 0 || !swapWith) return;
    const updated = media.map((m) => {
      if (m.id === id) return { ...m, order: swapWith.order };
      if (m.id === swapWith.id) return { ...m, order: sorted[idx].order };
      return m;
    });
    onChange(normalizeOrder(updated));
  };

  const updateAltText = (id: string, altText: string) => {
    onChange(media.map((m) => (m.id === id ? { ...m, altText } : m)));
  };

  const setAsCover = (id: string) => {
    onChange(
      media.map((item) => ({
        ...item,
        isCover: item.id === id,
      }))
    );
  };

  const removeMedia = (id: string) => {
    onChange(
      media.map((item) => {
        if (item.id === id) {
          return { ...item, isDeleted: true, isCover: false };
        }
        return item;
      })
    );
    
    // If we removed the cover, make the first available image the cover
    const remainingActive = media.filter(m => m.id !== id && !m.isDeleted);
    if (remainingActive.length > 0 && !remainingActive.some(m => m.isCover)) {
      setAsCover(remainingActive[0].id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-off-white">Property Media</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-md hover:bg-[#F3E5AB] transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>Upload Images</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {activeMedia.length === 0 ? (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No media uploaded yet.</p>
          <p className="text-gray-500 text-sm mt-2">Click Upload Images to add photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeMedia.map((item, index) => (
            <div key={item.id} className="space-y-2">
              <div
                className={`relative group rounded-lg overflow-hidden border-2 ${
                  item.isCover ? "border-[#D4AF37]" : "border-gray-700"
                }`}
              >
                <div className="aspect-video relative bg-neutral-100">
                  <Image
                    src={item.url}
                    alt={item.altText || "Property media"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setAsCover(item.id)}
                      className={`p-1.5 rounded-full ${
                        item.isCover
                          ? "bg-[#D4AF37] text-black"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                      }`}
                      title="Set as cover image"
                    >
                      <Star className="w-4 h-4" fill={item.isCover ? "currentColor" : "none"} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMedia(item.id)}
                      className="p-1.5 bg-red-600/80 text-white rounded-full hover:bg-red-600"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, -1)}
                      disabled={index === 0}
                      className="p-1.5 bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 disabled:opacity-40"
                      title="Move earlier"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, 1)}
                      disabled={index === activeMedia.length - 1}
                      className="p-1.5 bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 disabled:opacity-40"
                      title="Move later"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {item.isCover && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] text-black text-xs font-bold text-center py-1">
                    COVER IMAGE
                  </div>
                )}
              </div>
              <input
                type="text"
                value={item.altText ?? ""}
                onChange={(e) => updateAltText(item.id, e.target.value)}
                placeholder="Caption / alt text"
                className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-md px-3 py-1.5 text-xs text-neutral-900 transition-colors"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
