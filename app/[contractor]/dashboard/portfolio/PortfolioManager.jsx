"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  addPortfolioItem,
  deletePortfolioItem,
} from "@/app/actions/contractor-actions";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

function AddProjectDialog({ slug, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectType: "",
    completedAt: "",
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await addPortfolioItem(slug, form);
      toast.success("Project added");
      setOpen(false);
      setForm({ title: "", description: "", projectType: "", completedAt: "" });
      onSuccess();
    } catch (err) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ size: "sm" })}>
        <Plus size={14} className="mr-1.5" />
        Add Project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Portfolio Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="projectType">Project Type</Label>
            <Input
              id="projectType"
              value={form.projectType}
              onChange={(e) => set("projectType", e.target.value)}
              placeholder="e.g. Kitchen Renovation"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="completedAt">Completion Date</Label>
            <Input
              id="completedAt"
              type="date"
              value={form.completedAt}
              onChange={(e) => set("completedAt", e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving…" : "Add Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PortfolioManager({ items: initialItems, slug }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deleting, setDeleting] = useState(null);

  // Refresh local items if initialItems change (e.g. after adding/deleting)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await deletePortfolioItem(slug, id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Project removed");
    } catch (err) {
      toast.error(err.message ?? "Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddProjectDialog slug={slug} onSuccess={() => router.refresh()} />
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <ImageIcon size={32} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No projects yet. Add your first project to showcase your work.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item._id}>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-dark-text">{item.title}</p>
                    {item.projectType && (
                      <p className="text-xs text-muted-foreground">
                        {item.projectType}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.completedAt && (
                  <p className="text-xs text-muted-foreground">
                    Completed{" "}
                    {new Date(item.completedAt).toLocaleDateString("en-IE", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
