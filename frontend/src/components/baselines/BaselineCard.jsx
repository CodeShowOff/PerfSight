import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const BaselineCard = ({ service }) => {
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBaseline = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/baselines/${service}`);
        setBaseline(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch baseline');
      } finally {
        setLoading(false);
      }
    };

    fetchBaseline();
  }, [service]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{service}</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!baseline) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{service}</h3>
            <p className="text-sm text-gray-500">No baseline data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-300 overflow-hidden group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {baseline.service}
            </h3>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Tracked
          </span>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Average Latency</span>
              <span className="text-2xl font-bold text-blue-700">
                {baseline.avgLatency?.toFixed(2) ?? 'N/A'}
                <span className="text-sm font-normal text-blue-600 ml-1">ms</span>
              </span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">P95 Latency</span>
              <span className="text-2xl font-bold text-purple-700">
                {baseline.p95Latency?.toFixed(2) ?? 'N/A'}
                <span className="text-sm font-normal text-purple-600 ml-1">ms</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 group-hover:bg-primary-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 group-hover:text-primary-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Updated {new Date(baseline.updatedAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaselineCard;
