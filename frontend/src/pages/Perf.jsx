import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useScrollToTop from '../hooks/useScrollToTop';
import useSystemHealth from '../hooks/api/useSystemHealth';
import useServiceOverview from '../hooks/api/useServiceOverview';
import LoadingState from '../components/dashboard/LoadingState';
import ErrorState from '../components/dashboard/ErrorState';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import PerfChart from '../components/perf/PerfChart';
import PerfMetricsCard from '../components/service/PerfMetricsCard';

const LAST_SERVICE_STORAGE_KEY = 'perfsight:lastPerfService';

const formatRatio = (value, digits = 3) => {
  if (!Number.isFinite(value)) {
    return '---';
  }
  return value.toFixed(digits);
};

const Perf = () => {
  useScrollToTop();

  const [searchParams, setSearchParams] = useSearchParams();
  const serviceFromQuery = useMemo(() => {
    const raw = searchParams.get('service');
    return raw ? String(raw).trim() : '';
  }, [searchParams]);

  const [selectedService, setSelectedService] = useState(() => {
    if (serviceFromQuery) {
      return serviceFromQuery;
    }

    try {
      return localStorage.getItem(LAST_SERVICE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const {
    data: systemHealth,
    loading: servicesLoading,
    error: servicesError,
  } = useSystemHealth();

  const services = useMemo(() => {
    const list = (systemHealth ?? [])
      .map((s) => s?.service)
      .filter(Boolean);

    return [...new Set(list)].sort((a, b) => String(a).localeCompare(String(b)));
  }, [systemHealth]);

  useEffect(() => {
    if (!serviceFromQuery) {
      return;
    }

    if (serviceFromQuery === selectedService) {
      return;
    }

    setSelectedService(serviceFromQuery);
  }, [serviceFromQuery, selectedService]);

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    try {
      localStorage.setItem(LAST_SERVICE_STORAGE_KEY, selectedService);
    } catch {
      // ignore storage failures
    }
  }, [selectedService]);

  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
  } = useServiceOverview(selectedService);

  const perf = overview?.perf ?? null;

  const derived = useMemo(() => {
    const cpuCycles = perf?.cpuCycles;
    const instructions = perf?.instructions;
    const cacheMisses = perf?.cacheMisses;

    const ipc =
      Number.isFinite(cpuCycles) && Number.isFinite(instructions) && cpuCycles > 0
        ? instructions / cpuCycles
        : null;

    const cpi =
      Number.isFinite(cpuCycles) && Number.isFinite(instructions) && instructions > 0
        ? cpuCycles / instructions
        : null;

    const mpki =
      Number.isFinite(cacheMisses) && Number.isFinite(instructions) && instructions > 0
        ? (cacheMisses * 1000) / instructions
        : null;

    return {
      ipc,
      cpi,
      mpki,
    };
  }, [perf]);

  const onSelectService = (service) => {
    const trimmed = String(service || '').trim();
    setSelectedService(trimmed);

    const next = new URLSearchParams(searchParams);
    if (trimmed) {
      next.set('service', trimmed);
    } else {
      next.delete('service');
    }
    setSearchParams(next, { replace: true });
  };

  if (servicesLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Perf Telemetry</h1>
              <p className="text-gray-600 mt-1">CPU cycles, cache misses, and instruction counts</p>
            </div>
          </div>
        </div>
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Perf Telemetry</h1>
            <p className="text-gray-600 mt-1">Low-level hardware counters ("perf") per service</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">What you’re looking at</h3>
            <p className="text-sm text-gray-700">
              This page visualizes <span className="font-semibold">CPU cycles</span>, <span className="font-semibold">cache misses</span>,
              and <span className="font-semibold">instruction counts</span> ingested via <code className="font-mono">POST /api/perf</code>.
              Use it to correlate hardware-level behavior with latency regressions.
            </p>
          </div>
        </div>
      </div>

      {/* Service Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <label htmlFor="service-select" className="block text-sm font-semibold text-gray-900 mb-3">
              Select Service
            </label>
            <div className="relative">
              <select
                id="service-select"
                value={services.includes(selectedService) ? selectedService : ''}
                onChange={(e) => onSelectService(e.target.value)}
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
              {services.length} {services.length === 1 ? 'service' : 'services'} discovered via analysis snapshots.
            </p>
          </div>

          <div className="flex-1 min-w-[240px]">
            <label htmlFor="service-manual" className="block text-sm font-semibold text-gray-900 mb-3">
              Or type a service name
            </label>
            <input
              id="service-manual"
              value={selectedService}
              onChange={(e) => onSelectService(e.target.value)}
              placeholder="e.g. api-gateway"
              className="block w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
            />
            <p className="mt-2 text-xs text-gray-500">
              Useful if the worker isn’t running yet or you only have perf data (no analysis snapshots).
            </p>
          </div>
        </div>

        {servicesError && (
          <div className="mt-5 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Couldn’t load service list:</span> {servicesError}. You can still type a service name.
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      {!selectedService ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a service to begin</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose a service above to view its perf counters over time.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedService}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Looking for latency + regressions too?{' '}
                <Link
                  to={`/service/${encodeURIComponent(selectedService)}`}
                  className="font-semibold text-gray-900 hover:text-primary-600 underline underline-offset-4"
                >
                  Open service details
                </Link>
              </p>
            </div>
          </div>

          {overviewError ? (
            <ErrorState message={overviewError} />
          ) : (
            <>
              {/* Latest snapshot + derived stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {overviewLoading ? (
                  <>
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </>
                ) : (
                  <>
                    <PerfMetricsCard perf={perf} />

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Derived</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">IPC</span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatRatio(derived.ipc)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Instructions per cycle</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">CPI</span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatRatio(derived.cpi)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Cycles per instruction</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">MPKI</span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatRatio(derived.mpki)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Cache misses per 1K instructions</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Notes</h3>
                      </div>

                      <div className="text-sm text-gray-700 space-y-2">
                        <p>
                          Perf data is optional. If you don’t see anything here, your service likely isn’t
                          sending <code className="font-mono">/api/perf</code> events yet.
                        </p>
                        <p>
                          For a chart to show up, make sure you have at least a few samples in the selected
                          time range.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Chart */}
              <div className="mb-8">
                <PerfChart service={selectedService} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Perf;
