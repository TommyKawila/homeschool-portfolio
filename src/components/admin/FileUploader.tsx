"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

/** Sanitize filename for storage (no path, minimal safe chars). */
function safeFileName(name: string): string {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
}

export function FileUploader({
  bucket,
  folder,
  pathFileName,
  pathSubfolder,
  useFileNameInPath,
  currentUrl,
  onUploaded,
  accept = "image/*",
}: {
  bucket: string;
  folder: string;
  /** If set, path is folder/pathFileName.ext (overwrites same file with upsert). */
  pathFileName?: string;
  /** If set with useFileNameInPath, path is folder/pathSubfolder/Date.now()-filename */
  pathSubfolder?: string;
  useFileNameInPath?: boolean;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  accept?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentUrl);
  }, [currentUrl]);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    let path: string;
    if (pathFileName) {
      path = `${folder}/${pathFileName}.${ext}`;
    } else if (pathSubfolder && useFileNameInPath) {
      const base = safeFileName(file.name) || "file";
      path = `${folder}/${pathSubfolder}/${Date.now()}-${base}`;
    } else {
      path = `${folder}/${Date.now()}.${ext}`;
    }
    const sb = getSupabase();
    const { error } = await sb.storage.from(bucket).upload(path, file, { upsert: !!pathFileName });
    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    setPreview(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    upload(file);
  };

  return (
    <div className="relative">
      {preview ? (
        <div className="group relative h-28 w-full overflow-hidden rounded-lg border border-slate-500/25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(null); inputRef.current && (inputRef.current.value = ""); }}
            className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-28 w-full items-center justify-center rounded-lg border border-dashed border-slate-500/30 bg-slate-700/30 text-slate-400 transition hover:border-slate-400/40 hover:bg-slate-700/40 hover:text-slate-300"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
    </div>
  );
}
