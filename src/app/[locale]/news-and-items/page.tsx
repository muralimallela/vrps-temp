"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { RiCloseCircleLine } from "react-icons/ri";

interface Photo {
  src: string;
  alt: string;
}

const photos: Photo[] = [
  { src: "/images/news/1.jpeg", alt: "Photo 1" },
  { src: "/images/news/2.jpeg", alt: "Photo 2" },
  { src: "/images/news/3.jpeg", alt: "Photo 3" },
  { src: "/images/news/4.jpeg", alt: "Photo 4" },
  { src: "/images/news/5.jpeg", alt: "Photo 5" },
  { src: "/images/news/6.jpeg", alt: "Photo 6" },
  { src: "/images/news/7.jpeg", alt: "Photo 7" },
  { src: "/images/news/9.jpeg", alt: "Photo 9" },
  { src: "/images/news/10.jpeg", alt: "Photo 10" },
  { src: "/images/news/12.jpeg", alt: "Photo 12" },
  { src: "/images/news/14.jpeg", alt: "Photo 14" },
];

const Gallery: FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="p-4 lg:container bg-amber-50">
      <h1 className="mb-6 text-3xl font-bold">News Gallery</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative h-64 w-full cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              layout="fill"
              objectFit="cover"
              loading="lazy"
              className="rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative">
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              layout="intrinsic"
              width={1000}
              height={1000}
              objectFit="contain"
              priority={true}
              className="max-w-screen max-h-screen rounded-xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2"
            >
              <RiCloseCircleLine className="text-3xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
