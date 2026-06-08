"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateContractorProfile } from "@/app/actions/Contractor/updateContractorProfile";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const TRADES = [
  "General Contractor",
  "Electrician",
  "Plumber",
  "HVAC Technician",
  "Handyman",
  "Roofer",
  "Landscaper",
  "Mason",
  "Carpenter",
  "Concrete & Paving",
  "Painter",
  "Tiler",
  "Flooring Specialist",
  "Window & Door Specialist",
];

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-slate-700 mb-1.5"
    >
      {children}
    </label>
  );
}

function Section({ title, description, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export default function EditProfileForm({ contractor, slug }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [certInput, setCertInput] = useState("");
  const [form, setForm] = useState({
    name: contractor.name ?? "",
    bio: contractor.bio ?? "",
    phone: contractor.phone ?? "",
    email: contractor.email ?? "",
    trade: contractor.trade ?? "",
    yearsExperience: contractor.yearsExperience ?? "",
    certifications: contractor.certifications ?? [],
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addCert() {
    const trimmed = certInput.trim();
    if (trimmed && !form.certifications.includes(trimmed)) {
      set("certifications", [...form.certifications, trimmed]);
    }
    setCertInput("");
  }

  function removeCert(cert) {
    set(
      "certifications",
      form.certifications.filter((c) => c !== cert),
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContractorProfile(slug, form);
      toast.success("Profile updated");
      router.refresh();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <Section
        title="Basic Information"
        description="Your public-facing name and trade shown to homeowners."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="name">Display Name</FieldLabel>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Marko Horvat"
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="trade">Trade</FieldLabel>
            <Select value={form.trade} onValueChange={(v) => set("trade", v)}>
              <SelectTrigger id="trade" className="w-full">
                <SelectValue placeholder="Select your trade" />
              </SelectTrigger>
              <SelectContent>
                {TRADES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Textarea
            id="bio"
            rows={4}
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="Describe your experience, specialisms, and what clients can expect when working with you…"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            {form.bio.length}/500 characters
          </p>
        </div>
      </Section>

      {/* Contact */}
      <Section
        title="Contact Details"
        description="How homeowners can reach you directly."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+353 87 123 4567"
            />
          </div>
          <div>
            <FieldLabel htmlFor="email">Contact Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>
      </Section>

      {/* Experience */}
      <Section
        title="Experience"
        description="Help clients understand your background."
      >
        <div className="max-w-xs">
          <FieldLabel htmlFor="years">Years of Experience</FieldLabel>
          <Input
            id="years"
            type="number"
            min={0}
            max={60}
            value={form.yearsExperience}
            onChange={(e) => set("yearsExperience", e.target.value)}
            placeholder="e.g. 12"
          />
        </div>
      </Section>

      {/* Certifications */}
      <Section
        title="Certifications"
        description="Licences and qualifications that build client trust."
      >
        <div className="flex gap-2">
          <Input
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCert();
              }
            }}
            placeholder="e.g. RECI Registered, Safe Pass"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCert}
            className="shrink-0"
          >
            Add
          </Button>
        </div>

        {form.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-700"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => removeCert(cert)}
                  className="text-orange-400 hover:text-orange-700 transition-colors"
                  aria-label={`Remove ${cert}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {form.certifications.length === 0 && (
          <p className="text-xs text-slate-400">No certifications added yet.</p>
        )}
      </Section>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8"
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
