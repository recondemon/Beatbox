

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-card p-8 rounded-lg">
        <h2 className="text-1vw">Are you sure you want to delete this <span className="text-primary font-semibold text-1vw">{itemType}</span>?</h2>
        <div className="flex gap-4 justify-center mt-6">
          <button className="p-2 bg-primary rounded-lg w-[5vw] hover:bg-green-600" onClick={onConfirm}>Yes</button>
          <button className="p-2 bg-muted rounded-lg w-[5vw] hover:bg-red-500" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
