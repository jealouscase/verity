'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('🔄 ProtectedRoute Render:', { userExists: !!user, loading });

  useEffect(() => {
    console.log('🔄 ProtectedRoute auth check effect running');
    
    if (!loading && !user) {
      console.log('🚀 Not authenticated - redirecting to login');
      router.push('/login');
    } else if (!loading && user) {
      console.log('✅ Authenticated - allowing access');
    } else {
      console.log('⏳ Still loading authentication state');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    console.log('⏳ Rendering loading state in ProtectedRoute');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Only render children if user is authenticated
  console.log('🔄 ProtectedRoute decision:', user ? 'rendering children' : 'rendering null');
  return user ? children : null;
}