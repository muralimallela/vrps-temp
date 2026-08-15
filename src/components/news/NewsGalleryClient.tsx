"use client";

import { FC, useState, useEffect, useCallback, TouchEvent } from "react";
import Image from "next/image";
import {
  HiOutlineNewspaper,
  HiOutlinePhoto,
  HiOutlineSparkles,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowDownTray,
  HiOutlineShare,
  HiOutlineCheck,
  HiOutlineClipboardDocument,
  HiOutlineLink,
} from "react-icons/hi2";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

interface NewsItem {
  id: string | number;
  src: string;
  title: string;
  category: string;
  date: string;
}

const fallbackItems: NewsItem[] = [
  { id: "1", src: "/images/news/1.jpeg", title: "Community Gathering & Convention", category: "Events", date: "June 2026" },
  { id: "2", src: "/images/news/2.jpeg", title: "State Level Executive Meeting", category: "Executive", date: "May 2026" },
  { id: "3", src: "/images/news/3.jpeg", title: "Empowerment & Youth Workshop", category: "Workshops", date: "May 2026" },
  { id: "4", src: "/images/news/4.jpeg", title: "Regional Leadership Rally", category: "Rallies", date: "April 2026" },
  { id: "5", src: "/images/news/5.jpeg", title: "Scholarship Distribution Drive", category: "Welfare", date: "April 2026" },
  { id: "6", src: "/images/news/6.jpeg", title: "Cultural Welfare Association Meet", category: "Culture", date: "March 2026" },
  { id: "7", src: "/images/news/7.jpeg", title: "Member Verification Initiative", category: "Executive", date: "March 2026" },
  { id: "8", src: "/images/news/9.jpeg", title: "Press Conference & Memorandum", category: "Press", date: "February 2026" },
  { id: "9", src: "/images/news/10.jpeg", title: "District Representation Conference", category: "Events", date: "January 2026" },
  { id: "10", src: "/images/news/12.jpeg", title: "Community Development Assembly", category: "Welfare", date: "January 2026" },
  { id: "11", src: "/images/news/14.jpeg", title: "Honorary Recognition Ceremony", category: "Events", date: "December 2025" },
];

const categories = ["All", "Events", "Executive", "Welfare", "Workshops", "Culture", "Press", "Rallies"];

export const NewsGalleryClient: FC<{ isTelugu?: boolean }> = ({ isTelugu = false }) => {
  const [items, setItems] = useState<NewsItem[]>(fallbackItems);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCardId, setCopiedCardId] = useState<string | number | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);

  // Touch swipe handling for mobile UX
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Helper to build a canonical shareable URL for a specific news item
  const getItemShareUrl = useCallback((item: NewsItem): string => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("item", String(item.id));
    url.hash = "";
    return url.toString();
  }, []);

  // Sync URL when item is opened
  const openItemModal = useCallback((index: number, itemList: NewsItem[]) => {
    if (index >= 0 && index < itemList.length) {
      setSelectedIndex(index);
      setIsShareMenuOpen(false);
      const targetItem = itemList[index];
      if (typeof window !== "undefined" && targetItem) {
        const url = new URL(window.location.href);
        url.searchParams.set("item", String(targetItem.id));
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, []);

  // Close modal and clean URL
  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    setIsShareMenuOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("item");
      url.searchParams.delete("id");
      const cleanUrl = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "");
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  // Fetch news and open item if specified in URL query
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/public/news");
        const body = await res.json();
        let loadedItems = fallbackItems;
        if (body.success && Array.isArray(body.data) && body.data.length > 0) {
          loadedItems = body.data.map((item: any) => ({
            id: item._id || item.$id,
            src: item.src,
            title: item.title,
            category: item.category,
            date: item.date,
          }));
          setItems(loadedItems);
        }

        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const sharedId = params.get("item") || params.get("id") || window.location.hash.replace("#", "");

          if (sharedId) {
            const foundIndex = loadedItems.findIndex(
              (it) => String(it.id).toLowerCase() === sharedId.toLowerCase()
            );
            if (foundIndex !== -1) {
              setSelectedIndex(foundIndex);
              setTimeout(() => {
                const element = document.getElementById(`news-item-${sharedId}`);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }, 300);
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback news items:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get("item") || params.get("id");
      if (!sharedId) {
        setSelectedIndex(null);
        setIsShareMenuOpen(false);
      } else {
        const foundIndex = items.findIndex(
          (it) => String(it.id).toLowerCase() === sharedId.toLowerCase()
        );
        if (foundIndex !== -1) {
          setSelectedIndex(foundIndex);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [items]);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && filteredItems.length > 0) {
      const nextIdx = selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0;
      openItemModal(nextIdx, filteredItems);
    }
  }, [selectedIndex, filteredItems, openItemModal]);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null && filteredItems.length > 0) {
      const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1;
      openItemModal(prevIdx, filteredItems);
    }
  }, [selectedIndex, filteredItems, openItemModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, closeModal]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const copyToClipboard = (text: string, cardId?: string | number) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          if (cardId) {
            setCopiedCardId(cardId);
            setTimeout(() => setCopiedCardId(null), 2500);
          } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          }
        })
        .catch(() => {
          fallbackCopyText(text, cardId);
        });
    } else {
      fallbackCopyText(text, cardId);
    }
  };

  const fallbackCopyText = (text: string, cardId?: string | number) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      if (cardId) {
        setCopiedCardId(cardId);
        setTimeout(() => setCopiedCardId(null), 2500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  const handleNativeShare = async (item: NewsItem) => {
    const shareUrl = getItemShareUrl(item);
    const shareText = `VRPS News Highlight: ${item.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setIsShareMenuOpen(true);
        }
      }
    } else {
      setIsShareMenuOpen(true);
    }
  };

  const shareWhatsApp = (item: NewsItem) => {
    const shareUrl = getItemShareUrl(item);
    const shareText = `*VRPS News Highlight*\n\n*${item.title}*\nCategory: ${item.category}\nDate: ${item.date}\n\n👉 View details here:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareFacebook = (item: NewsItem) => {
    const shareUrl = getItemShareUrl(item);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleDownload = (item: NewsItem) => {
    const link = document.createElement("a");
    link.href = item.src;
    link.download = `${item.title.replace(/\s+/g, "_")}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] || items[selectedIndex] : null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff8ef,_#fdeed8_35%,_#f4d8b0_100%)] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-7xl">
        {/* Top Hero Card */}
        <header className="mb-10 rounded-3xl border border-[#e4c69d] bg-white/85 p-6 md:p-10 shadow-[0_20px_40px_-24px_rgba(90,28,22,0.45)] backdrop-blur">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6A160A] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
              <HiOutlineNewspaper className="h-4 w-4" />
              {isTelugu ? "VRPS వార్తలు & ప్రకటనలు" : "VRPS Media & Updates"}
            </span>
          </div>
          <h1 className="text-3xl font-black leading-tight text-[#3d120d] md:text-4xl lg:text-5xl">
            {isTelugu ? "తాజా వార్తలు & కార్యక్రమాల సమాచారం" : "News & Community Gallery"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5a3a2e] md:text-base">
            {isTelugu
              ? "సమితి మహాసభలు, సంక్షేమ కార్యక్రమాలు, విద్యా పథకాలు మరియు అధికారిక ప్రకటనల సమాహారం."
              : "Explore recent press highlights, community conventions, welfare drives, and developmental milestones across all regional committees. Direct item links can be shared instantly."}
          </p>

          {/* Controls Bar: Search & Filter */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-[#eddcc8] pt-6">
            {/* Categories Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    closeModal();
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#6A160A] text-white shadow-md scale-105"
                      : "bg-white/80 text-[#5a3a2e] border border-[#e4c69d] hover:bg-[#fff3e5] hover:text-[#3d120d]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box & Counter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a5b3a]" />
                <input
                  type="text"
                  placeholder="Search gallery updates..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    closeModal();
                  }}
                  className="w-full rounded-xl border border-[#e4c69d] bg-white/90 pl-10 pr-4 py-2 text-xs text-[#3d120d] placeholder-[#8a5b3a]/70 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20 shadow-sm"
                />
              </div>
              <span className="hidden sm:inline-block shrink-0 rounded-xl bg-[#0F5F54]/10 border border-[#0F5F54]/20 px-3 py-2 text-xs font-bold text-[#0F5F54]">
                {filteredItems.length} {filteredItems.length === 1 ? "Update" : "Updates"}
              </span>
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl border border-[#e4c69d]/60 bg-white p-3 shadow-sm">
                <div className="h-60 w-full rounded-xl bg-slate-200" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#e4c69d] bg-white/90 p-12 text-center shadow-sm">
            <HiOutlinePhoto className="h-12 w-12 text-[#8a5b3a]/50 mb-3" />
            <h3 className="text-lg font-bold text-[#3d120d]">No News Items Found</h3>
            <p className="mt-1 text-xs text-[#6a4a3b]">Try searching with a different keyword or selecting another category.</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                closeModal();
              }}
              className="mt-4 rounded-xl bg-[#0F5F54] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D4A42]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, index) => (
              <article
                key={item.id}
                id={`news-item-${item.id}`}
                onClick={() => openItemModal(index, filteredItems)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#e4c69d] bg-white p-2.5 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0F5F54] hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative h-60 w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={item.src}
                    alt={`${item.title} - VRPS Community News`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={index < 4}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#3d120d] shadow-lg">
                      <HiOutlineEye className="h-4 w-4 text-[#0F5F54]" />
                      View & Share Highlight
                    </span>
                  </div>

                  {/* Category Badge Top Right */}
                  <span className="absolute top-3 right-3 rounded-lg bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Card Info Bottom */}
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-bold text-[#3d120d] group-hover:text-[#0F5F54] transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#7a5b4c] font-medium border-t border-black/5 pt-2">
                    <span className="flex items-center gap-1">
                      <HiOutlineSparkles className="h-3.5 w-3.5 text-[#0F5F54]" />
                      VRPS Highlights
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#8a5b3a]">{item.date}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(getItemShareUrl(item), item.id);
                        }}
                        title="Copy direct share link"
                        className="rounded-md p-1 hover:bg-[#fff3e5] text-[#8a5b3a] hover:text-[#5A1C16] transition"
                      >
                        {copiedCardId === item.id ? (
                          <HiOutlineCheck className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <HiOutlineLink className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedItem !== null && selectedIndex !== null && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300 animate-fadeIn"
            onClick={closeModal}
          >
            <div
              className="relative flex flex-col items-center max-w-5xl w-full max-h-[94vh]"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Top Controls Bar */}
              <div className="w-full flex items-center justify-between mb-3 px-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur">
                    {selectedIndex + 1} of {filteredItems.length}
                  </span>
                  <span className="text-xs text-gray-300 font-medium hidden sm:inline">
                    ← → or swipe to navigate
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  className="rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition backdrop-blur"
                  aria-label="Close modal"
                >
                  <HiOutlineXMark className="h-6 w-6" />
                </button>
              </div>

              {/* Image Preview Window */}
              <div className="relative w-full h-[65vh] md:h-[73vh] flex items-center justify-center rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
                <Image
                  src={selectedItem.src}
                  alt={`${selectedItem.title} - VRPS Media Highlight`}
                  fill
                  sizes="100vw"
                  className="object-contain p-2 selection:bg-transparent"
                  priority
                />

                {filteredItems.length > 1 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white p-3 shadow-lg transition hover:scale-110 border border-white/10 backdrop-blur z-10"
                    aria-label="Previous image"
                  >
                    <HiOutlineChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {filteredItems.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white p-3 shadow-lg transition hover:scale-110 border border-white/10 backdrop-blur z-10"
                    aria-label="Next image"
                  >
                    <HiOutlineChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="relative w-full mt-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white">{selectedItem.title}</h2>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Category: {selectedItem.category} • {selectedItem.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleNativeShare(selectedItem)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 px-3.5 py-2 text-xs font-bold text-white transition backdrop-blur"
                  >
                    <HiOutlineShare className="h-4 w-4" />
                    Share Item
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(selectedItem)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F5F54] hover:bg-[#0D4A42] px-4 py-2 text-xs font-bold text-white transition shadow-md"
                  >
                    <HiOutlineArrowDownTray className="h-4 w-4" />
                    Download
                  </button>
                </div>

                {/* Share Popover */}
                {isShareMenuOpen && (
                  <div className="absolute right-4 bottom-16 z-50 w-72 rounded-2xl border border-white/20 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-xl text-white animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                      <span className="text-xs font-bold text-gray-200">Share This Highlight</span>
                      <button onClick={() => setIsShareMenuOpen(false)} className="text-gray-400 hover:text-white">
                        <HiOutlineXMark className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => shareWhatsApp(selectedItem)}
                        className="flex w-full items-center gap-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 px-3 py-2 text-xs font-semibold text-emerald-300 transition"
                      >
                        <FaWhatsapp className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Share on WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => shareFacebook(selectedItem)}
                        className="flex w-full items-center gap-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 px-3 py-2 text-xs font-semibold text-blue-300 transition"
                      >
                        <FaFacebook className="h-4 w-4 text-blue-400 shrink-0" />
                        <span>Share on Facebook</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(getItemShareUrl(selectedItem))}
                        className="flex w-full items-center justify-between rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-semibold text-gray-200 transition"
                      >
                        <span className="flex items-center gap-2.5">
                          {copied ? (
                            <HiOutlineCheck className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <HiOutlineClipboardDocument className="h-4 w-4" />
                          )}
                          <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                        </span>
                        {copied && <span className="text-[10px] font-bold text-emerald-400">Copied</span>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
