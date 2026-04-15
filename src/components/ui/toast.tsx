"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "@/store/toast-store";

const icons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle
};

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type ?? "success"];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/80 px-4 py-3 text-sm text-white shadow-soft backdrop-blur-xl"
            >
              <Icon className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{toast.message}</span>
              <button type="button" onClick={() => removeToast(toast.id)} className="ml-2 text-white/50 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
