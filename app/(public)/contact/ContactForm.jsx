"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

const TOPICS = [
  "General question",
  "Account or sign-in help",
  "Partnership",
  "Press / Media",
  "Other",
];

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: TOPICS[0],
    message: "",
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // Wire to a server action / email provider when ready.
      await new Promise((res) => setTimeout(res, 400));
      toast.success("Thanks — we'll be in touch.");
      setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
    } catch {
      toast.error("Couldn't send your message. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-extrabold text-[#071525]">Send a message</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="topic">Topic</Label>
        <select
          id="topic"
          value={form.topic}
          onChange={(e) => set("topic", e.target.value)}
          className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#071525] focus:outline-none focus:ring-2 focus:ring-[#F97316]/40"
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us a little about what you need…"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-fit">
        <Send size={14} className="mr-1.5" />
        {loading ? "Sending…" : "Send message"}
      </Button>

      <p className="text-xs text-gray-400">
        By sending, you agree to our{" "}
        <a href="/terms-of-service" className="underline hover:text-[#F97316]">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="underline hover:text-[#F97316]">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}