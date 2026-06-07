"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateAvailability, changePassword, deleteAccount } from "@/app/actions/contractor-actions";
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
      toast.success(`You are now ${!isAvailable ? "available" : "unavailable"} for new work`);
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
          {isAvailable ? "You appear as available for new projects" : "You are hidden from new inquiries"}
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
      toast.error(err.message ?? "Failed to change password");
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

function DangerZone({ hasPassword }) {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCancel() {
    setConfirming(false);
    setPassword("");
  }

  async function handleDelete() {
    if (hasPassword && !password) {
      toast.error("Enter your password to confirm deletion");
      return;
    }
    setLoading(true);
    try {
      await deleteAccount(hasPassword ? password : undefined);
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      toast.error(err.message ?? "Failed to delete account");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Permanently delete your account, profile, and all portfolio items. This cannot be undone.
      </p>
      {!confirming ? (
        <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
          Delete Account
        </Button>
      ) : (
        <div className="space-y-3">
          {hasPassword && (
            <div className="space-y-1.5">
              <Label htmlFor="delete-confirm-password">Enter your password to confirm</Label>
              <Input
                id="delete-confirm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your current password"
                autoComplete="current-password"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting…" : "Yes, delete my account"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsClient({ slug, available, hasPassword }) {
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

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          <DangerZone hasPassword={hasPassword} />
        </CardContent>
      </Card>
    </div>
  );
}
