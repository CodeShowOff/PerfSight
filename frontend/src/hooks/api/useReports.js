import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../../api/axiosClient';

const useReports = (service) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const inFlightKeyRef = useRef(null);
  const inFlightRequestRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!service) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      inFlightKeyRef.current = null;
      inFlightRequestRef.current = null;
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    const requestKey = service;
    if (inFlightRequestRef.current && inFlightKeyRef.current === requestKey) {
      const hasActiveController = Boolean(
        abortControllerRef.current && !abortControllerRef.current.signal.aborted
      );

      if (hasActiveController) {
        return inFlightRequestRef.current;
      }

      inFlightKeyRef.current = null;
      inFlightRequestRef.current = null;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    inFlightKeyRef.current = requestKey;

    const request = (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/reports/${service}`, {
          signal: controller.signal,
        });
        setData(response.data.data ?? []);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.response?.data?.message || 'Failed to fetch reports');
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
  }, [service]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      inFlightKeyRef.current = null;
      inFlightRequestRef.current = null;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useReports;
