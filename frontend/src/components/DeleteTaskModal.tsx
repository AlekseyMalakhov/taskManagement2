type Props = {
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export default function DeleteTaskModal({ onCancel, onConfirm, isDeleting }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Delete task?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This action cannot be undone. The task will be permanently deleted.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
