import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = memo(({ serviceData }) => {
  const navigate = useNavigate();
  const service = serviceData?.service;
  const avgLatency = serviceData?.avgLatency ?? 0;
  const p95Latency = serviceData?.p95Latency ?? 0;

  const handleClick = useCallback(() => {
    navigate(`/service/${service}`);
  }, [navigate, service]);

  // Determine health status based on latency
  const getHealthStatus = () => {
    if (avgLatency < 50) return { status: 'excellent', color: 'green', label: 'Excellent' };
    if (avgLatency < 100) return { status: 'good', color: 'blue', label: 'Good' };
    if (avgLatency < 200) return { status: 'fair', color: 'yellow', label: 'Fair' };
    return { status: 'poor', color: 'red', label: 'Poor' };
  };

  const health = getHealthStatus();

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-primary-300 overflow-hidden"
    >
      {/* Header with status badge */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
              {service}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${health.color}-100 text-${health.color}-800`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-${health.color}-500 mr-1.5`}></span>
              {health.label}
            </span>
          </div>
          <div className="ml-3 flex-shrink-0">
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Avg Latency</span>
            </div>
            <span className="text-lg font-bold text-blue-700">
              {avgLatency.toFixed(2)}<span className="text-sm font-normal text-blue-600 ml-1">ms</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">P95 Latency</span>
            </div>
            <span className="text-lg font-bold text-purple-700">
              {p95Latency.toFixed(2)}<span className="text-sm font-normal text-purple-600 ml-1">ms</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 group-hover:bg-primary-50 transition-colors">
        <p className="text-xs text-gray-600 group-hover:text-primary-700 font-medium flex items-center">
          View detailed metrics
          <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </p>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
