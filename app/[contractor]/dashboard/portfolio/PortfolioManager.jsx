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
import { addPortfolioItem } from "@/app/actions/Portfolio/addPortfolioItem";
import { deletePortfolioItem } from "@/app/actions/Portfolio/deletePortfolioItem";
import { Plus, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";

function AddProjectDialog({ slug, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    projectType: "",
    description: "",
    location: "",
    images: [],
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
      setForm({
        title: "",
        projectType: "",
        description: "",
        location: "",
        images: [],
        completedAt: "",
      });
      onSuccess();
    } catch (err) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`${buttonVariants({ size: "sm" })} w-full sm:w-auto`}
      >
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
            <Label>Images</Label>
            <CldUploadWidget
              uploadPreset="next_cloudinary"
              options={{ multiple: false, sources: ["local"] }}
              onSuccess={(result) => {
                if (result.event === "success") {
                  set("images", [...form.images, result.info.secure_url]);
                  toast.success("Image added");
                }
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => open()}
                  className="w-full justify-center"
                >
                  <Upload size={14} className="mr-1.5" />
                  {form.images.length > 0
                    ? `Add more (${form.images.length} uploaded)`
                    : "Upload images"}
                </Button>
              )}
            </CldUploadWidget>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {form.images.map((url, idx) => (
                  <div
                    key={url}
                    className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
                  >
                    <img
                      src={url}
                      alt={`Upload ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "images",
                          form.images.filter((u) => u !== url),
                        )
                      }
                      className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-destructive"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
      <div className="flex justify-stretch sm:justify-end">
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
