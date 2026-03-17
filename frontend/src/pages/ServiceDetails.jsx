import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useServiceOverview from '../hooks/api/useServiceOverview';
import useScrollToTop from '../hooks/useScrollToTop';
import SummaryCard from '../components/service/SummaryCard';
import BaselineCard from '../components/service/BaselineCard';
import PerfMetricsCard from '../components/service/PerfMetricsCard';
import RegressionList from '../components/service/RegressionList';
import LatencyChart from '../components/charts/LatencyChart';
import PerfChart from '../components/perf/PerfChart';
import AlertBanner from '../components/alerts/AlertBanner';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import ChartSkeleton from '../components/skeletons/ChartSkeleton';
import ErrorState from '../components/dashboard/ErrorState';

const ServiceDetails = () => {
  useScrollToTop();
  const { service } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useServiceOverview(service);

  const regressions = useMemo(() => data?.regressions ?? [], [data?.regressions]);

  const criticalRegressions = useMemo(
    () => regressions.filter((r) => r.severity?.toLowerCase() === 'critical'),
    [regressions]
  );

  const warningRegressions = useMemo(
    () => regressions.filter((r) => r.severity?.toLowerCase() === 'warning'),
    [regressions]
  );

  const infoRegressions = useMemo(
    () => regressions.filter((r) => r.severity?.toLowerCase() === 'info'),
    [regressions]
  );

  const orderedRegressions = useMemo(
    () => [...criticalRegressions, ...warningRegressions, ...infoRegressions],
    [criticalRegressions, warningRegressions, infoRegressions]
  );

  const hasCriticalRegression = useMemo(() => {
    return criticalRegressions.length > 0;
  }, [criticalRegressions]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{service}</h1>
              <p className="text-gray-600 mt-1">Service performance analytics</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        <div className="mb-8">
          <ChartSkeleton />
        </div>

        <div className="mb-8">
          <ChartSkeleton />
        </div>

        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{service}</h1>
            <p className="text-gray-600 mt-1">Service performance analytics</p>
          </div>
        </div>
      </div>
      
      {/* Alert Banner */}
      <AlertBanner regressions={orderedRegressions} />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          analysis={data?.analysis}
          hasCriticalRegression={hasCriticalRegression}
        />
        <BaselineCard baseline={data?.baseline} />
        <PerfMetricsCard perf={data?.perf} />
      </div>

      {/* Latency Chart */}
      <div className="mb-8">
        <LatencyChart service={service} />
      </div>

      {/* Perf Chart */}
      <div className="mb-8">
        <PerfChart service={service} />
      </div>

      {/* Regressions */}
      <RegressionList regressions={orderedRegressions} />
    </div>
  );
};

export default ServiceDetails;
