"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";
import GuestbookForm, {
  type GuestbookEntryPayload,
} from "../guestbook/GuestbookForm";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  website?: string;
  social?: string;
  createdAt: string;
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useFadeInOnScroll(contentRef);

  const fetchEntries = useCallback(async () => {
    setFetchError("");

    try {
      const response = await fetch("/api/guestbook", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch guestbook entries");
      }

      setEntries(Array.isArray(data) ? (data as GuestbookEntry[]) : []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load guestbook entries";
      setFetchError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSuccess = (entry: GuestbookEntryPayload) => {
    setEntries((current) => [entry, ...current].slice(0, 50));
    setShowForm(false);
  };

  return (
    <Section id="guestbook">
      <Container>
        <div ref={contentRef} className="max-w-2xl mx-auto" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-10">
            <Heading>Guestbook</Heading>
            <Button
              variant="outline"
              onClick={() => setShowForm((prev) => !prev)}
              className="text-xs"
            >
              {showForm ? "Cancel" : "Sign"}
            </Button>
          </div>

          {showForm && <GuestbookForm onSuccess={handleSuccess} />}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="loading-spinner mx-auto" />
            </div>
          ) : fetchError ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-red-600 dark:text-red-400">{fetchError}</p>
              <Button variant="outline" onClick={fetchEntries} className="text-xs">
                Retry
              </Button>
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-[var(--muted)] text-center py-8">
              No entries yet. Be the first to sign.
            </p>
          ) : (
            <div className="space-y-0 divide-y divide-[var(--border)]">
              {entries.map((entry) => (
                <div key={entry.id} className="py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium text-[var(--text)]">
                      {entry.name}
                    </span>
                    <span className="text-xs text-[var(--muted)] shrink-0">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--muted)] mt-1">{entry.message}</p>

                  {(entry.website || entry.social) && (
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                      {entry.website && (
                        <a
                          href={entry.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text)] underline-offset-4 transition-colors duration-150 ease-out hover:underline"
                        >
                          Website
                        </a>
                      )}
                      {entry.social && <span>{entry.social}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
