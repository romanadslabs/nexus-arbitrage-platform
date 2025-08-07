'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { BrowserProfile } from '@/types/browserProfiles';

// Контекст
interface MultiBrowserContextType {
  profiles: BrowserProfile[];
  isLoading: boolean;
  error: string | null;
  selectedProfileId: string | null;
  setSelectedProfileId: (id: string | null) => void;
  getProfileById: (id: string) => BrowserProfile | undefined;
  refreshProfiles: () => void;
}

const MultiBrowserContext = createContext<MultiBrowserContextType | undefined>(undefined);

// Провайдер
interface MultiBrowserProviderProps {
  children: ReactNode;
}

export function MultiBrowserProvider({ children }: MultiBrowserProviderProps) {
  const [profiles, setProfiles] = useState<BrowserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/browser-profiles');
      if (!response.ok) {
        throw new Error('Failed to fetch browser profiles');
      }
      const data = await response.json();
      setProfiles(data.profiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const getProfileById = (id: string) => profiles.find(p => p.id === id);

  const value = {
    profiles,
    isLoading,
    error,
    selectedProfileId,
    setSelectedProfileId,
    getProfileById,
    refreshProfiles: fetchProfiles,
  };

  return (
    <MultiBrowserContext.Provider value={value}>
      {children}
    </MultiBrowserContext.Provider>
  );
}

// Хук
export function useMultiBrowser() {
  const context = useContext(MultiBrowserContext);
  if (context === undefined) {
    throw new Error('useMultiBrowser must be used within a MultiBrowserProvider');
  }
  return context;
} 