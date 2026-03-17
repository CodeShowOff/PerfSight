const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-9 bg-gray-200 rounded w-2/5 mb-4"></div>
      <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
    </div>
  );
};

export default CardSkeleton;
