import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../../api/axiosClient';

const useServiceOverview = (service) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const inFlightKeyRef = useRef(null);
  const inFlightRequestRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!service) {
      abortControllerRef.current?.abort();
      inFlightKeyRef.current = null;
      inFlightRequestRef.current = null;
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const requestKey = service;
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
        const response = await axiosClient.get(`/dashboard/overview/${service}`, {
          signal: controller.signal,
        });
        setData(response.data.data ?? null);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.response?.data?.message || 'Failed to fetch service overview');
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
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useServiceOverview;
