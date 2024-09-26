
const CreatePlaylistModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <button onClick={onClose} className="text-red-500 mb-4">Close</button>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
