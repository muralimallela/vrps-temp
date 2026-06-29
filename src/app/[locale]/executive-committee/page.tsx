"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LogoLoader from "@/src/components/loading/LogoLoader";
import { HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineSparkles } from "react-icons/hi2";

interface Member {
  _id?: string;
  $id?: string;
  name: string;
  designation: string;
  role: string;
  image: string;
}

const FALLBACK_MEMBERS: Member[] = [
  {
    name: "Santhosh Vaddera",
    designation: "State President",
    role: "State Leadership",
    image: "/committee/santhosh.jpeg",
  },
  {
    name: "Uppendra Vaddera",
    designation: "General Secretary",
    role: "State Leadership",
    image: "/committee/uppendra.png",
  },
  {
    name: "Shiva Vaddera",
    designation: "State Treasurer",
    role: "State Leadership",
    image: "/committee/shiva.jpg",
  },
];

export default function ExecutiveCommitteePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/public/committee");
        const body = await res.json();
        if (body.success && Array.isArray(body.data) && body.data.length > 0) {
          setMembers(body.data);
        } else {
          setMembers(FALLBACK_MEMBERS);
        }
      } catch (err) {
        setMembers(FALLBACK_MEMBERS);
      } finally {
        setIsLoading(false);
      }
    }
    loadMembers();
  }, []);

  if (isLoading) {
    return <LogoLoader message="Loading executive committee members..." />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#36100B] via-[#4A120A] to-[#6A160A] py-16 md:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-white/10 px-4 py-1.5 text-xs font-bold text-amber-200 backdrop-blur-md mb-6 shadow-sm">
            <HiOutlineSparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            Vaddera Rashtriya Samkshema Sangham
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            Executive Committee
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-amber-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Meet our dedicated state officers and leaders driving empowerment, welfare initiatives, and community progress across the nation.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-semibold text-amber-200/80">
            <div className="flex items-center gap-1.5">
              <HiOutlineShieldCheck className="h-4 w-4 text-amber-400" />
              <span>State Leadership</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineUserGroup className="h-4 w-4 text-emerald-400" />
              <span>Executive Officers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Committee Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="rounded-3xl border border-[#e4c69d]/40 bg-white p-6 sm:p-10 shadow-xl backdrop-blur-lg">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#36100B]">State Committee Officers</h2>
              <p className="text-xs text-slate-500 mt-0.5">Official governing body and representative council</p>
            </div>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-[#6A160A]">
              {members.length} Members
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <div
                key={member._id || member.$id || index}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0F5F54]/30 flex flex-col items-center text-center"
              >
                {/* Image Frame */}
                <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-slate-100 mb-5 shadow-inner">
                  <Image
                    src={member.image || "/committee/santhosh.jpeg"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Role Badge */}
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0F5F54] bg-[#0F5F54]/10 border border-[#0F5F54]/20 px-3 py-1 rounded-full mb-2">
                  <HiOutlineShieldCheck className="h-3.5 w-3.5" />
                  {member.role || "Executive Committee"}
                </span>

                {/* Name & Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#6A160A] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-[#6A160A] mt-1 tracking-wide uppercase">
                  {member.designation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
