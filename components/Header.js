'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, User, LogIn } from 'lucide-react';
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effect to apply theme class to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = (e) => {
        // Prevent any default behaviors
        e.preventDefault();
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="flex items-center justify-center">
            {/* Wrapper with fixed dimensions to prevent layout shifts */}
            <div className="w-20 h-10 relative select-none">
                {/* Background track - separate from interaction layer */}
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-full p-1"></div>

                {/* Interactive layer with pointer events */}
                <button
                    className="absolute inset-0 w-full h-full rounded-full focus:outline-none"
                    onClick={toggleTheme}
                    aria-pressed={isDarkMode}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    type="button"
                >
                    {/* Icons - positioned absolutely to prevent affecting layout */}
                    <Sun className={`absolute left-2 top-2 h-6 w-6 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
                    <Moon className={`absolute right-2 top-2 h-6 w-6 pointer-events-none ${isDarkMode ? 'text-blue-300' : 'text-gray-400'}`} />

                    {/* Slider knob with transform instead of positional properties */}
                    <div
                        className={`absolute top-1 left-1 bg-white dark:bg-gray-700 rounded-full shadow-md h-8 w-8 transform transition-transform duration-300 pointer-events-none ${isDarkMode ? 'translate-x-10' : 'translate-x-0'
                            }`}
                    />
                </button>
            </div>
        </div>
    );
}

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { user, profile, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-[#D8D8D8] py-4 px-8" >
            <div className="flex justify-between items-center">
                <div className="flex gap-8">
                    <Link className="text-xl" href={'/'}>Verity</Link>
                    <p className="text-xl font-semibold">Archive</p>
                    <Link className="text-xl" href={'/v1'}>v1</Link>
                </div>
                <input
                    type="text"
                    placeholder="Your next big idea..."
                    className="w-[700px] px-4 py-2 rounded-[16px] focus:outline-none focus:border-blue-500 border-black border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex gap-8 items-center">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-4">
                            <button
                                className="h-8 aspect-square rounded-full bg-white flex items-center justify-center shadow-md"
                                onClick={handleLogout}
                                title="Log out"
                            >
                                <LogOut size={16} className="text-black" />
                            </button>

                            <Link href="/profile">
                                <div className="flex items-center cursor-pointer group">
                                    <div className="mr-2">
                                        <span className="text-sm group-hover:underline">
                                            {profile?.firstName || user.email}
                                        </span>
                                        {profile?.username && (
                                            <p className="text-xs text-gray-600">@{profile.username}</p>
                                        )}
                                    </div>
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-[#A15555] flex items-center justify-center">
                                        {profile?.profilePicture ? (
                                            <Image
                                                src={profile.profilePicture}
                                                alt={`${profile.firstName} ${profile.lastName}`}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
                                                }}
                                            />
                                        ) : profile ? (
                                            <span className="text-white text-sm font-bold">
                                                {profile.firstName.charAt(0)}
                                                {profile.lastName.charAt(0)}
                                            </span>
                                        ) : (
                                            <Image
                                                src={'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'}
                                                height={40}
                                                width={40}
                                                alt="Profile picture"
                                            />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <button className="px-4 py-1 rounded-full bg-white flex items-center gap-2 shadow-md">
                                    <LogIn size={16} className="text-black" />
                                    <span className="text-sm font-medium">Log In</span>
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="px-4 py-1 rounded-full bg-black text-white flex items-center gap-2 shadow-md">
                                    <User size={16} />
                                    <span className="text-sm font-medium">Sign Up</span>
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header