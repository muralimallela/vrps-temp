"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Roboto } from "next/font/google";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./Community-Carousel.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const robotoBold = Roboto({
  weight: "700",
  subsets: ["latin"],
});
interface SliderItem {
  title: string;
  description: string;
  url: string;
}

const slider: SliderItem[] = [
  {
    title: "Santhosh",
    description: "President",
    url: "/committee/santhosh.png",
  },
  { title: "Shiva", description: "President", url: "/committee/shiva.png" },
  {
    title: "Uppendra",
    description: "President",
    url: "/committee/uppendra.png",
  },
  { title: "Logo", description: "President", url: "/committee/logo12.png" },
  {
    title: "Santhosh",
    description: "President",
    url: "/committee/santhosh.png",
  },
  { title: "Shiva", description: "President", url: "/committee/shiva.png" },
  {
    title: "Uppendra",
    description: "President",
    url: "/committee/uppendra.png",
  },
  { title: "Logo", description: "President", url: "/committee/logo12.png" },
  {
    title: "Santhosh",
    description: "President",
    url: "/committee/santhosh.png",
  },
  { title: "Logo", description: "President", url: "/committee/logo12.png" },
];

const CommunityCarousel: React.FC = () => {
  return (
    <div className="carousel">
      <div>
        <div className="carousel-content">
          <div className="content-bg">
            <h1 className={`${robotoBold.className}`}>COMMUNITY MEMBERS</h1>
            <p className={`${roboto.className}`}>
              A community thrives when people unite with kindness, share
              knowledge, and support each other, creating a stronger, brighter
              future for everyone.
            </p>
          </div>

          <div className="community-btn">
            <a href="#" className="slider-btn">
              Visit Community
            </a>
          </div>
        </div>
      </div>

      <Swiper
        className="my-swiper"
        modules={[Pagination, Autoplay]}
        grabCursor
        centeredSlides
        loop
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1560: { slidesPerView: 5 },
        }}
      >
        {slider.map((data, index) => (
          <SwiperSlide
            key={index}
            style={{ backgroundImage: `url(${data.url})` }}
            className="my-swiper-slider"
          >
            <div>
              <h2>{data.title}</h2>
              <p>{data.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommunityCarousel;
