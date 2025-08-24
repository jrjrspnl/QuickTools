export const Button = ({ onClick, text, icon: Icon, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-white cursor-pointer bg-violet-400 py-2 px-5 flex items-center gap-2 rounded-full shadow-md hover:bg-violet-500 transition-colors duration-300"
    >
      {Icon && <Icon size={20} />}
      {text}
    </button>
  );
};
