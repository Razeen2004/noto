import "./toast.css";

const ToastContainer = ({ toasts, onClose }: { toasts: any[], onClose: (id: number) => void }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => onClose(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
