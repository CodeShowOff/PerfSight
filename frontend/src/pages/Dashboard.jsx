import { useMemo } from 'react';
import useSystemHealth from '../hooks/api/useSystemHealth';
import useScrollToTop from '../hooks/useScrollToTop';
import ServiceCard from '../components/dashboard/ServiceCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import ErrorState from '../components/dashboard/ErrorState';

const Dashboard = () => {
  useScrollToTop();
  const { data: services, loading, error } = useSystemHealth();

  // Calculate system-wide statistics
  const systemStats = useMemo(() => {
    if (!services || services.length === 0) {
      return {
        totalServices: 0,
        avgLatency: 0,
        maxLatency: 0,
        healthyServices: 0
      };
    }

    const avgLatency = services.reduce((sum, s) => sum + s.avgLatency, 0) / services.length;
    const maxLatency = Math.max(...services.map(s => s.p95Latency));
    const healthyServices = services.filter(s => s.avgLatency < 100).length;

    return {
      totalServices: services.length,
      avgLatency: avgLatency.toFixed(2),
      maxLatency: maxLatency.toFixed(2),
      healthyServices
    };
  }, [services]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Overview</h1>
          <p className="text-gray-600">Real-time performance monitoring across all services</p>
        </div>

        {/* Stats Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Services Loading */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Overview</h1>
          <p className="text-gray-600">Real-time performance monitoring across all services</p>
        </div>
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">System Overview</h1>
        <p className="text-gray-600">Real-time performance monitoring across all services</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Total Services</p>
              <p className="text-3xl font-bold text-blue-900">{systemStats.totalServices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">Avg Latency</p>
              <p className="text-3xl font-bold text-green-900">{systemStats.avgLatency}ms</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">Max P95 Latency</p>
              <p className="text-3xl font-bold text-purple-900">{systemStats.maxLatency}ms</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-sm p-6 border border-teal-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium mb-1">Healthy Services</p>
              <p className="text-3xl font-bold text-teal-900">
                {systemStats.healthyServices}/{systemStats.totalServices}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          <div className="text-sm text-gray-500">
            {services.length} {services.length === 1 ? 'service' : 'services'} monitored
          </div>
        </div>

        {services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Start monitoring your services to see performance metrics here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.service}
                serviceData={service}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
