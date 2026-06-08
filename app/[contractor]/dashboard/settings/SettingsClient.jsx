"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateAvailability } from "@/app/actions/Contractor/updateAvailability";
import { changePassword } from "@/app/actions/User/changePassword";
import { deleteAccount } from "@/app/actions/User/deleteAccount";

import toast from "react-hot-toast";

function AvailabilitySection({ slug, available }) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(available);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      await updateAvailability(slug, !isAvailable);
      setIsAvailable((prev) => !prev);
      toast.success(
        `You are now ${!isAvailable ? "available" : "unavailable"} for new work`,
      );
      router.refresh();
    } catch {
      toast.error("Failed to update availability");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">Availability</p>
        <p className="text-xs text-muted-foreground">
          {isAvailable
            ? "You appear as available for new projects"
            : "You are hidden from new inquiries"}
        </p>
      </div>
      <Button
        variant={isAvailable ? "default" : "outline"}
        size="sm"
        onClick={toggle}
        disabled={loading}
      >
        {isAvailable ? "Available" : "Unavailable"}
      </Button>
    </div>
  );
}

function PasswordSection() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.next !== form.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.next.length < 12) {
      toast.error("Password must be at least 12 characters");
      return;
    }
    setLoading(true);
    try {
      await changePassword(form.current, form.next);
      toast.success("Password changed successfully");
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="current">Current Password</Label>
        <Input
          id="current"
          type="password"
          value={form.current}
          onChange={(e) => set("current", e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="new">New Password</Label>
        <Input
          id="new"
          type="password"
          value={form.next}
          onChange={(e) => set("next", e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm New Password</Label>
        <Input
          id="confirm"
          type="password"
          value={form.confirm}
          onChange={(e) => set("confirm", e.target.value)}
          required
        />
      </div>
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Saving…" : "Change Password"}
      </Button>
    </form>
  );
}

function ExportDataSection({ slug }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);

    try {
      const res = await fetch(`/api/contractors/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch profile data");

      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}-profile-data.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Profile data has been exported");
    } catch (error) {
      toast.error("Export failed, please try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">Export Profile Data</p>
        <p className="text-xs text-muted-foreground">
          Download your full profile as a JSON file
        </p>
      </div>
      <button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={loading}
        className="px-3 py-1 border rounded text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? "Exporting..." : "Export Data"}
      </button>
    </div>
  );
}

function DangerZone({ hasPassword, email }) {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const emailConfirmed =
    !!email && emailConfirm.trim().toLowerCase() === email.toLowerCase();

  function handleCancel() {
    setConfirming(false);
    setPassword("");
    setEmailConfirm("");
  }

  async function handleDelete() {
    if (hasPassword && !password) {
      toast.error("Enter your password to confirm deletion");
      return;
    }
    if (!hasPassword && !emailConfirmed) {
      toast.error("Type your email exactly to confirm deletion");
      return;
    }
    setLoading(true);
    try {
      await deleteAccount(hasPassword ? password : undefined);
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      toast.error("Failed to delete account");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Permanently delete your account, profile, and all portfolio items. This
        cannot be undone.
      </p>
      {!confirming ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setConfirming(true)}
        >
          Delete Account
        </Button>
      ) : (
        <div className="space-y-3">
          {hasPassword ? (
            <div className="space-y-1.5">
              <Label htmlFor="delete-confirm-password">
                Enter your password to confirm
              </Label>
              <Input
                id="delete-confirm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your current password"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="delete-confirm-email">
                Type{" "}
                <span className="font-semibold text-foreground">{email}</span>{" "}
                to confirm
              </Label>
              <Input
                id="delete-confirm-email"
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                placeholder={email}
                autoComplete="off"
                disabled={loading}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={
                loading ||
                (hasPassword ? password.length === 0 : !emailConfirmed)
              }
            >
              {loading ? "Deleting…" : "Yes, delete my account"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsClient({
  slug,
  available,
  hasPassword,
  email,
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilitySection slug={slug} available={available} />
        </CardContent>
      </Card>

      {hasPassword && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordSection />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportDataSection slug={slug} />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          <DangerZone hasPassword={hasPassword} email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
