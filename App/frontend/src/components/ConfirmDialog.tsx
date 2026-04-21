type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Bekrafta",
  cancelText = "Avbryt",
  confirmVariant = "warning",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  const confirmClassName =
    confirmVariant === "danger"
      ? "bg-linear-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
      : "bg-linear-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-linear-to-b from-white to-slate-50 shadow-2xl">
        <div className="border-b border-slate-200/70 px-6 py-4">
          <h2 className="text-xl font-bold bg-linear-to-r from-slate-900 to-sky-700 bg-clip-text text-transparent">{title}</h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm font-medium text-slate-600">{message}</p>
        </div>

        <div className="flex gap-3 border-t border-slate-200/70 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all ${confirmClassName}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}