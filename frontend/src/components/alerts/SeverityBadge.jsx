const SeverityBadge = ({ severity }) => {
  const getStyles = () => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${getStyles()}`}>
      {severity || 'Unknown'}
    </span>
  );
};

export default SeverityBadge;
