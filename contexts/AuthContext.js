'use client';
// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  getUserProfile, 
  hasCompletedOnboarding 
} from '@/services/userService';
import { setCookie, deleteCookie } from 'cookies-next';

// Create auth context
const AuthContext = createContext({});

// Auth context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  // Load user profile when auth state changes
  const loadUserProfile = async (user) => {
    console.log('🔄 Loading user profile for:', user.uid);
    
    if (!user) {
      console.log('❌ No user provided to loadUserProfile');
      setProfile(null);
      setOnboardingCompleted(null);
      return;
    }

    try {
      console.log('📡 Fetching user profile from Firestore...');
      const userProfile = await getUserProfile(user.uid);
      console.log('✅ User profile loaded:', userProfile ? 'found' : 'not found');
      setProfile(userProfile);
      
      // Check if onboarding is completed
      console.log('🔍 Checking onboarding status...');
      const completed = await hasCompletedOnboarding(user.uid);
      console.log('✅ Onboarding status:', completed ? 'completed' : 'not completed');
      setOnboardingCompleted(completed);
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      setProfile(null);
      setOnboardingCompleted(false); // Assume onboarding not completed on error
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔔 Auth state changed:', user ? 'user logged in' : 'no user');
      
      if (user) {
        console.log('👤 User authenticated:', user.uid);
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        
        // Set cookie for middleware
        setCookie('authenticated', 'true', {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });
        
        await loadUserProfile(user);
      } else {
        console.log('🚫 No authenticated user');
        setUser(null);
        setProfile(null);
        setOnboardingCompleted(null);
        
        // Remove cookie
        deleteCookie('authenticated', { path: '/' });
      }
      
      console.log('✅ Auth loading complete');
      setLoading(false);
    });

    return () => {
      console.log('🧹 Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Refresh profile data
  const refreshProfile = async () => {
    console.log('🔄 Refreshing profile data...');
    if (user) {
      await loadUserProfile(user);
    } else {
      console.log('❌ Cannot refresh profile: No authenticated user');
    }
  };

  // Sign up
  const signup = (email, password) => {
    console.log('🔐 Signing up new user:', email);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const login = (email, password) => {
    console.log('🔑 Logging in user:', email);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setProfile(null);
    deleteCookie('authenticated', { path: '/' });
    await signOut(auth);
  };

  // Update Auth Profile
  const updateDisplayInfo = async (displayName, photoURL) => {
    if (!auth.currentUser) {
      console.log('❌ Cannot update display info: No authenticated user');
      return;
    }
    
    console.log('✏️ Updating display info:', { displayName, photoURL: photoURL ? 'provided' : 'not provided' });
    
    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (photoURL) updates.photoURL = photoURL;
    
    await updateAuthProfile(auth.currentUser, updates);
    
    // Update local state
    console.log('✅ Display info updated');
    setUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  console.log('🔄 Auth Context State:', { 
    userExists: !!user, 
    profileExists: !!profile, 
    loading, 
    onboardingCompleted 
  });

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      onboardingCompleted,
      signup, 
      login, 
      logout, 
      refreshProfile,
      updateDisplayInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);