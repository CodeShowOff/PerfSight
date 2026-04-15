import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import usePerfChart from '../../hooks/api/usePerfChart';
import ChartSkeleton from '../skeletons/ChartSkeleton';
import PerfRangeSelector from './PerfRangeSelector';

const PerfChart = ({ service }) => {
  const [range, setRange] = useState('1h');

  const timeParams = useMemo(() => {
    const endTime = new Date();
    const startTime = new Date();

    switch (range) {
      case '1h':
        startTime.setHours(endTime.getHours() - 1);
        break;
      case '6h':
        startTime.setHours(endTime.getHours() - 6);
        break;
      case '24h':
        startTime.setHours(endTime.getHours() - 24);
        break;
      default:
        startTime.setHours(endTime.getHours() - 1);
    }

    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  }, [range]);

  const { data: chartData, loading, error } = usePerfChart(
    service,
    range,
    timeParams.startTime,
    timeParams.endTime
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-2">
            {new Date(payload[0].payload.time).toLocaleString()}
          </p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              <span className="font-semibold">{entry.name}:</span>{' '}
              {entry.value?.toLocaleString() ?? 'N/A'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Unix Perf Metrics</h3>
        <PerfRangeSelector range={range} onRangeChange={setRange} />
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <p className="text-red-600">{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <p className="text-gray-500">No perf data available for this range</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTimestamp}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={formatNumber}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="cpuCycles"
              stroke="#111827"
              strokeWidth={2}
              dot={false}
              name="CPU Cycles"
            />
            <Line
              type="monotone"
              dataKey="cacheMisses"
              stroke="#4b5563"
              strokeWidth={2}
              dot={false}
              name="Cache Misses"
            />
            <Line
              type="monotone"
              dataKey="instructions"
              stroke="#9ca3af"
              strokeWidth={2}
              dot={false}
              name="Instructions"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PerfChart;
