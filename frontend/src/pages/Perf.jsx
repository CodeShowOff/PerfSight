import { useState } from 'react';
import useScrollToTop from '../hooks/useScrollToTop';

const Perf = () => {
  useScrollToTop();
  const [selectedMetric, setSelectedMetric] = useState('cpu-cycles');

  const metrics = [
    { id: 'cpu-cycles', name: 'CPU Cycles', icon: '🔄', color: 'blue', description: 'Total CPU cycles consumed' },
    { id: 'instructions', name: 'Instructions', icon: '⚡', color: 'yellow', description: 'Instructions executed' },
    { id: 'cache-references', name: 'Cache References', icon: '📦', color: 'green', description: 'Cache access operations' },
    { id: 'cache-misses', name: 'Cache Misses', icon: '❌', color: 'red', description: 'Cache miss events' },
    { id: 'branch-misses', name: 'Branch Misses', icon: '🔀', color: 'purple', description: 'Branch prediction failures' },
    { id: 'page-faults', name: 'Page Faults', icon: '📄', color: 'orange', description: 'Memory page faults' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Unix Perf Metrics</h1>
            <p className="text-gray-600 mt-1">Low-level hardware performance counters</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">About Unix Perf Metrics</h3>
            <p className="text-sm text-gray-700">
              Unix perf provides hardware-level performance counters including CPU cycles, cache behavior, 
              branch predictions, and memory operations. These low-level metrics help identify bottlenecks 
              at the hardware level.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => {
          const colorClasses = {
            blue: 'from-blue-50 to-blue-100 border-blue-200',
            yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
            green: 'from-green-50 to-green-100 border-green-200',
            red: 'from-red-50 to-red-100 border-red-200',
            purple: 'from-purple-50 to-purple-100 border-purple-200',
            orange: 'from-orange-50 to-orange-100 border-orange-200',
          };

          const iconColorClasses = {
            blue: 'bg-blue-500',
            yellow: 'bg-yellow-500',
            green: 'bg-green-500',
            red: 'bg-red-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
          };

          const isSelected = selectedMetric === metric.id;

          return (
            <div
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`bg-gradient-to-br ${colorClasses[metric.color]} rounded-xl shadow-sm p-6 border cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-offset-2 ring-primary-500 shadow-lg' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${iconColorClasses[metric.color]} rounded-lg flex items-center justify-center text-2xl`}>
                  {metric.icon}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{metric.name}</h3>
              <p className="text-sm text-gray-700 mb-3">{metric.description}</p>
              <div className="text-3xl font-bold text-gray-900">---</div>
              <p className="text-xs text-gray-600 mt-1">Data collection pending</p>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {metrics.find(m => m.id === selectedMetric)?.name} Over Time
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              1H
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors">
              24H
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              7D
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              30D
            </button>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Data Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Unix perf metrics visualization will be displayed here. Start collecting performance data 
              to see detailed charts and analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average IPC</p>
              <p className="text-2xl font-bold text-gray-900">---</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Instructions per cycle</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cache Hit Rate</p>
              <p className="text-2xl font-bold text-gray-900">---</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">L1/L2 cache efficiency</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Branch Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">---</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Branch prediction success</p>
        </div>
      </div>
    </div>
  );
};

export default Perf;
