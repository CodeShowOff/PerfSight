import { memo } from 'react';

const PerfMetricsCard = memo(({ perf }) => {
  const hasData = perf?.cpuCycles != null || perf?.cacheMisses != null || perf?.instructions != null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Perf Metrics</h3>
      </div>
      {hasData ? (
        <div className="space-y-3">
          <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">CPU Cycles</span>
              <span className="text-lg font-bold text-orange-700">
                {perf.cpuCycles?.toLocaleString() ?? 'N/A'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-r from-red-50 to-red-100/50 rounded-lg border border-red-200/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Cache Misses</span>
              <span className="text-lg font-bold text-red-700">
                {perf.cacheMisses?.toLocaleString() ?? 'N/A'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-lg border border-teal-200/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Instructions</span>
              <span className="text-lg font-bold text-teal-700">
                {perf.instructions?.toLocaleString() ?? 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">No perf data</p>
          <p className="text-xs text-gray-500">Perf metrics will appear here when available</p>
        </div>
      )}
    </div>
  );
});

PerfMetricsCard.displayName = 'PerfMetricsCard';

export default PerfMetricsCard;
