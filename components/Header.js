'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

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

    return (
        <header className="bg-[#D8D8D8] py-4 px-8" >
            <div className="flex justify-between items-center">
                <div className="flex gap-8">
                    <p className="text-xl">Verity</p>
                    <p className="text-xl font-semibold">Archive</p>
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
                    <button className="h-8 aspect-square rounded-full bg-white flex items-center justify-center shadow-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-black"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <Image
                        src={'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'}
                        height={40}
                        width={40}
                        alt="Profile picture"
                    />
                </div>
            </div>
        </header>
    )
}

export default Header