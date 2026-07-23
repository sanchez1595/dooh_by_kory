"use client";

import { useApp } from "@/context/app-context";

export function Toast() {
  const { toast, toastUndoAction } = useToastState();

  if (!toast) return null;

  return (
    <div className="fixed right-6 bottom-[78px] z-[110] flex max-w-[380px] items-center gap-3.5 rounded-xl bg-[#0D0D0D] px-4 py-[13px] text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#A6FF4D"
        className="h-4 w-4 shrink-0"
        strokeWidth={2.4}
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span className="text-[12.5px] leading-[1.4] font-medium">{toast.msg}</span>
      {toast.undo && (
        <button
          onClick={toastUndoAction}
          className="shrink-0 cursor-pointer text-xs font-bold text-[#B794FF] hover:text-white"
        >
          Deshacer
        </button>
      )}
    </div>
  );
}

function useToastState() {
  const app = useApp();
  return {
    toast: app.toast,
    toastUndoAction: () => {
      app.toast?.undo?.();
      app.hideToast();
    },
  };
}
