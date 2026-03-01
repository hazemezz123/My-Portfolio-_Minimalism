"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl: string;
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
  });
  const [tagsInput, setTagsInput] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isResumeLoading, setIsResumeLoading] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(
    [],
  );
  const [isLoadingGuestbook, setIsLoadingGuestbook] = useState(false);

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
    });
    setTagsInput("");
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setTagsInput(project.tags.join(", "));
    setShowForm(true);
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
