"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import LogoLoader from "@/src/components/loading/LogoLoader";
import {
  HiOutlineNewspaper,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineArrowUpTray,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

interface NewsItemData {
  _id: string;
  $id: string;
  newsId: string;
  title: string;
  category: string;
  date: string;
  src: string;
  fileId?: string;
  createdAt?: string;
}

const CATEGORIES = ["Events", "Executive", "Welfare", "Workshops", "Culture", "Press", "Rallies"];

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItemData | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<NewsItemData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Events",
    date: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/news");
      const body = await res.json();
      if (body.success) {
        setItems(body.data || []);
        setError("");
      } else {
        setError(body.error || "Failed to load news items");
      }
    } catch (err: any) {
      setError("An error occurred while loading news items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Events",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    });
    setSelectedFile(null);
    setImagePreview(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NewsItemData) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      date: item.date,
    });
    setSelectedFile(null);
    setImagePreview(item.src);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Please provide a title");
      return;
    }

    if (!editingItem && !selectedFile) {
      setFormError("Please upload an image file");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("date", formData.date);
      if (selectedFile) {
        payload.append("file", selectedFile);
      }

      const url = editingItem ? `/api/admin/news/${editingItem._id || editingItem.$id}` : "/api/admin/news";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const body = await res.json();
      if (body.success) {
        setIsModalOpen(false);
        fetchNews();
      } else {
        setFormError(body.error || "Operation failed");
      }
    } catch (err: any) {
      setFormError("An error occurred while saving the news item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      setIsSubmitting(true);
      const id = deleteCandidate._id || deleteCandidate.$id;
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });
      const body = await res.json();
      if (body.success) {
        setDeleteCandidate(null);
        fetchNews();
      } else {
        alert(body.error || "Failed to delete news item");
      }
    } catch (err) {
      alert("Failed to delete news item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LogoLoader message="Loading news gallery management..." />;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#dcc9a8] bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-[#0F5F54]">
              <HiOutlineNewspaper className="h-4 w-4" />
              Content Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#36100B]">News & Media Gallery</h1>
            <p className="mt-1 text-xs text-[#7A6258]">
              Manage news highlights, official press releases, and gallery photos.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6A160A] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#521006] shrink-0"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Media Highlight
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search news by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0F5F54] focus:outline-none focus:ring-1 focus:ring-[#0F5F54] shadow-sm"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Items: <strong className="text-[#36100B]">{filteredItems.length}</strong>
          </span>
        </div>

        {/* Media Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <HiOutlinePhoto className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No News Items</h3>
            <p className="mt-1 text-xs text-slate-500">Click &quot;Add Media Highlight&quot; to upload your first gallery item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item._id || item.$id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-48 w-full bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-lg bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-xs font-bold text-slate-800 min-h-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[11px] font-semibold text-slate-500">{item.date}</p>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <HiOutlinePencilSquare className="h-3.5 w-3.5 text-blue-600" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <HiOutlineTrash className="h-3.5 w-3.5 text-red-600" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl animate-fadeIn">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h3 className="text-xl font-bold text-[#36100B]">
                    {editingItem ? "Edit Media Highlight" : "Add New Media Highlight"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {editingItem ? "Update event details or replace the highlight image." : "Publish news events, press releases, or community photos to the public gallery."}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  aria-label="Close form"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-700 flex items-center gap-2">
                  <span className="shrink-0">⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Highlight Title / Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Vaddera Empowerment Convention 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Descriptive headline visible to public website visitors.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Category Tag <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20 bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-slate-400">Filters this media item in the gallery.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Date Display <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. June 2026 or June 28, 2026"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">Timestamp displayed on the highlight badge.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Highlight Image File {!editingItem && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative mt-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-4 transition hover:border-[#0F5F54] bg-slate-50 overflow-hidden cursor-pointer group">
                    {imagePreview ? (
                      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-200">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover transition group-hover:scale-105" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition backdrop-blur-[2px]">
                          <span className="rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-[#36100B] shadow-lg">
                            Click to Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4 text-center pointer-events-none">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#0F5F54] shadow-sm mb-2">
                          <HiOutlineArrowUpTray className="h-6 w-6" />
                        </div>
                        <p className="text-xs text-slate-700 font-bold">Click or drag image here to upload</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP formats (Max 10MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 cursor-pointer opacity-0 w-full h-full z-10"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Upload high-resolution event or media images.</p>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#6A160A] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#521006] disabled:opacity-50"
                  >
                    {isSubmitting ? (editingItem ? "Updating Highlight..." : "Uploading & Saving...") : editingItem ? "Update Highlight" : "Publish Highlight"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900">&quot;{deleteCandidate.title}&quot;</strong>? This will permanently delete the record and remove its stored media file.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
