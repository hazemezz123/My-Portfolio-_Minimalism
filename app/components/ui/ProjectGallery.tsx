"use client";

import { useState } from "react";
import Image from "next/image";
import ImageDialog from "./ImageDialog";

interface ProjectGalleryProps {
  photos: string[];
  projectTitle: string;
}

export default function ProjectGallery({
  photos,
  projectTitle,
}: ProjectGalleryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialDialogIndex, setInitialDialogIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-medium text-[var(--text)]">Screenshots</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setInitialDialogIndex(index);
                setIsDialogOpen(true);
              }}
              className="relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--surface)] border border-[var(--border)] transition-all duration-300 hover:border-[var(--muted)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] group"
            >
              <Image
                src={photo}
                alt={`${projectTitle} screenshot ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </div>

      <ImageDialog
        images={photos}
        initialIndex={initialDialogIndex}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
