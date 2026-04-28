import { useState } from "react";
import { Plus } from "lucide-react";
import type { Tag } from "@task-app/shared";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskDialogProps {
  tags: Tag[];
}

export default function CreateTaskDialog({ tags }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <CreateTaskForm tags={tags} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
