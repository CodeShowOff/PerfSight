import { memo } from 'react';

const BaselineCard = memo(({ baseline }) => {
  const hasBaseline = baseline?.avgLatency != null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Baseline</h3>
      </div>
      {hasBaseline ? (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Baseline Avg Latency</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-indigo-700">
                {baseline.avgLatency.toFixed(2)}
              </span>
              <span className="text-lg text-indigo-600">ms</span>
            </div>
          </div>
          {baseline.p95Latency != null && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Baseline P95 Latency</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-purple-700">
                  {baseline.p95Latency.toFixed(2)}
                </span>
                <span className="text-lg text-purple-600">ms</span>
              </div>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Git-tracked baseline</span>
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">No baseline available</p>
          <p className="text-xs text-gray-500">Create a baseline in Git to track performance</p>
        </div>
      )}
    </div>
  );
});

BaselineCard.displayName = 'BaselineCard';

export default BaselineCard;
