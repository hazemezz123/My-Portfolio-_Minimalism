"use client";

import { useState, useRef } from "react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const contentRef = useRef<HTMLDivElement>(null);
  useFadeInOnScroll(contentRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send");

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact">
      <Container>
        <div ref={contentRef} className="max-w-lg mx-auto" style={{ opacity: 0 }}>
          <Heading className="mb-4 text-center">Get in Touch</Heading>
          <p className="text-[var(--muted)] text-center mb-10">
            Have a project in mind or want to collaborate? Send me a message.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--text)] mb-10">
            <a
              href="mailto:hazemezzeldeen@gmail.com"
              className="underline-offset-4 transition-colors duration-150 ease-out hover:underline"
            >
              hazemezzeldeen@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/hazem-ezz-424498285/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors duration-150 ease-out hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/hazemezz123"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors duration-150 ease-out hover:underline"
            >
              GitHub
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[var(--text)]"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--text)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-[var(--text)]"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Your message..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>

            {status === "success" && (
              <p className="text-sm text-[var(--muted)] text-center mt-3">
                Message sent successfully. I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center mt-3">
                Failed to send message. Please try again.
              </p>
            )}
          </form>
        </div>
      </Container>
    </Section>
  );
}
