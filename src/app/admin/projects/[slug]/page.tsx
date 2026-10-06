"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, Trash2, ChevronUp, ChevronDown, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProgressRow {
  date: string;
  milestone: string;
  detail: string;
  image?: string | null;
  imageLabel?: string | null;
}

interface MediaRow {
  src: string;
  label: string;
}

interface ProjectData {
  slug: string;
  name: string;
  url: string;
  progress: ProgressRow[];
  siteMedia: { clips: MediaRow[]; photos: MediaRow[] };
}

function useUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      return data.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error, setError };
}

function MediaEditor({
  title,
  description,
  accept,
  items,
  onChange,
  video,
}: {
  title: string;
  description: string;
  accept: string;
  items: MediaRow[];
  onChange: (items: MediaRow[]) => void;
  video?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error } = useUploader();

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const added: MediaRow[] = [];
    for (const file of Array.from(files)) {
      const url = await upload(file);
      if (url) added.push({ src: url, label: file.name.replace(/\.[^.]+$/, "") });
    }
    if (added.length) onChange([...items, ...added]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50 text-sm"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
        </button>
        <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={handleFiles} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.src + i} className="flex items-center gap-4 border border-neutral-200 rounded-lg p-3 bg-neutral-50">
            <div className="relative w-28 aspect-video rounded-md overflow-hidden bg-black shrink-0">
              {video ? (
                <video src={item.src} muted className="w-full h-full object-cover" />
              ) : (
                <Image src={item.src} alt={item.label} fill className="object-cover" sizes="112px" />
              )}
            </div>
            <input
              value={item.label}
              onChange={(e) => onChange(items.map((m, j) => (j === i ? { ...m, label: e.target.value } : m)))}
              placeholder="Caption (e.g. Piling rig in operation)"
              className="flex-1 bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-2.5 text-neutral-900 text-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-neutral-400 italic">No items yet.</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectEditorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => setError("Failed to load project"))
      .finally(() => setLoading(false));
  }, [slug]);

  const setProgress = (progress: ProgressRow[]) => data && setData({ ...data, progress });
  const setMedia = (siteMedia: ProjectData["siteMedia"]) => data && setData({ ...data, siteMedia });

  const moveRow = (rows: ProgressRow[], i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return rows;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  const onSave = async () => {
    if (!data) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/projects/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: data.progress, siteMedia: data.siteMedia }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-neutral-400">Loading project…</div>;
  if (!data) return <div className="p-8 text-neutral-400">Project not found.</div>;

  const inputCls =
    "w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-2.5 text-neutral-900 text-sm transition-colors";

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 bg-white border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{data.name}</h1>
          <p className="text-neutral-500 mt-1">
            Edit construction progress and site media — publishes to{" "}
            <Link href={data.url} className="underline hover:text-neutral-900" target="_blank">{data.url}</Link>{" "}
            and every linked listing instantly.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">{error}</div>
      )}
      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 text-sm">
          Saved — changes are live on the site.
        </div>
      )}

      {/* Construction progress */}
      <section className="bg-white border border-neutral-200 rounded-xl p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Construction progress</h2>
            <p className="text-sm text-neutral-500">Latest first — shown on the project page and its listings.</p>
          </div>
          <button
            type="button"
            onClick={() => setProgress([{ date: "", milestone: "", detail: "", image: "", imageLabel: "Site photo" }, ...data.progress])}
            className="flex items-center gap-2 bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-md hover:border-neutral-900 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add update
          </button>
        </div>

        <div className="space-y-4">
          {data.progress.map((row, i) => (
            <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-3 bg-neutral-50">
              <div className="flex items-center gap-3">
                <input
                  value={row.date}
                  onChange={(e) => setProgress(data.progress.map((r, j) => (j === i ? { ...r, date: e.target.value } : r)))}
                  placeholder="Date (e.g. 14 May 2026)"
                  className={inputCls + " w-48"}
                />
                <input
                  value={row.milestone}
                  onChange={(e) => setProgress(data.progress.map((r, j) => (j === i ? { ...r, milestone: e.target.value } : r)))}
                  placeholder="Milestone (e.g. Piling works underway)"
                  className={inputCls + " flex-1"}
                />
                <div className="flex flex-col shrink-0">
                  <button type="button" onClick={() => setProgress(moveRow(data.progress, i, -1))} className="p-1 text-neutral-400 hover:text-neutral-900" title="Move up"><ChevronUp className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setProgress(moveRow(data.progress, i, 1))} className="p-1 text-neutral-400 hover:text-neutral-900" title="Move down"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <button
                  type="button"
                  onClick={() => setProgress(data.progress.filter((_, j) => j !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Delete update"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={row.detail}
                onChange={(e) => setProgress(data.progress.map((r, j) => (j === i ? { ...r, detail: e.target.value } : r)))}
                placeholder="What happened, verified by whom…"
                rows={3}
                className={inputCls + " resize-none"}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={row.image ?? ""}
                  onChange={(e) => setProgress(data.progress.map((r, j) => (j === i ? { ...r, image: e.target.value } : r)))}
                  placeholder="Image path — /images/… or uploaded URL"
                  className={inputCls}
                />
                <input
                  value={row.imageLabel ?? ""}
                  onChange={(e) => setProgress(data.progress.map((r, j) => (j === i ? { ...r, imageLabel: e.target.value } : r)))}
                  placeholder="Image label (e.g. Site photo — piling)"
                  className={inputCls}
                />
              </div>
            </div>
          ))}
          {data.progress.length === 0 && (
            <p className="text-sm text-neutral-400 italic">No progress updates yet.</p>
          )}
        </div>
      </section>

      {/* Site media */}
      <section className="bg-white border border-neutral-200 rounded-xl p-8 space-y-8">
        <MediaEditor
          title="Site video clips"
          description="MP4/WebM up to 60MB — autoplay muted in the gallery on the project page and linked listings."
          accept="video/mp4,video/webm"
          items={data.siteMedia.clips}
          onChange={(clips) => setMedia({ ...data.siteMedia, clips })}
          video
        />
        <div className="border-t border-neutral-200" />
        <MediaEditor
          title="Site photos"
          description="JPEG/PNG/WebP up to 10MB — shown in the photo grid."
          accept="image/*"
          items={data.siteMedia.photos}
          onChange={(photos) => setMedia({ ...data.siteMedia, photos })}
        />
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save &amp; publish
        </button>
      </div>
    </div>
  );
}
