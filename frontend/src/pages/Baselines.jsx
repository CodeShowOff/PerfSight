import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import useScrollToTop from '../hooks/useScrollToTop';
import BaselineList from '../components/baselines/BaselineList';
import LoadingState from '../components/dashboard/LoadingState';
import ErrorState from '../components/dashboard/ErrorState';

const Baselines = () => {
  useScrollToTop();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBaselines = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get('/baselines');
        setServices(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch baselines');
      } finally {
        setLoading(false);
      }
    };

    fetchBaselines();
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Baselines</h1>
              <p className="text-gray-600 mt-1">Performance benchmarks stored in the database</p>
            </div>
          </div>
        </div>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Baselines</h1>
              <p className="text-gray-600 mt-1">Performance benchmarks stored in the database</p>
            </div>
          </div>
        </div>
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Baselines</h1>
            <p className="text-gray-600 mt-1">Performance benchmarks stored in the database</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">About Baselines</h3>
            <p className="text-sm text-gray-700">
              Baselines are stored in the database and provide reference points for comparing current
              performance metrics and detecting regressions over time.
            </p>
          </div>
        </div>
      </div>

      {/* Baselines Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Service Baselines</h2>
          <div className="text-sm text-gray-500">
            {services.length} {services.length === 1 ? 'baseline' : 'baselines'} tracked
          </div>
        </div>
        <BaselineList services={services} />
      </div>
    </div>
  );
};

export default Baselines;
