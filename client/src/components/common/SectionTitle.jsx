const SectionTitle = ({
  title,
  highlight,
  subtitle,
}) => {
  return (
    <div className="text-center mb-14">
      <h2 className="text-4xl font-extrabold mb-4">
        {title}{" "}

        <span className="bg-gradient-to-r from-pink-600 to-orange-400 bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>

      {subtitle && (
        <p className="text-gray-500 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;