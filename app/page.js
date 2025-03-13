"use client"
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

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");

    const sampleEntries = {
        "texts": [
            "The causes of mortality in the army in the East: preventable diseases outrank all other causes",
            "Good morning! I trust your coffee has been strong and your emails short",
            "She's (cough) just a friend",
            "I'm in love but I'm feeling low For I am just a footprint in the snow I'm in love with us by now But that's a feeling I can never show For a reality between lucky me I'm searching for planes in the sea and that's it Soil just needs water to be and a seed So if we turn into a tree can I be the leaves?",
            "My sales manager would hate this email and that's why it's perfect",
            "The waves broke and spread their waters swiftly over the shore. One after another, they massed themselves and fell; the spray tossed itself back with the energy of their fall.",
            "The waves broke and spread their waters swiftly over the shore. One after another, they massed themselves and fell; the spray tossed itself back with the energy of their fall.",
            "The world will little note, nor long remember what we say here, but it can never forget what they did here.",
            "The causes of mortality in the army in the East: preventable diseases outrank all other causes",
            "Each petal of the rose chart blossoms with death, showing where sanitation failed* (*Statistical data given the emotional power of a flower.",
            "We are like people living in a cave, watching shadows on the wall, mistaking them for reality* (*Reality reimagined as an illusion of flickering shadows.",
            "One is not born, but rather becomes, a woman.",
            "One is not born, but rather becomes, a woman.",
            "I hear the approaching thunder that, one day, will destroy us too.",
            "Here's to the crazy ones. The misfits. The rebels. The troublemakers. They push the human race forward",
            "Gold-threaded gowns gleam in defiance of laws, their wearers cloaked in rebellion.",
            "One is not born, but rather becomes, a woman.",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms"
        ]
    }

    const filteredEntries = sampleEntries.texts.filter((text) =>
        text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header with search bar */}
            <header className="bg-[#D8D8D8] py-4 px-8">
                <div className="flex justify-between items-center">
                    <div className="flex gap-8">
                        <p>Verity</p>
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

            {/* Grid container */}
            <main className="p-20 bg-[#F6F5F5]">
                <div className="grid grid-cols-5 gap-3">
                    {filteredEntries.map((text, index) => (
                        <div
                            key={index}
                            className="aspect-square bg-white rounded-[16px] border-[1px] border-black p-5 overflow-scroll"
                        >
                            <p className="font-medium">{text}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
