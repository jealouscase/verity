'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { updateUserProfile } from '@/services/userService';

export default function EditProfilePage() {
    const { user, profile, refreshProfile, updateDisplayInfo, onboardingCompleted } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        description: '',
        profilePicture: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Redirect to onboarding if not completed
    useEffect(() => {
        if (user && onboardingCompleted === false) {
            router.push('/onboarding');
        }
    }, [user, onboardingCompleted, router]);

    // Load user data into the form
    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                description: profile.description || '',
                profilePicture: profile.profilePicture || ''
            });
        }
    }, [profile]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }

        // Clear success message
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    // Validate form data
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        // Optional profile picture URL validation
        if (formData.profilePicture && !isValidUrl(formData.profilePicture)) {
            newErrors.profilePicture = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if a string is a valid URL
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // Create updated profile data
            const profileData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                description: formData.description,
                profilePicture: formData.profilePicture || null,
                displayName: `${formData.firstName} ${formData.lastName}`
            };

            // Save to Firestore
            await updateUserProfile(user.uid, profileData);

            // Update Auth profile
            await updateDisplayInfo(
                profileData.displayName,
                profileData.profilePicture
            );

            // Refresh profile data in context
            await refreshProfile();

            setSuccessMessage('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors(prev => ({
                ...prev,
                form: 'Failed to update profile. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F6F5F5]">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white p-8 rounded-[16px] shadow-sm border border-black">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Edit Profile</h1>
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Back to Profile
                                </button>
                            </div>

                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                                    {successMessage}
                                </div>
                            )}

                            {errors.form && (
                                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                                    {errors.form}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-black'
                                                }`}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-black'
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Username (read-only) */}
                                <div className="mb-6">
                                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">@</span>
                                        <input
                                            type="text"
                                            id="username"
                                            value={profile?.username || ''}
                                            className="w-full pl-8 pr-4 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed border-black"
                                            readOnly
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Username cannot be changed
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-black'
                                            }`}
                                    ></textarea>
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Profile Picture URL */}
                                <div className="mb-8">
                                    <label htmlFor="profilePicture" className="block text-sm font-medium mb-1">
                                        Profile Picture URL (optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="profilePicture"
                                        name="profilePicture"
                                        value={formData.profilePicture}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.profilePicture ? 'border-red-500' : 'border-black'
                                            }`}
                                        placeholder="https://example.com/your-image.jpg"
                                    />
                                    {errors.profilePicture && (
                                        <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter a URL to an image you'd like to use as your profile picture
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/profile')}
                                        className="px-6 py-2 rounded-md border border-black bg-white text-black font-medium hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-6 py-2 rounded-md bg-black text-white font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
                                            }`}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}