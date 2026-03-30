import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  duration: string | null;
  level: string | null;
  total_modules: number;
  image_url: string | null;
  thumbnail_url: string | null;
  price: number | null;
  is_published: boolean;
  instructor_name: string | null;
  created_at: string;
  updated_at: string;
}

interface CourseForm {
  id?: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  total_modules: number;
  image_url: string;
  thumbnail_url: string;
  price: number;
  is_published: boolean;
  instructor_name: string;
}

const defaultCourseForm: CourseForm = {
  title: "",
  description: "",
  category: "",
  duration: "",
  level: "",
  total_modules: 1,
  image_url: "",
  thumbnail_url: "",
  price: 0,
  is_published: true,
  instructor_name: "",
};

const AdminCourses = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CourseForm>(defaultCourseForm);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load courses", error);
        toast.error("Could not fetch courses");
        setCourses([]);
      } else {
        setCourses((data as CourseRow[]) ?? []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error loading courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchCourses();
  }, [fetchCourses, isAdmin]);

  const resetForm = () => {
    setForm(defaultCourseForm);
    setIsEditing(false);
  };

  const handleSelectCourse = (course: CourseRow) => {
    setForm({
      id: course.id,
      title: course.title,
      description: course.description ?? "",
      category: course.category ?? "",
      duration: course.duration ?? "",
      level: course.level ?? "",
      total_modules: course.total_modules ?? 1,
      image_url: course.image_url ?? "",
      thumbnail_url: course.thumbnail_url ?? "",
      price: course.price ?? 0,
      is_published: course.is_published ?? false,
      instructor_name: course.instructor_name ?? "",
    });
    setIsEditing(true);
  };

  const uploadImageToCloudinary = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables are not configured");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloudinary upload failed: ${text}`);
    }

    const result = await response.json();
    return result;
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImageToCloudinary(file);
      setForm((prev) => ({
        ...prev,
        image_url: result.secure_url || "",
        thumbnail_url: result.secure_url || "",
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveCourse = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.category.trim()) {
      toast.error("Title and Category are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      duration: form.duration.trim() || null,
      level: form.level.trim() || null,
      total_modules: Number(form.total_modules) || 1,
      image_url: form.image_url || null,
      thumbnail_url: form.thumbnail_url || null,
      price: Number(form.price) || 0,
      is_published: form.is_published,
      instructor_name: form.instructor_name.trim() || null,
    };

    setSaving(true);

    try {
      if (isEditing && form.id) {
        const { error } = await supabase
          .from("courses")
          .update(payload)
          .eq("id", form.id);

        if (error) {
          throw error;
        }

        toast.success("Course updated successfully");
      } else {
        const { error } = await supabase.from("courses").insert([payload]);

        if (error) {
          throw error;
        }

        toast.success("Course created successfully");
      }

      resetForm();
      await fetchCourses();
    } catch (err) {
      console.error("Could not save course", err);
      toast.error("Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("Course deleted successfully");
      if (form.id === id) resetForm();
      await fetchCourses();
    } catch (err) {
      console.error("Could not delete course", err);
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const courseCount = useMemo(() => courses.length, [courses]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <h1 className="text-2xl font-bold text-red-600">Admin access required</h1>
          <p className="mt-2 text-muted-foreground">You must be an administrator to manage courses.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Admin Courses</h1>
          <p className="text-sm text-muted-foreground">Manage course library: create, edit, delete, and upload images.</p>
          <div className="text-sm">
            total courses: <span className="font-semibold">{courseCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <section className="xl:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Catalog</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loading ? (
                  <p>Loading courses…</p>
                ) : courses.length === 0 ? (
                  <p>No course found. Add your first course.</p>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="px-2 py-2">Title</th>
                        <th className="px-2 py-2">Category</th>
                        <th className="px-2 py-2">Price</th>
                        <th className="px-2 py-2">Published</th>
                        <th className="px-2 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="odd:bg-white even:bg-slate-50">
                          <td className="px-2 py-2">{course.title}</td>
                          <td className="px-2 py-2">{course.category}</td>
                          <td className="px-2 py-2">${course.price?.toFixed(2) ?? "0.00"}</td>
                          <td className="px-2 py-2">{course.is_published ? "Yes" : "No"}</td>
                          <td className="px-2 py-2 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleSelectCourse(course)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteCourse(course.id)}
                              disabled={deletingId === course.id}
                            >
                              {deletingId === course.id ? "Deleting..." : "Delete"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Edit Course" : "New Course"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveCourse} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Instructor</label>
                    <Input
                      value={form.instructor_name}
                      onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration</label>
                      <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Level</label>
                      <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Total Modules</label>
                      <Input
                        type="number"
                        min={1}
                        value={form.total_modules}
                        onChange={(e) =>
                          setForm({ ...form, total_modules: Number(e.target.value) || 1 })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (USD)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Image (Cloudinary)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    {form.image_url && (
                      <img src={form.image_url} alt="course" className="mt-2 h-32 w-full object-cover rounded-md" />
                    )}
                    {uploading && <p className="text-xs text-muted-foreground">Uploading image...</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.is_published}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, is_published: Boolean(checked) }))
                      }
                    />
                    <span className="text-sm">Published</span>
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminCourses;
