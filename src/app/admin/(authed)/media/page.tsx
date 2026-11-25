"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, Upload, Copy, Check, Trash2, Loader2, Film, ImageIcon } from "lucide-react";

type MediaItem = {
  name: string;
  url: string;
  createdAt: string | null;
  size: number | null;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media", { credentials: "same-origin" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items ?? []);
      setError(null);
    } catch {
      setError("Failed to load media library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const copyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(item.name);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt("Copy this URL:", item.url);
    }
  };

  const remove = async (item: MediaItem) => {
    if (!confirm(`Permanently delete ${item.name}? Anything using this image will lose it.`)) return;
    setDeleting(item.name);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ name: item.name }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.name !== item.name));
    } catch {
      setError("Failed to delete file.");
    } finally {
      setDeleting(null);
    }
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "same-origin",
        body: form,
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Media Library</h1>
          <p className="text-muted mt-1">
            {loading ? "Loading…" : `${items.length} uploaded file${items.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gold text-background font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <button
            onClick={() => { setLoading(true); load(); }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted hover:text-off-white border border-border hover:border-gold transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="py-24 text-center text-muted text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 opacity-40" />
          Loading media…
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center text-muted text-sm border border-border bg-obsidian-light">
          <ImageIcon className="w-8 h-8 mx-auto mb-3 opacity-30" />
          Nothing uploaded yet. Use the upload button — everything you add to properties, projects and fleet lands here too.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => {
            const isVideo = /\.(mp4|webm)$/i.test(item.name);
            return (
              <div key={item.name} className="group bg-obsidian-light border border-border overflow-hidden hover:border-gold/40 transition-colors">
                <div className="relative aspect-[4/3] bg-obsidian">
                  {isVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center text-muted">
                      <Film className="w-8 h-8 opacity-40" />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-uploaded storage URLs
                    <img src={item.url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-[10px] text-muted font-mono truncate" title={item.name}>{item.name}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted">
                    <span>{formatSize(item.size)}</span>
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                        : ""}
                    </span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => copyUrl(item)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted hover:text-gold border border-border hover:border-gold/50 transition-colors"
                    >
                      {copied === item.name ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied === item.name ? "Copied" : "Copy URL"}
                    </button>
                    <button
                      onClick={() => remove(item)}
                      disabled={deleting === item.name}
                      className="px-2 py-1.5 text-muted hover:text-red-400 border border-border hover:border-red-400/50 transition-colors disabled:opacity-40"
                      aria-label={`Delete ${item.name}`}
                    >
                      {deleting === item.name ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
