"use client";
import React from "react";
import { Roboto } from "next/font/google";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });
const robotoBold = Roboto({ weight: "700", subsets: ["latin"] });

export default function CarouselHeader() {
  return (
    <div className="carousel-content">
      <div className="content-bg">
        <h1 className={robotoBold.className}>COMMUNITY MEMBERS</h1>
        <p className={roboto.className}>
          A community thrives when people unite with kindness, share knowledge,
          and support each other, creating a stronger, brighter future for
          everyone.
        </p>
      </div>

      <div className="community-btn">
        <a href="#" className="slider-btn">
          Visit Community
        </a>
      </div>
    </div>
  );
}
