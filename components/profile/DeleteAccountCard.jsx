"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { deleteAccount } from "@/app/actions/User/deleteAccount";

export default function DeleteAccountCard({ hasPassword, email }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const emailConfirmed =
    emailConfirm.trim().toLowerCase() === email.toLowerCase();

  function handleOpenChange(next) {
    if (loading) return;
    setOpen(next);
    if (!next) {
      setPassword("");
      setEmailConfirm("");
    }
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
      await signOut({ callbackUrl: "/signin" });
    } catch (err) {
      toast.error("Failed to delete account");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-left cursor-pointer"
      >
        <Card className="hover:bg-red-500 hover:text-white text-black transition-colors h-full">
          <CardContent className="flex items-center gap-3 pt-6">
            <X className="h-5 w-5 text-orange-500 shrink-0" />
            Delete Account
          </CardContent>
        </Card>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This permanently removes your account, saved contractors, and
              inquiries. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

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
                <span className="font-semibold text-slate-900">{email}</span> to
                confirm
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

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
