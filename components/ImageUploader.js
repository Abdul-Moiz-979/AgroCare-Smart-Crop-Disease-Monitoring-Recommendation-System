"use client";

import { useState, useRef } from "react";
import { validateImageFile, formatFileSize } from "@/lib/utils";
import { useAppTranslations } from "@/contexts/I18nContext";

export default function ImageUploader({ onImageSelect, selectedCrop }) {
  const t = useAppTranslations("imageUploader");
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setError("");

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));

      if (onImageSelect) {
        onImageSelect(file, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    setFileSize("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageSelect) {
      onImageSelect(null, null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {!preview ? (
        <div
          className={`
                        border-2 border-dashed border-gray-300 rounded-2xl px-4 py-8 md:p-12 text-center cursor-pointer
                        transition-all duration-250
                        bg-linear-to-br from-white/80 to-gray-50/80
                        hover:border-primary hover:from-white hover:to-gray-50 hover:-translate-y-0.5 hover:shadow-lg
                        ${dragActive ? "border-primary bg-linear-to-br from-primary/5 to-success/5 scale-[1.02]" : ""}
                    `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="pointer-events-none">
            <div className="text-5xl md:text-6xl mb-4 animate-pulse">📤</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {t("dropHere", { crop: selectedCrop || "crop" })}
            </h3>
            <p className="text-base text-gray-600 mb-4">{t("orClick")}</p>
            <p className="text-sm text-gray-500 m-0">{t("supports")}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs md:text-sm font-medium text-amber-800 border border-amber-200">
              <span>⚠️</span>
              <span>{t("disclaimerDistance")}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-md animate-fade-in">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🖼️</span>
              <div>
                <p className="font-medium text-gray-900 m-0 mb-1 break-all">
                  {fileName}
                </p>
                <p className="text-sm text-gray-500 m-0">{fileSize}</p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="flex items-center justify-center w-8 h-8 bg-error text-white border-none rounded-full cursor-pointer text-lg transition-all duration-150 hover:scale-110 hover:shadow-md"
              aria-label={t("removeImage")}
            >
              ✕
            </button>
          </div>

          <div className="relative w-full max-w-125 mx-auto mb-6 rounded-lg overflow-hidden shadow-lg">
            <img
              src={preview}
              alt={t("preview")}
              className="w-full h-auto block rounded-lg"
            />
          </div>

          <button
            onClick={handleClick}
            className="w-full px-4 py-4 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg text-base font-medium cursor-pointer transition-all duration-150 hover:bg-gray-200 hover:border-gray-400"
          >
            {t("changeImage")}
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-4 px-4 py-4 bg-error/10 border-l-4 border-error rounded-md text-error text-sm animate-slide-left">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
