"use client";

import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  galleryId: string;
  slug: string;
};

type UploadItem = {
  name: string;
  status: "waiting" | "uploading" | "done" | "error";
  message?: string;
};

const BUCKET = "galleries";
const CONCURRENCY = 3;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function cleanFilename(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

  return `${base || "photo"}.${extension}`;
}

export default function FolderUploader({ galleryId, slug }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);

  const completed = items.filter((item) => item.status === "done").length;
  const failed = items.filter((item) => item.status === "error").length;
  const progress = items.length
    ? Math.round(((completed + failed) / items.length) * 100)
    : 0;

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files]
  );

  function chooseFiles(selected: File[]) {
    const valid = selected.filter(
      (file) =>
        ACCEPTED_TYPES.has(file.type) &&
        file.size <= MAX_FILE_SIZE
    );

    setFiles(valid);
    setItems(
      valid.map((file) => ({
        name: file.name,
        status: "waiting",
      }))
    );
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    chooseFiles(Array.from(event.target.files ?? []));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFiles(Array.from(event.dataTransfer.files ?? []));
  }

  function patchItem(index: number, patch: Partial<UploadItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  }

  async function uploadOne(file: File, index: number) {
    patchItem(index, { status: "uploading", message: undefined });

    const supabase = createClient();
    const filename = cleanFilename(file.name);
    const uniqueFilename = `${String(index + 1).padStart(5, "0")}-${Date.now()}-${filename}`;
    const storagePath = `${slug}/${uniqueFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      patchItem(index, {
        status: "error",
        message: uploadError.message,
      });
      return;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const { error: databaseError } = await supabase.from("photos").insert({
      gallery_id: galleryId,
      filename: file.name,
      storage_path: storagePath,
      public_url: publicData.publicUrl,
      sort_order: index,
      file_size: file.size,
      mime_type: file.type,
    });

    if (databaseError) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      patchItem(index, {
        status: "error",
        message: databaseError.message,
      });
      return;
    }

    patchItem(index, { status: "done" });
  }

  async function startUpload() {
    if (!files.length || running) return;

    setRunning(true);

    let cursor = 0;

    async function worker() {
      while (cursor < files.length) {
        const index = cursor;
        cursor += 1;
        await uploadOne(files[index], index);
      }
    }

    await Promise.all(
      Array.from(
        { length: Math.min(CONCURRENCY, files.length) },
        () => worker()
      )
    );

    setRunning(false);
  }

  return (
    <section className="folder-uploader">
      <div
        className={`folder-dropzone ${dragging ? "dragging" : ""}`}
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
          multiple
          onChange={handleInput}
          // @ts-expect-error Chromium/Safari folder selection attribute
          webkitdirectory=""
        />

        <span className="folder-upload-icon">📁</span>
        <strong>Избери папка със снимки</strong>
        <span>или плъзни JPG, PNG и WebP файлове тук</span>
        <small>Максимум 50 MB на снимка</small>
      </div>

      {files.length > 0 && (
        <div className="upload-dashboard">
          <div className="upload-summary">
            <div>
              <strong>{files.length} снимки</strong>
              <span>
                {(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB общо
              </span>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={startUpload}
              disabled={running || completed === files.length}
            >
              {running
                ? "Качване..."
                : completed === files.length
                  ? "Качването приключи"
                  : "Започни качването"}
            </button>
          </div>

          <div className="upload-progress-track">
            <div
              className="upload-progress-value"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="upload-progress-text">
            {completed} / {files.length} качени · {progress}%
            {failed > 0 ? ` · ${failed} грешки` : ""}
          </p>

          <div className="upload-queue">
            {items.slice(0, 80).map((item, index) => (
              <div className="upload-row" key={`${item.name}-${index}`}>
                <span className={`upload-state ${item.status}`}>
                  {item.status === "done"
                    ? "✓"
                    : item.status === "error"
                      ? "!"
                      : item.status === "uploading"
                        ? "↑"
                        : "•"}
                </span>
                <span className="upload-filename">{item.name}</span>
                <span className="upload-status">
                  {item.status === "done"
                    ? "Готово"
                    : item.status === "error"
                      ? item.message ?? "Грешка"
                      : item.status === "uploading"
                        ? "Качва се"
                        : "Изчаква"}
                </span>
              </div>
            ))}
            {items.length > 80 && (
              <p className="upload-more">
                Показани са първите 80 файла от общо {items.length}.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
