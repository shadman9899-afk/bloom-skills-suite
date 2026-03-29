import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus = ({ className = '' }: ConnectionStatusProps) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test connection by trying to get the current session
        const { error } = await supabase.auth.getSession();

        if (error) {
          console.error('Supabase connection error:', error);
          setIsConnected(false);
        } else {
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Failed to check Supabase connection:', err);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-muted-foreground">Checking connection...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
        {isConnected ? 'Connected to Supabase' : 'Disconnected from Supabase'}
      </span>
    </div>
  );
};