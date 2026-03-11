"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ReactPlayer = dynamic(
  () => import("react-player").then((m) => m.default),
  { ssr: false }
);

function getYouTubeEmbed(url: string): string | null {
  const s = url.trim();
  const m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0` : null;
}

type Slide = { type: "image"; url: string } | { type: "video"; url: string };

export function SkillCarousel({
  images = [],
  videoUrl,
  themeGlow,
}: {
  images?: string[];
  videoUrl?: string;
  themeGlow: string;
}) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const slides: Slide[] = [
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
    ...images.map((url) => ({ type: "image" as const, url })),
  ];

  if (slides.length === 0) {
    return (
      <div className={`flex aspect-video w-full items-center justify-center rounded-2xl border ${themeGlow} bg-slate-800/50`}>
        <p className="text-slate-500">No media</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Swiper
        onSwiper={(s) => { swiperRef.current = s; }}
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        touchEventsTarget="container"
        grabCursor
        observer
        observeParents
        pagination={{ clickable: true, dynamicBullets: true }}
        className={`aspect-video w-full overflow-hidden rounded-2xl border ${themeGlow} bg-slate-800/50`}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            {slide.type === "video" ? (
              <div className="relative h-full w-full bg-black">
                {getYouTubeEmbed(slide.url) ? (
                  <iframe
                    src={getYouTubeEmbed(slide.url)!}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <ReactPlayer src={slide.url} width="100%" height="100%" controls />
                )}
              </div>
            ) : (
              <div className="relative flex h-full w-full items-center justify-center bg-neutral-900">
                <Image
                  src={slide.url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className={`absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-white/10 backdrop-blur-md transition hover:bg-white/20 ${themeGlow}`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className={`absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-white/10 backdrop-blur-md transition hover:bg-white/20 ${themeGlow}`}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}
    </div>
  );
}
