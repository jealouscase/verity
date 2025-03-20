'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
    const { user, profile, loading, onboardingCompleted } = useAuth();
    const router = useRouter();

    console.log('🔄 Profile Page Render:', {
        userExists: !!user,
        profileExists: !!profile,
        loading,
        onboardingCompleted
    });

    // Redirect to onboarding if not completed
    useEffect(() => {
        console.log('🔄 Profile onboarding check effect running');

        if (user && onboardingCompleted === false) {
            console.log('🚀 Redirecting to onboarding');
            router.push('/onboarding');
        } else {
            console.log('✅ No redirection needed:', {
                userExists: !!user,
                onboardingCompleted
            });
        }
    }, [user, onboardingCompleted, router]);

    // Default profile picture
    const defaultProfilePic = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';

    // Add a debugging button
    const debugAuth = () => {
        console.log('🔍 DEBUG AUTH STATE:', {
            user,
            profile,
            loading,
            onboardingCompleted
        });
    };

    // Force refresh profile
    const forceRefresh = () => {
        window.location.reload();
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F6F5F5] px-4">
                <div className="container mx-auto py-12">
                    {/* Debug Panel */}
                    <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
                        <h3 className="font-bold mb-2">Debug Panel</h3>
                        <p>Auth State: {loading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}</p>
                        <p>Profile: {profile ? 'Loaded' : 'Not Loaded'}</p>
                        <p>Onboarding: {onboardingCompleted === null ? 'Unknown' : onboardingCompleted ? 'Completed' : 'Not Completed'}</p>
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={debugAuth}
                                className="px-3 py-1 bg-blue-500 text-white rounded"
                            >
                                Log Auth State
                            </button>
                            <button
                                onClick={forceRefresh}
                                className="px-3 py-1 bg-green-500 text-white rounded"
                            >
                                Force Refresh
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
                            <p>Loading authentication state...</p>
                        </div>
                    ) : !user ? (
                        <div className="flex flex-col items-center justify-center h-40">
                            <p className="text-red-500 mb-4">Not authenticated!</p>
                            <button
                                onClick={() => router.push('/login')}
                                className="px-4 py-2 bg-black text-white rounded"
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : !profile ? (
                        <div className="flex flex-col items-center justify-center h-40">
                            <p className="mb-4">Profile not loaded. You may need to complete onboarding.</p>
                            <button
                                onClick={() => router.push('/onboarding')}
                                className="px-4 py-2 bg-black text-white rounded"
                            >
                                Go to Onboarding
                            </button>
                        </div>
                    ) : (
                        <div className="max-w-4xl">
                            {/* Profile Header */}
                            <div className="mb-12">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
                                    {/* Profile Picture */}
                                    <div className="flex-shrink-0">
                                        <div className="w-40 h-40 rounded-full overflow-hidden bg-[#A15555] relative">
                                            {profile.profilePicture ? (
                                                <Image
                                                    src={profile.profilePicture}
                                                    alt={`${profile.firstName} ${profile.lastName}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="160px"
                                                    onError={(e) => {
                                                        e.target.src = defaultProfilePic;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-white text-4xl font-bold">
                                                        {profile.firstName.charAt(0)}
                                                        {profile.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="flex-grow text-center md:text-left">
                                        <h1 className="text-4xl font-bold mb-2">
                                            {profile.firstName} {profile.lastName}
                                        </h1>
                                        <h2 className="text-xl text-gray-700 mb-4">
                                            @{profile.username}
                                        </h2>
                                        <div className="mb-6">
                                            <p className="text-lg">
                                                {profile.description || 'No description provided.'}
                                            </p>
                                        </div>

                                        {/* Edit Profile Button */}
                                        <button
                                            onClick={() => router.push('/profile/edit')}
                                            className="px-4 py-2 bg-white border border-black rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Scraps Section - Placeholder for future implementation */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* This will be populated with user's scraps in the future */}
                                <div className="aspect-square bg-white rounded-[16px] border border-black flex items-center justify-center">
                                    <p className="text-gray-400">Your scraps will appear here</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}