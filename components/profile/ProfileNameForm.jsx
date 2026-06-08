"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfileName } from "@/app/actions/User/updateProfileName";
import { updateProfileEmail } from "@/app/actions/User/updateProfileEmail";

export default function ProfileNameForm({ currentName, currentEmail }) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);

  const isDirtyName = name.trim() !== currentName.trim();
  const isDirtyEmail = email.trim() !== currentEmail.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileName(name);
      await updateProfileEmail(email);
      toast.success("Profile updated");
      router.refresh();
    } catch (err) {
      toast.error(err.message ?? "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
        />
        <Label className="mt-4" htmlFor="name">
          Email
        </Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={60}
          required
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={loading || !isDirtyName || !isDirtyEmail}
      >
        {loading ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
