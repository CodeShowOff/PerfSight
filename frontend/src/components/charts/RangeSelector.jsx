const RangeSelector = ({ range, onRangeChange }) => {
  const ranges = ['1h', '6h', '24h'];

  return (
    <div className="flex gap-2">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onRangeChange(r)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            range === r
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
};

export default RangeSelector;
