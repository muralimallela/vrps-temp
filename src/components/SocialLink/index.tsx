"use client";
import React from "react";
import { FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { MdOutlineWhatsapp } from "react-icons/md";
const FloatingIcons: React.FC = () => {
  return (
    <nav className="fixed bottom-10 left-1 z-50 flex flex-col items-end space-y-1">
      <ul className="flex flex-col ">
        <li>
          <a
            href="https://www.facebook.com/profile.php?id=100088677746845&mibextid=ZbWKwL"
            target="_blank"
            className="group flex h-9 w-9 items-center rounded-t-md bg-blue-600 px-2 text-white transition-all duration-300 lg:hover:w-36 lg:hover:rounded-r-md"
          >
            <div>
              <FaFacebook className="text-lg" />
            </div>
            <span className="ml-2 hidden font-bold uppercase tracking-wider lg:group-hover:inline">
              Facebook
            </span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="group flex h-9 w-9 items-center bg-[#000000] px-2 text-white transition-all duration-300 lg:hover:w-36 lg:hover:rounded-r-md"
          >
            <div>
              <BsTwitterX className="text-lg" />
            </div>
            <span className="ml-2 hidden font-bold uppercase tracking-wider lg:group-hover:inline">
              Twitter
            </span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="group flex h-9 w-9 items-center bg-pink-600 px-2 font-bold text-white transition-all duration-300 lg:hover:w-36 lg:hover:rounded-r-md"
          >
            <div>
              <BsInstagram className="text-lg" />
            </div>
            <span className="ml-2 hidden font-bold uppercase tracking-wider lg:group-hover:inline">
              Instagram
            </span>
          </a>
        </li>
        {/* <li>
          <a
            href="#"
            className="group flex h-9 w-9 items-center bg-[#0a66c2] px-2 text-white transition-all duration-300 lg:hover:w-36 lg:hover:rounded-r-md"
          >
            <div>
              <FaLinkedinIn className="text-lg" />
            </div>
            <span className="ml-2 hidden font-bold uppercase tracking-wider lg:group-hover:inline">
              Linkedin
            </span>
          </a>
        </li> */}
        <li>
          <a
            href="https://chat.whatsapp.com/D4hxhBhib0RKyaYhe17okS"
            target="_blank"
            className="group flex h-9 w-9 items-center bg-[#43e460] px-2 text-white transition-all duration-300 lg:hover:w-36 lg:hover:rounded-r-md"
          >
            <div>
              <MdOutlineWhatsapp className="text-xl" />
            </div>
            <span className="ml-2 hidden font-bold uppercase tracking-wider duration-500 lg:group-hover:inline">
              WhatsApp
            </span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="group flex h-9 w-9 items-center rounded-b-md bg-red-600 px-2 text-white transition-all duration-300 lg:hover:w-36 lg:hover:rounded-r-md"
          >
            <div>
              <FaYoutube className="text-xl" />
            </div>
            <span className="ml-2 hidden font-bold uppercase tracking-wider lg:group-hover:inline">
              Youtube
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default FloatingIcons;
