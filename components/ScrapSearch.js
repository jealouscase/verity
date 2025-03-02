// components/ScrapSearch.jsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ScrapSearch = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Search request failed');
            }

            const data = await response.json();

            // Update: Use searchParams syntax for App Router
            router.push(`/search?q=${encodeURIComponent(prompt)}&id=${encodeURIComponent(data.searchId)}`);

        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to perform search. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Verity Search v1</h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <div className="flex flex-col">
                    <label htmlFor="prompt" className="mb-1 text-sm font-medium">
                        Describe what you're looking for
                    </label>
                    <textarea
                        id="prompt"
                        placeholder="e.g., 'Find scraps about nature that have a melancholy tone' or 'Show me metaphors that connect to identity'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className={`px-4 py-2 rounded-md text-white font-medium ${isLoading || !prompt.trim()
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Example Prompts</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Find scraps that talk about rebellion or breaking norms</li>
                    <li>Show me philosophical quotes about identity</li>
                    <li>What scraps use natural imagery?</li>
                    <li>Find connections between cooking and transformation</li>
                    <li>Show me scraps with a solemn or ominous tone</li>
                </ul>
            </div>
        </div>
    );
};

export default ScrapSearch;