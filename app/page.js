"use client"
import ScrapModal from '@/components/ScrapModal';
import { useState, useEffect } from 'react';

export default function Home() {
    const [scraps, setScraps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedScrap, setSelectedScrap] = useState(null);

    useEffect(() => {
        async function fetchScraps() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/api/scraps');

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch scraps');
                }

                const data = await response.json();
                setScraps(data.results || []);
            } catch (err) {
                console.error('Error fetching scraps:', err);
                setError(err.message || 'An error occurred while fetching scraps');
            } finally {
                setIsLoading(false);
            }
        }

        fetchScraps();
    }, []);

    const expandScrap = (scrap) => {
        setSelectedScrap(scrap);
        setIsModalOpen(true);
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
                    <p className="text-lg">Loading scraps...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Scraps</h2>
                    <p className="text-gray-800">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (scraps.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-md">
                    <h2 className="text-xl font-bold mb-2">No Scraps Found</h2>
                    <p className="text-gray-600">There are no scraps in the database yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {isModalOpen && selectedScrap && (
                <ScrapModal
                    scrap={selectedScrap}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedScrap(null);
                    }}
                />
            )}
            <main className="p-20">
                <div className="grid grid-cols-5 gap-3">
                    {scraps.map((scrap, index) => (
                        <div
                            key={index}
                            className="aspect-square bg-white rounded-[16px] border-[1px] border-black p-5 overflow-scroll"
                            onClick={() => expandScrap(scrap)}
                        >
                            <p className="font-medium">{scrap.content}</p>
                            {scrap.tags && scrap.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {scrap.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                    {scrap.tags.length > 3 && (
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                            +{scrap.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}