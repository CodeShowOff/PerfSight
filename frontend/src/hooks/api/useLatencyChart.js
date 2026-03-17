import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../../api/axiosClient';

const useLatencyChart = (service, range) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const inFlightKeyRef = useRef(null);
  const inFlightRequestRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!service || !range) {
      abortControllerRef.current?.abort();
      inFlightKeyRef.current = null;
      inFlightRequestRef.current = null;
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    const requestKey = `${service}|${range}`;
    if (inFlightRequestRef.current && inFlightKeyRef.current === requestKey) {
      return inFlightRequestRef.current;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    inFlightKeyRef.current = requestKey;

    const request = (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/dashboard/latency-chart/${service}`, {
          params: { range },
          signal: controller.signal,
        });
        setData(response.data.data ?? []);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.response?.data?.message || 'Failed to fetch chart data');
        }
      } finally {
        if (abortControllerRef.current === controller) {
          inFlightKeyRef.current = null;
          inFlightRequestRef.current = null;
          setLoading(false);
        }
      }
    })();

    inFlightRequestRef.current = request;
    return request;
  }, [service, range]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useLatencyChart;
