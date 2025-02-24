'use client'
import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

const WordScrambler = () => {
    const [inputText, setInputText] = useState('');
    const [words, setWords] = useState([]);
    const [hoveredWord, setHoveredWord] = useState(null);

    // List of replacement nouns
    const replacementNouns = [
        'cat', 'house', 'book', 'tree', 'car', 'phone', 'computer', 'coffee', 'desk',
        'chair', 'window', 'door', 'garden', 'bird', 'mountain', 'ocean', 'camera',
        'pencil', 'jacket', 'shoes', 'piano', 'flower', 'painting', 'bicycle', 'clock',
        'lamp', 'mirror', 'plate', 'bottle', 'guitar'
    ];

    // Handle input change and space bar in input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputText(value);

        if (value.endsWith(' ')) {
            const newWord = value.trim();
            if (newWord) {
                setWords([...words, { text: newWord, isLocked: true }]);
                setInputText('');
            }
        }
    };

    // Handle space bar press anywhere
    useEffect(() => {
        const handleSpaceBar = (e) => {
            if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                scrambleUnlockedWords();
            }
        };

        window.addEventListener('keydown', handleSpaceBar);
        return () => window.removeEventListener('keydown', handleSpaceBar);
    }, [words]);

    // Scramble unlocked words
    const scrambleUnlockedWords = () => {
        setWords(words.map(word => {
            if (!word.isLocked) {
                return {
                    text: replacementNouns[Math.floor(Math.random() * replacementNouns.length)],
                    isLocked: false
                };
            }
            return word;
        }));
    };

    // Toggle word lock
    const toggleLock = (index) => {
        setWords(words.map((word, i) =>
            i === index ? { ...word, isLocked: !word.isLocked } : word
        ));
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 p-4 bg-gray-50 rounded-lg shadow flex flex-col items-center gap-4">
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    className="w-48 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a sentence..."
                />
                <div className="mt-4 flex flex-wrap gap-2">
                    {words.map((word, index) => (
                        <div
                            key={index}
                            className={`
                  relative group px-2 py-1 rounded cursor-pointer
                  ${hoveredWord === index ? 'bg-gray-200' : 'bg-white'}
                  transition-colors duration-200
                `}
                            onMouseEnter={() => setHoveredWord(index)}
                            onMouseLeave={() => setHoveredWord(null)}
                            onClick={() => toggleLock(index)}
                        >
                            <span>{word.text}</span>
                            <div className={`
                  absolute -top-3 left-1/2 transform -translate-x-1/2
                  transition-opacity duration-200
                  ${(!word.isLocked && hoveredWord !== index) ? 'opacity-0' : 'opacity-100'}
                `}>
                                {word.isLocked ? (
                                    <Lock size={12} className="text-black" />
                                ) : (
                                    <Unlock size={12} className="text-black" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WordScrambler;