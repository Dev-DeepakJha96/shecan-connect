const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const variants = {
    primary:
      "bg-pink-600 hover:bg-pink-700 text-white",

    secondary:
      "border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white",
  };

  return (
    <button
      className={`px-6 py-3 rounded-full font-bold transition flex items-center justify-center ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;