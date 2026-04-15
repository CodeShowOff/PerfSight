import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import useLatencyChart from '../../hooks/api/useLatencyChart';
import ChartSkeleton from '../skeletons/ChartSkeleton';
import RangeSelector from './RangeSelector';

const LatencyChart = ({ service }) => {
  const [range, setRange] = useState('1h');
  const { data: chartData, loading, error } = useLatencyChart(service, range);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    if (range === '30d') {
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
      });
    }

    if (range === '7d') {
      return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
      });
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-2">
            {new Date(payload[0].payload.windowEnd).toLocaleString()}
          </p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              <span className="font-semibold">{entry.name}:</span> {entry.value.toFixed(2)} ms
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
        <h3 className="text-lg font-semibold text-gray-800">Latency Trend</h3>
        <RangeSelector range={range} onRangeChange={setRange} />
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <p className="text-red-600">{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <p className="text-gray-500">No data available for this range</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="windowEnd"
              tickFormatter={formatTimestamp}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="avgLatency"
              stroke="#374151"
              strokeWidth={2}
              dot={false}
              name="Avg Latency"
            />
            <Line
              type="monotone"
              dataKey="p95Latency"
              stroke="#6b7280"
              strokeWidth={2}
              dot={false}
              name="P95 Latency"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LatencyChart;
