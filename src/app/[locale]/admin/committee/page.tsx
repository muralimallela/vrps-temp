"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import LogoLoader from "@/src/components/loading/LogoLoader";
import {
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineArrowUpTray,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

interface CommitteeMemberData {
  _id: string;
  $id: string;
  memberId: string;
  name: string;
  designation: string;
  role: string;
  image: string;
  fileId?: string;
  order: number;
  createdAt?: string;
}

export default function AdminCommitteePage() {
  const [members, setMembers] = useState<CommitteeMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMemberData | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<CommitteeMemberData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    designation: "State President",
    role: "Leadership Committee",
    order: 1,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/committee");
      const body = await res.json();
      if (body.success) {
        setMembers(body.data || []);
        setError("");
      } else {
        setError(body.error || "Failed to load committee members");
      }
    } catch (err: any) {
      setError("An error occurred while loading committee members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      designation: "State President",
      role: "Leadership Committee",
      order: members.length + 1,
    });
    setSelectedFile(null);
    setImagePreview(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: CommitteeMemberData) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      designation: member.designation,
      role: member.role,
      order: member.order || 1,
    });
    setSelectedFile(null);
    setImagePreview(member.image);
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

    if (!formData.name.trim()) {
      setFormError("Please enter full name");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("designation", formData.designation);
      payload.append("role", formData.role);
      payload.append("order", String(formData.order));
      if (selectedFile) {
        payload.append("file", selectedFile);
      }

      const url = editingMember ? `/api/admin/committee/${editingMember._id || editingMember.$id}` : "/api/admin/committee";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const body = await res.json();
      if (body.success) {
        setIsModalOpen(false);
        fetchMembers();
      } else {
        setFormError(body.error || "Operation failed");
      }
    } catch (err: any) {
      setFormError("An error occurred while saving committee member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      setIsSubmitting(true);
      const id = deleteCandidate._id || deleteCandidate.$id;
      const res = await fetch(`/api/admin/committee/${id}`, {
        method: "DELETE",
      });
      const body = await res.json();
      if (body.success) {
        setDeleteCandidate(null);
        fetchMembers();
      } else {
        alert(body.error || "Failed to delete committee member");
      }
    } catch (err) {
      alert("Failed to delete committee member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LogoLoader message="Loading executive committee management..." />;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Top Header Card */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#dcc9a8] bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-[#0F5F54]">
              <HiOutlineUserGroup className="h-4 w-4" />
              Leadership Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#36100B]">Executive Committee</h1>
            <p className="mt-1 text-xs text-[#7A6258]">
              Manage VRPS state and regional executive committee officers, designations, and official portraits.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6A160A] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#521006] shrink-0"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Committee Member
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
              placeholder="Search by officer name or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0F5F54] focus:outline-none focus:ring-1 focus:ring-[#0F5F54] shadow-sm"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Leaders: <strong className="text-[#36100B]">{filteredMembers.length}</strong>
          </span>
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <HiOutlinePhoto className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Committee Members Found</h3>
            <p className="mt-1 text-xs text-slate-500">Click &quot;Add Committee Member&quot; to add executive leaders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMembers.map((member) => (
              <div
                key={member._id || member.$id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 right-2.5 rounded-lg bg-[#6A160A] px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                      Order: #{member.order}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0F5F54] bg-[#0F5F54]/10 px-2.5 py-0.5 rounded-full mb-1">
                      <HiOutlineShieldCheck className="h-3 w-3" />
                      {member.role || "Executive Committee"}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#6A160A] mt-0.5">{member.designation}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleOpenEditModal(member)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    <HiOutlinePencilSquare className="h-3.5 w-3.5 text-blue-600" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(member)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <HiOutlineTrash className="h-3.5 w-3.5 text-red-600" />
                    Delete
                  </button>
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
                    {editingMember ? "Edit Committee Member" : "Add New Committee Member"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter executive leader details and upload an official portrait.
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
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Officer Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Santhosh Vaddera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Designation / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. State President"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Committee Role Group
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leadership Committee"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#0F5F54] focus:outline-none focus:ring-2 focus:ring-[#0F5F54]/20"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Lower order numbers appear first on the public committee page.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Officer Portrait Photo
                  </label>
                  <div className="relative mt-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-4 transition hover:border-[#0F5F54] bg-slate-50 overflow-hidden cursor-pointer group">
                    {imagePreview ? (
                      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-200">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover transition group-hover:scale-105" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition backdrop-blur-[2px]">
                          <span className="rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-[#36100B] shadow-lg">
                            Click to Change Photo
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4 text-center pointer-events-none">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#0F5F54] shadow-sm mb-2">
                          <HiOutlineArrowUpTray className="h-6 w-6" />
                        </div>
                        <p className="text-xs text-slate-700 font-bold">Click or drag portrait photo to upload</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP formats</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 cursor-pointer opacity-0 w-full h-full z-10"
                    />
                  </div>
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
                    {isSubmitting ? (editingMember ? "Saving..." : "Uploading...") : editingMember ? "Update Member" : "Add Member"}
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
                Are you sure you want to remove <strong className="text-slate-900">&quot;{deleteCandidate.name}&quot;</strong> ({deleteCandidate.designation}) from the executive committee?
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
                  {isSubmitting ? "Removing..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
