"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "gallery-covers";
const MAX_SIZE = 6 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function safeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return `${base || "cover"}-${Date.now()}.${extension}`;
}

export default function CoverUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setStatus("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus("Избери JPG, PNG или WebP изображение.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setStatus("Корицата трябва да бъде до 6 MB.");
      return;
    }

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Сесията е изтекла. Влез отново.");
      setUploading(false);
      return;
    }

    const path = `${user.id}/${safeFileName(file.name)}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error(error);
      setStatus(`Качването не успя: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    setCoverUrl(data.publicUrl);
    setStatus("Корицата е качена успешно.");
    setUploading(false);
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) upload(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="cover-uploader">
      <input type="hidden" name="cover_url" value={coverUrl} />

      <div
        className={`cover-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          className="cover-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInput}
        />

        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Преглед на корицата"
            width={1400}
            height={900}
            className="cover-preview"
            unoptimized
          />
        ) : (
          <div className="cover-placeholder">
            <span className="cover-upload-icon">＋</span>
            <strong>Плъзни корицата тук</strong>
            <span>или натисни, за да избереш файл</span>
            <small>JPG, PNG или WebP · максимум 6 MB</small>
          </div>
        )}

        {uploading && <div className="cover-uploading">Качване...</div>}
      </div>

      {status && (
        <p className={coverUrl ? "upload-success" : "upload-error"}>
          {status}
        </p>
      )}

      {coverUrl && (
        <button
          type="button"
          className="remove-cover-button"
          onClick={() => {
            setCoverUrl("");
            setPreviewUrl("");
            setStatus("");
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          Избери друга корица
        </button>
      )}
    </div>
  );
}
