import { memo } from 'react';

const SummaryCard = memo(({ analysis, hasCriticalRegression }) => {
  const avgLatency = analysis?.avgLatency;
  const p95Latency = analysis?.p95Latency;
  const requestCount = analysis?.requestCount;

  const cardStyles = hasCriticalRegression
    ? 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-xl shadow-lg p-6'
    : 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow';

  return (
    <div className={cardStyles}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            hasCriticalRegression ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'
          }`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {hasCriticalRegression ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              )}
            </svg>
          </div>
          <h3 className={`text-lg font-bold ${
            hasCriticalRegression ? 'text-red-900' : 'text-gray-900'
          }`}>
            Performance Summary
          </h3>
        </div>
        {hasCriticalRegression && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
            Alert
          </span>
        )}
      </div>
      <div className="space-y-4">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Avg Latency</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-700">
                {avgLatency?.toFixed(2) ?? 'N/A'}
              </span>
              <span className="text-sm text-blue-600 ml-1">ms</span>
            </div>
          </div>
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">P95 Latency</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-purple-700">
                {p95Latency?.toFixed(2) ?? 'N/A'}
              </span>
              <span className="text-sm text-purple-600 ml-1">ms</span>
            </div>
          </div>
        </div>
        <div className="p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Request Count</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-700">
                {requestCount?.toLocaleString() ?? 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;
