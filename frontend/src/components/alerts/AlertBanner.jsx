const AlertBanner = ({ regressions }) => {
  if (!regressions || regressions.length === 0) {
    return null;
  }

  const hasCritical = regressions.some((r) => r.severity?.toLowerCase() === 'critical');
  const hasWarning = regressions.some((r) => r.severity?.toLowerCase() === 'warning');

  if (!hasCritical && !hasWarning) {
    return null;
  }

  const bannerStyles = hasCritical
    ? 'bg-red-50 border-red-400 text-red-800'
    : 'bg-yellow-50 border-yellow-400 text-yellow-800';

  const icon = hasCritical ? (
    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ) : (
    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );

  const message = hasCritical
    ? 'Critical performance regression detected'
    : 'Performance regression warning';

  return (
    <div className={`border-l-4 rounded-lg p-4 mb-6 ${bannerStyles}`}>
      <div className="flex items-center">
        {icon}
        <div className="ml-3">
          <p className="text-sm font-semibold">{message}</p>
          <p className="text-xs mt-1">
            {regressions.length} regression{regressions.length > 1 ? 's' : ''} detected
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
