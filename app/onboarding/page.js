'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createUserProfile, isUsernameAvailable } from '@/services/userService';

export default function Onboarding() {
    const { user, onboardingCompleted, refreshProfile, updateDisplayInfo } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        description: '',
        profilePicture: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameDebounce, setUsernameDebounce] = useState(null);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    // Check if user is logged in and redirect if onboarding is already completed
    useEffect(() => {
        if (onboardingCompleted === true) {
            router.push('/profile');
        }
    }, [onboardingCompleted, router]);

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

        // Check username availability with debounce
        if (name === 'username' && value.length >= 3) {
            clearTimeout(usernameDebounce);
            setUsernameAvailable(null);

            const timer = setTimeout(async () => {
                const available = await isUsernameAvailable(value);
                setUsernameAvailable(available);
            }, 500);

            setUsernameDebounce(timer);
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

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        } else if (usernameAvailable === false) {
            newErrors.username = 'Username is already taken';
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

            // Create profile data
            const profileData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username.toLowerCase(),
                description: formData.description,
                profilePicture: formData.profilePicture || null,
                displayName: `${formData.firstName} ${formData.lastName}`
            };

            // Save to Firestore
            await createUserProfile(user.uid, profileData);

            // Update Auth profile
            await updateDisplayInfo(
                profileData.displayName,
                profileData.profilePicture
            );

            // Refresh profile data in context
            await refreshProfile();

            // Redirect to profile page
            router.push('/profile');

        } catch (error) {
            console.error('Error during onboarding:', error);
            setErrors(prev => ({
                ...prev,
                form: 'Failed to complete onboarding. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const getUsernameHelperText = () => {
        if (formData.username.length < 3) return 'Username must be at least 3 characters';
        if (usernameAvailable === true) return 'Username is available!';
        if (usernameAvailable === false) return 'Username is already taken';
        return 'Checking availability...';
    };

    const getUsernameColor = () => {
        if (usernameAvailable === true) return 'text-green-600';
        if (usernameAvailable === false) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="bg-white p-8 rounded-[16px] shadow-sm border border-black">
                    <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600 mb-6">Tell us more about yourself to get started.</p>

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
                                    placeholder="John"
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
                                    placeholder="Doe"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div className="mb-6">
                            <label htmlFor="username" className="block text-sm font-medium mb-1">
                                Username *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">@</span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-black'
                                        }`}
                                    placeholder="username"
                                />
                            </div>
                            {formData.username.length > 0 && !errors.username && (
                                <p className={`mt-1 text-sm ${getUsernameColor()}`}>
                                    {getUsernameHelperText()}
                                </p>
                            )}
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
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
                                placeholder="Tell us a little about yourself..."
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

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-md bg-black text-white font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
                                    }`}
                            >
                                {isSubmitting ? 'Saving...' : 'Complete Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}