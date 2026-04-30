import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Tag, Task } from "@task-app/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditTaskForm from "../TaskForm/EditTaskForm";
import DeleteTaskModal from "./DeleteTaskModal";
import { useDeleteTaskMutation } from "@/store/api";
import { useNavigate } from "react-router-dom";

type Props = {
  task: Task;
  tags: Tag[];
  id: string;
};

export default function TaskDetailsFooter({ task, tags, id }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const [deleteTask, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteTaskMutation();

  async function handleDelete() {
    const result = await deleteTask(id);
    if (!("error" in result)) navigate("/");
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowEditModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm font-medium hover:bg-secondary transition-colors"
        >
          <Pencil className="size-3.5" />
          Edit
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-destructive px-3 py-1 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <Trash2 className="size-3.5" />
          Delete
        </button>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <EditTaskForm
            task={task}
            tags={tags}
            onSuccess={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>

      {showDeleteModal && (
        <DeleteTaskModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          isError={isDeleteError}
        />
      )}
    </>
  );
}
