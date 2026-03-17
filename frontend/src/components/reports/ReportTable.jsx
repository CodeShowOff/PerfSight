const ReportTable = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No reports available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Latency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                P95 Latency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Baseline Avg
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Baseline Dev
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regressions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(report.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  {report.avgLatency?.toFixed(2) ?? 'N/A'} ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                  {report.p95Latency?.toFixed(2) ?? 'N/A'} ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {report.baselineAvgLatency?.toFixed(2) ?? 'N/A'} ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {report.baselineDeviation != null ? (
                    <span
                      className={`font-semibold ${
                        report.baselineDeviation > 0.2
                          ? 'text-red-600'
                          : report.baselineDeviation > 0.1
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {(report.baselineDeviation * 100).toFixed(1)}%
                    </span>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {report.regressionCount > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {report.regressionCount}
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
