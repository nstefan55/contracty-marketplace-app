"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createInquiry } from "@/app/actions/contractor-actions";
import toast from "react-hot-toast";
import { ShieldAlert } from "lucide-react";

export default function InquiryFormCard({
  contractorSlug,
  contractorName,
  isLoggedIn,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    projectType: "",
    budget: "",
    timeline: "",
    siteAddress: "",
    description: "",
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      await createInquiry(contractorSlug, form);
      toast.success("Inquiry sent!");
      setForm({
        projectType: "",
        budget: "",
        timeline: "",
        siteAddress: "",
        description: "",
      });
    } catch (err) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="inquiry-form"
      className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col gap-3.5"
    >
      <h3 className="text-[18px] font-bold text-slate-800">
        Send Project Inquiry
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <Field label="Project Type">
          <Input
            placeholder="e.g. Full house rewire"
            value={form.projectType}
            onChange={(e) => set("projectType", e.target.value)}
            required
          />
        </Field>

        <Field label="Budget Range">
          <Input
            placeholder="e.g. €2,000 – €5,000"
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
          />
        </Field>

        <Field label="Timeline">
          <Input
            placeholder="e.g. Within 4 weeks"
            value={form.timeline}
            onChange={(e) => set("timeline", e.target.value)}
          />
        </Field>

        <Field label="Site Postcode">
          <Input
            placeholder="e.g. Dublin 4"
            value={form.siteAddress}
            onChange={(e) => set("siteAddress", e.target.value)}
          />
        </Field>

        <Field label="Description">
          <Textarea
            placeholder="Describe your project..."
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
          />
        </Field>

        <Button
          type="submit"
          disabled={!isLoggedIn || loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
        >
          {loading ? "Sending…" : "Send Inquiry →"}
        </Button>

        {!isLoggedIn && (
          <div className="flex flex-row mx-auto items-center gap-2 mt-4">
            <ShieldAlert className="text-center text-sm text-slate-400" />
            <p className="text-center text-sm text-slate-400">
              You&apos;ll need to sign in to send
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
