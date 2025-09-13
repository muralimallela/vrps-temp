"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./Community-Carousel.css";

import CarouselHeader from "./CarouselHeader";
import { communityMembers } from "../../data/communityMembers";

export default function CommunityCarousel() {
  return (
    <div className="carousel">
      <CarouselHeader />

      <Swiper
        className="my-swiper"
        modules={[Pagination, Autoplay]}
        grabCursor
        centeredSlides
        loop
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1560: { slidesPerView: 5 },
        }}
      >
        {communityMembers.map((data, index) => (
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
}
