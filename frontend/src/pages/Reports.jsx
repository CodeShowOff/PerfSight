import { useState, useMemo } from 'react';
import useSystemHealth from '../hooks/api/useSystemHealth';
import useReports from '../hooks/api/useReports';
import useScrollToTop from '../hooks/useScrollToTop';
import ReportTable from '../components/reports/ReportTable';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import TableSkeleton from '../components/skeletons/TableSkeleton';
import ErrorState from '../components/dashboard/ErrorState';

const Reports = () => {
  useScrollToTop();
  const [selectedService, setSelectedService] = useState('');
  const { data: systemHealthData, loading: servicesLoading } = useSystemHealth();
  const { data: reports, loading, error } = useReports(selectedService);

  const services = useMemo(() => {
    return systemHealthData.map((s) => s.service);
  }, [systemHealthData]);

  if (servicesLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Performance Reports</h1>
              <p className="text-gray-600 mt-1">Detailed analysis and regression reports</p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <CardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Performance Reports</h1>
            <p className="text-gray-600 mt-1">Detailed analysis and regression reports</p>
          </div>
        </div>
      </div>

      {/* Service Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <label htmlFor="service-select" className="block text-sm font-semibold text-gray-900 mb-3">
          Select Service to View Reports
        </label>
        <div className="relative">
          <select
            id="service-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="block w-full px-4 py-3 pr-10 text-base border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
          >
            <option value="">-- Choose a service --</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {services.length} {services.length === 1 ? 'service' : 'services'} available
        </p>
      </div>

      {/* Content Area */}
      {!selectedService ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg
              className="w-10 h-10 text-gray-400"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Service</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose a service from the dropdown above to view its performance reports and regression analysis.
          </p>
        </div>
      ) : loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <div className="space-y-6">
          {/* Reports Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-blue-900">{reports?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Critical Issues</p>
                  <p className="text-3xl font-bold text-red-900">
                    {reports?.filter(r => r.severity === 'critical')?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Resolved</p>
                  <p className="text-3xl font-bold text-green-900">
                    {reports?.filter(r => r.status === 'resolved')?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Reports for {selectedService}</h2>
            </div>
            <ReportTable reports={reports} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
