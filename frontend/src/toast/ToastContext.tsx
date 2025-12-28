import { createContext, useContext, useState } from "react";
import ToastContainer from "./ToastContainer.tsx";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<any[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();

    setToasts((prev: any[]) => [...prev, { id, message, type }]);

    // auto remove after 3s
    setTimeout(() => {
      setToasts((prev: any) => prev.filter((t: any) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev: any) => prev.filter((t: any) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast } as any}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
};
