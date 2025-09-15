import { FaEnvelope, FaPhoneAlt, FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-[#ffe6bf]">
      <div className="py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Left Side - Contact Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#5A1C16] mb-4">Contact us</h2>
            <p className="text-[#2B0904] mb-6">
              We will be happy to listen to you and suggest event ideas you hadn’t considered
            </p>

            {/* Email */}
            <div className="flex items-center gap-3 mb-3">
              <FaEnvelope className="text-[#5A1C16] text-xl" />
              <a href="mailto:vaddera@gmail.com" className="text-[#2B0904]">
                vaddera@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 mb-6">
              <FaPhoneAlt className="text-[#5A1C16] text-xl" />
              <a href="tel:9876543210" className="text-[#2B0904]">
                9876543210
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 text-2xl text-[#5A1C16]">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaWhatsapp /></a>
              <a href="#"><MdEmail /></a>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h3 className="text-xl font-semibold text-[#5A1C16] mb-2">
              We’d love to hear from you!
            </h3>
            <p className="text-[#5A1C16] mb-6">Let’s get in touch</p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5A1C16] mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A1C16] bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A1C16] mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A1C16] bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A1C16] mb-1">Your Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A1C16] bg-gray-100"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#5A1C16] text-white px-6 py-2 rounded-md hover:bg-[#3E120F] transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#EECDA3] text-center py-4 text-sm text-[#5A1C16]">
        © {new Date().getFullYear()} Vaddera Reservation Porata Samithi |{" "}
        <a href="https://vaddera.org" target="_blank" rel="noopener noreferrer" className="underline">
          vaddera.org
        </a>
      </div>
    </footer>
  );
}
