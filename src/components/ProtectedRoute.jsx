import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentSession } from '../services/supabaseService';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    async function checkSession() {
      try {
        const currentSession = await getCurrentSession();
        setSession(currentSession);
      } catch (error) {
        console.error('Failed to check session:', error);
        setSession(null);
      }
    }

    checkSession();
  }, []);

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}