"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl: string;
  image?: string;
  photos?: string[];
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  website?: string;
  social?: string;
  createdAt: string;
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    tags: [],
    demoUrl: "",
    codeUrl: "",
    image: "",
    photos: [],
  });
  const [tagsInput, setTagsInput] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isResumeLoading, setIsResumeLoading] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(
    [],
  );
  const [isLoadingGuestbook, setIsLoadingGuestbook] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("adminAuth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchResumeConfig();
      fetchGuestbook();
    }
  }, [isAuthenticated]);

  const fetchResumeConfig = async () => {
    try {
      const response = await fetch("/api/config/resume");
      if (response.ok) {
        const data = await response.json();
        setResumeUrl(data.url);
      }
    } catch (err) {
      console.error("Failed to fetch resume config:", err);
    }
  };

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResumeLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/config/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: resumeUrl }),
      });

      if (!response.ok) throw new Error("Failed to update resume URL");
      alert("Resume link updated successfully!");
    } catch (err) {
      setError("Failed to update resume link");
      console.error(err);
    } finally {
      setIsResumeLoading(false);
    }
  };

  const fetchGuestbook = async () => {
    setIsLoadingGuestbook(true);
    try {
      const response = await fetch("/api/guestbook");
      if (!response.ok) throw new Error("Failed to fetch guestbook entries");
      const data = await response.json();
      setGuestbookEntries(data);
    } catch (err) {
      console.error("Failed to load guestbook:", err);
    } finally {
      setIsLoadingGuestbook(false);
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setPassword("");
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    setFormData({
      ...formData,
      tags: e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tags: [],
      demoUrl: "",
      codeUrl: "",
      image: "",
      photos: [],
    });
    setTagsInput("");
    setEditingProject(null);
    setShowForm(false);
    setSelectedImageFile(null);
    setImageUploadError(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setTagsInput(project.tags.join(", "));
    setShowForm(true);
    setSelectedImageFile(null);
    setImageUploadError(null);
  };

  const handleImageUpload = async () => {
    if (!selectedImageFile) {
      setImageUploadError("Please select an image first");
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError(null);

    try {
      const signResponse = await fetch("/api/cloudinary/sign", {
        method: "POST",
      });

      if (!signResponse.ok) {
        throw new Error("Failed to generate upload signature");
      }

      const { cloudName, apiKey, timestamp, folder, signature } =
        await signResponse.json();

      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedImageFile);
      uploadFormData.append("api_key", apiKey);
      uploadFormData.append("timestamp", String(timestamp));
      uploadFormData.append("signature", signature);
      uploadFormData.append("folder", folder);
      uploadFormData.append("format", "webp");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadFormData,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const uploadData = await uploadResponse.json();

      setFormData((prev) => ({
        ...prev,
        image: uploadData.secure_url,
      }));
      setSelectedImageFile(null);
    } catch (err) {
      setImageUploadError("Image upload failed. Please try again.");
      console.error(err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const method = editingProject ? "PUT" : "POST";
      const body = editingProject
        ? { ...formData, id: editingProject.id }
        : formData;

      const response = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save project");

      await fetchProjects();
      resetForm();
    } catch (err) {
      setError("Failed to save project");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");
      await fetchProjects();
    } catch (err) {
      setError("Failed to delete project");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-medium text-[var(--text)] mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h1 className="text-lg font-medium text-[var(--text)]">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-[var(--text)] hover:underline underline-offset-4 transition-colors duration-150 ease-out"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--text)] hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 ease-out"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-4 py-2 text-sm font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
          >
            {showForm ? "Cancel" : "Add Project"}
          </button>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 text-sm font-medium rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-600 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
            {error}
          </p>
        )}

        {/* Project Form */}
        {showForm && (
          <div className="border border-[var(--border)] bg-[var(--surface)] rounded-lg p-6 space-y-4">
            <h2 className="text-base font-medium text-[var(--text)]">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Code URL
                  </label>
                  <input
                    type="url"
                    name="codeUrl"
                    value={formData.codeUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    placeholder="React.js, JavaScript, CSS..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Project Image
                </label>
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedImageFile(e.target.files?.[0] || null)
                      }
                      className="text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!selectedImageFile || isUploadingImage}
                      className="px-4 py-2 text-sm font-medium rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-600 transition-colors duration-150 ease-out disabled:opacity-50 whitespace-nowrap"
                    >
                      {isUploadingImage ? "Uploading..." : "Upload Image"}
                    </button>
                  </div>

                  {imageUploadError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {imageUploadError}
                    </p>
                  )}

                  <input
                    type="text"
                    name="image"
                    value={formData.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://res.cloudinary.com/..."
                  />

                  {formData.image && (
                    <Image
                      src={formData.image}
                      alt="Uploaded preview"
                      width={480}
                      height={176}
                      className="w-full max-w-sm h-44 object-cover rounded-md border border-[var(--border)]"
                    />
                  )}
                </div>
              </div>

              {/* Multi-Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Project Photos (Gallery)
                </label>
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setIsUploadingImage(true);
                        setImageUploadError(null);
                        try {
                          const newPhotos: string[] = [];
                          for (let i = 0; i < files.length; i++) {
                            const signRes = await fetch(
                              "/api/cloudinary/sign",
                              { method: "POST" },
                            );
                            if (!signRes.ok) throw new Error("Failed to sign");
                            const {
                              cloudName,
                              apiKey,
                              timestamp,
                              folder,
                              signature,
                            } = await signRes.json();
                            const fd = new FormData();
                            fd.append("file", files[i]);
                            fd.append("api_key", apiKey);
                            fd.append("timestamp", String(timestamp));
                            fd.append("signature", signature);
                            fd.append("folder", folder);
                            fd.append("format", "webp");
                            const uploadRes = await fetch(
                              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                              { method: "POST", body: fd },
                            );
                            if (!uploadRes.ok) throw new Error("Upload failed");
                            const data = await uploadRes.json();
                            newPhotos.push(data.secure_url);
                          }
                          setFormData((prev) => ({
                            ...prev,
                            photos: [...(prev.photos || []), ...newPhotos],
                          }));
                        } catch (err) {
                          setImageUploadError("Photo upload failed.");
                          console.error(err);
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }}
                      className="text-sm"
                    />
                    {isUploadingImage && (
                      <span className="text-sm text-[var(--muted)] animate-pulse">
                        Uploading...
                      </span>
                    )}
                  </div>

                  {/* Photos preview */}
                  {formData.photos && formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative group">
                          <Image
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            width={200}
                            height={120}
                            className="w-full h-24 object-cover rounded-md border border-[var(--border)]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                photos:
                                  prev.photos?.filter((_, i) => i !== idx) ||
                                  [],
                              }));
                            }}
                            className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 text-sm font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors duration-150 ease-out disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : editingProject
                      ? "Update"
                      : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 text-sm font-medium rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-600 transition-colors duration-150 ease-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resume Config */}
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-lg p-6">
          <h2 className="text-base font-medium text-[var(--text)] mb-4">
            Resume Configuration
          </h2>
          <form
            onSubmit={handleResumeSubmit}
            className="flex flex-col md:flex-row gap-3"
          >
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="/Hazem-cv.pdf or https://..."
              className="flex-1"
            />
            <button
              type="submit"
              disabled={isResumeLoading}
              className="px-4 py-2.5 text-sm font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors duration-150 ease-out disabled:opacity-50 whitespace-nowrap"
            >
              {isResumeLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>

        {/* Guestbook */}
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h2 className="text-base font-medium text-[var(--text)]">
              Guestbook ({guestbookEntries.length})
            </h2>
            <button
              onClick={fetchGuestbook}
              className="text-sm text-[var(--text)] hover:underline underline-offset-4 transition-colors duration-150 ease-out"
              disabled={isLoadingGuestbook}
            >
              Refresh
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoadingGuestbook && guestbookEntries.length === 0 ? (
              <div className="p-8 text-center">
                <div className="loading-spinner mx-auto" />
              </div>
            ) : guestbookEntries.length === 0 ? (
              <p className="p-8 text-center text-sm text-[var(--muted)]">
                No guestbook entries found.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {guestbookEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 flex justify-between items-start gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[var(--text)]">
                          {entry.name}
                        </span>
                        {(entry.website || entry.social) && (
                          <span className="text-xs text-[var(--muted)]">
                            {entry.website || entry.social}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--muted)]">
                        {entry.message}
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-lg">
          <div className="p-4 border-b border-[var(--border)]">
            <h2 className="text-base font-medium text-[var(--text)]">
              Projects ({projects.length})
            </h2>
          </div>

          {isLoading && projects.length === 0 ? (
            <div className="p-8 text-center">
              <div className="loading-spinner mx-auto" />
            </div>
          ) : projects.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--muted)]">
              No projects found. Add your first project!
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-[var(--text)]">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--muted)] mt-1 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text)] hover:underline underline-offset-4 transition-colors duration-150 ease-out"
                        >
                          Demo
                        </a>
                      )}
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text)] hover:underline underline-offset-4 transition-colors duration-150 ease-out"
                      >
                        Code
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-sm text-[var(--text)] hover:underline underline-offset-4 transition-colors duration-150 ease-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => project.id && handleDelete(project.id)}
                      className="text-sm text-[var(--text)] hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 ease-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--muted)] pb-4">
          Portfolio Admin &middot; &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
