import { memo } from 'react';
import SeverityBadge from '../alerts/SeverityBadge';

const RegressionList = memo(({ regressions }) => {
  const hasRegressions = regressions && regressions.length > 0;

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'warning':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'info':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      default:
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Regressions</h3>
          {hasRegressions && (
            <p className="text-sm text-gray-600">{regressions.length} {regressions.length === 1 ? 'issue' : 'issues'} detected</p>
          )}
        </div>
      </div>
      {hasRegressions ? (
        <div className="space-y-4">
          {regressions.map((regression, index) => (
            <div
              key={index}
              className={`border-2 rounded-xl p-5 ${getSeverityColor(regression.severity)} hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <SeverityBadge severity={regression.severity} />
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {new Date(regression.detectedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {regression.zScore != null && (
                  <div className="p-3 bg-white/60 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">Z-Score</p>
                    <p className="text-xl font-bold text-gray-900">{regression.zScore.toFixed(2)}</p>
                  </div>
                )}
                {regression.baselineDeviation != null && (
                  <div className="p-3 bg-white/60 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">Baseline Deviation</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(regression.baselineDeviation * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-1">All Clear!</p>
          <p className="text-gray-600">No performance regressions detected</p>
        </div>
      )}
    </div>
  );
});

RegressionList.displayName = 'RegressionList';

export default RegressionList;
