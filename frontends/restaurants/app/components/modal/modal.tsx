export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4
        transition-all duration-300
        ${open ? "opacity-100 bg-black/50" : "opacity-0 bg-black/0 pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transform transition-transform duration-300
          ${open ? "scale-100" : "scale-10"}`}
      >
        {children}
      </div>
    </div>
  );
}
