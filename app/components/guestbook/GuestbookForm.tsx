"use client";

import { useState } from "react";
import Button from "../ui/Button";

export interface GuestbookEntryPayload {
  id: string;
  name: string;
  message: string;
  website?: string;
  social?: string;
  createdAt: string;
}

interface GuestbookFormProps {
  onSuccess: (entry: GuestbookEntryPayload) => void;
}

export default function GuestbookForm({ onSuccess }: GuestbookFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    website: "",
    social: "",
    websiteHp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit");
      }

      setFormData({
        name: "",
        message: "",
        website: "",
        social: "",
        websiteHp: "",
      });
      setSuccess("Message posted successfully.");
      onSuccess(data as GuestbookEntryPayload);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit message";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <input
            type="text"
            required
            maxLength={40}
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <input
          type="url"
          maxLength={120}
          placeholder="Website (optional)"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
        <input
          type="text"
          maxLength={120}
          placeholder="Social (optional)"
          value={formData.social}
          onChange={(e) => setFormData({ ...formData, social: e.target.value })}
        />
      </div>

      <textarea
        required
        rows={4}
        maxLength={280}
        placeholder="Leave a short message..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.websiteHp}
          onChange={(e) => setFormData({ ...formData, websiteHp: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="text-sm text-green-700 dark:text-green-400">{success}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
