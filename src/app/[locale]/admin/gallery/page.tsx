"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import LogoLoader from "@/src/components/loading/LogoLoader";
import {
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineArrowUpTray,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineStar,
} from "react-icons/hi2";

interface GalleryItemData {
  _id: string;
  $id: string;
  galleryId: string;
  title: string;
  category: string;
  date: string;
  location?: string;
  description?: string;
  src: string;
  fileId?: string;
  featured?: boolean;
  createdAt?: string;
}

const CATEGORIES = [
  "Conventions",
  "Welfare Drives",
  "Youth & Education",
  "Cultural Events",
  "Regional Assemblies",
  "Executive Meets",
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<GalleryItemData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Conventions",
    date: "",
    location: "",
    description: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/gallery");
      const body = await res.json();
      if (body.success) {
        setItems(body.data || []);
        setError("");
      } else {
        setError(body.error || "Failed to load gallery items");
      }
    } catch (err: any) {
      setError("An error occurred while loading gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Conventions",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      location: "",
      description: "",
      featured: false,
    });
    setSelectedFile(null);
    setImagePreview(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItemData) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      date: item.date,
      location: item.location || "",
      description: item.description || "",
      featured: Boolean(item.featured),
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
      payload.append("location", formData.location);
      payload.append("description", formData.description);
      payload.append("featured", formData.featured ? "true" : "false");
      if (selectedFile) {
        payload.append("file", selectedFile);
      }

      const url = editingItem
        ? `/api/admin/gallery/${editingItem._id || editingItem.$id}`
        : "/api/admin/gallery";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const body = await res.json();
      if (body.success) {
        setIsModalOpen(false);
        fetchGallery();
      } else {
        setFormError(body.error || "Operation failed");
      }
    } catch (err: any) {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/admin/gallery/${deleteCandidate._id || deleteCandidate.$id}`,
        { method: "DELETE" }
      );
      const body = await res.json();
      if (body.success) {
        setDeleteCandidate(null);
        fetchGallery();
      } else {
        alert(body.error || "Failed to delete item");
      }
    } catch (err) {
      alert("Failed to delete gallery item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-4 sm:p-6 lg:p-8 text-[#2B0904]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EECDA3] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F5F54] text-white">
                <HiOutlinePhoto className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-black text-[#3D120D]">
                Photo Galleries Management
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload, organize, edit, and curate photos for the public gallery archives.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5F54] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0D4A42] transition"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add New Photo
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EECDA3] shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-[#0F5F54] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search photo titles or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
            />
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="py-16">
            <LogoLoader message="Loading photo archives..." />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center text-xs text-red-700">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#EECDA3] bg-white p-12 text-center">
            <HiOutlinePhoto className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">No photos found</h3>
            <p className="text-xs text-gray-400 mt-1">
              Click &quot;Add New Photo&quot; to upload your first community photo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id || item.$id}
                className="group relative rounded-2xl border border-[#EECDA3] bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <span className="absolute top-2 right-2 rounded-lg bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm">
                        <HiOutlineStar className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#3D120D] line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <HiOutlineCalendar className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <HiOutlineMapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-[#0F5F54] transition"
                    title="Edit Photo"
                  >
                    <HiOutlinePencilSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(item)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                    title="Delete Photo"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-[#EECDA3] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-[#3D120D]">
                  {editingItem ? "Edit Photo" : "Upload New Photo"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Photo Upload Area */}
                <div>
                  <label className="block font-semibold text-[#5A1C16] mb-1.5">
                    Photo File *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-[#0F5F54] transition bg-gray-50">
                    {imagePreview ? (
                      <div className="relative h-44 w-full rounded-xl overflow-hidden mb-2">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="py-6">
                        <HiOutlineArrowUpTray className="h-8 w-8 text-gray-400 mx-auto mb-1.5" />
                        <p className="text-gray-600 font-medium">
                          Click or drag image file here
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {imagePreview && (
                    <p className="text-[10px] text-gray-500 mt-1 text-center">
                      Click image box above to choose a different photo
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#5A1C16] mb-1">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. State Level Delegates Convention"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#5A1C16] mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#5A1C16] mb-1">
                      Date Display *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      placeholder="e.g. June 2026"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#5A1C16] mb-1">
                    Event Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#5A1C16] mb-1">
                    Event Description / Caption (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide additional details or context about the event..."
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5F54]"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#0F5F54] focus:ring-[#0F5F54]"
                  />
                  <label
                    htmlFor="featured-check"
                    className="text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    Feature this photo on the gallery top picks
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#0F5F54] px-5 py-2 text-xs font-bold text-white hover:bg-[#0D4A42] transition shadow-md disabled:opacity-70"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingItem
                      ? "Save Changes"
                      : "Upload Photo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-red-200">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Delete Photo?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Are you sure you want to delete &quot;<strong>{deleteCandidate.title}</strong>&quot;? This action will permanently remove the photo from Appwrite cloud storage and cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
