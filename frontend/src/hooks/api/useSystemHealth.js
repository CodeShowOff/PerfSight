import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../../api/axiosClient';

const useSystemHealth = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const inFlightRequestRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (inFlightRequestRef.current) {
      const hasActiveController = Boolean(
        abortControllerRef.current && !abortControllerRef.current.signal.aborted
      );

      if (hasActiveController) {
        return inFlightRequestRef.current;
      }

      inFlightRequestRef.current = null;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const request = (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get('/dashboard/system-health', {
          signal: controller.signal,
        });
        setData(response.data.data ?? []);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.response?.data?.message || 'Failed to fetch system health');
        }
      } finally {
        if (abortControllerRef.current === controller) {
          inFlightRequestRef.current = null;
          setLoading(false);
        }
      }
    })();

    inFlightRequestRef.current = request;
    return request;
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      inFlightRequestRef.current = null;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useSystemHealth;
