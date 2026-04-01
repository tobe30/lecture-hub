import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClasses, updateClass } from "../lib/api";
import toast from "react-hot-toast";

export default function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["class"],
    queryFn: getClasses,
  });

  const classes = data?.classes || [];
  const selectedClass = classes.find((cls) => cls._id === id);

  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    description: "",
    schedule: "",
    capacity: "",
  });

  useEffect(() => {
    if (selectedClass) {
      setFormData({
        title: selectedClass.title || "",
        courseCode: selectedClass.courseCode || "",
        description: selectedClass.description || "",
        schedule: selectedClass.schedule || "",
        capacity: selectedClass.capacity || "",
      });
    }
  }, [selectedClass]);

  const { mutate: updateClassMutation, isPending } = useMutation({
    mutationFn: updateClass,
    onSuccess: () => {
      toast.success("Class updated successfully");
      queryClient.invalidateQueries({ queryKey: ["class"] });
      navigate("/dashboard/classes");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update class"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    updateClassMutation({
      id,
      classData: {
        ...formData,
        capacity: Number(formData.capacity),
      },
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link to="/dashboard/classes" className="mb-6 inline-block text-blue-500">
        Back
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Edit Class</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Title"
          className="w-full rounded-lg border border-gray-200 p-3"
        />

        <input
          type="text"
          value={formData.courseCode}
          onChange={(e) =>
            setFormData({ ...formData, courseCode: e.target.value })
          }
          placeholder="Course Code"
          className="w-full rounded-lg border border-gray-200 p-3"
        />

        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
          className="w-full rounded-lg border border-gray-200 p-3"
        />

        <input
          type="text"
          value={formData.schedule}
          onChange={(e) =>
            setFormData({ ...formData, schedule: e.target.value })
          }
          placeholder="Schedule"
          className="w-full rounded-lg border border-gray-200 p-3"
        />

        <input
          type="number"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({ ...formData, capacity: e.target.value })
          }
          placeholder="Capacity"
          className="w-full rounded-lg border border-gray-200 p-3"
        />

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-500 px-5 py-3 text-white"
        >
          {isPending ? "Updating..." : "Update Class"}
        </button>
      </form>
    </div>
  );
}