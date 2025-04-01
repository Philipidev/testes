import { useState, useEffect } from 'react';
import { ODataMetadata } from '../types/odataTypes';
import { fetchODataMetadata } from '../services/odataService';

/**
 * Hook para carregar e gerenciar os metadados OData
 */
export function useODataMetadata() {
  const [metadata, setMetadata] = useState<ODataMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        const data = await fetchODataMetadata();
        setMetadata(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar metadados OData. Verifique a conexão e tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  return { metadata, loading, error };
} 