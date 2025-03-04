// app/service-test/page.js
'use client'
import { useState } from 'react';

const ServiceTester = () => {
    const [loading, setLoading] = useState({
        neo4j: false,
        openai: false
    });
    const [results, setResults] = useState({
        neo4j: null,
        openai: null
    });
    const [errors, setErrors] = useState({
        neo4j: null,
        openai: null
    });
    const [query, setQuery] = useState('MATCH (s:Scrap) RETURN s LIMIT 5');
    const [prompt, setPrompt] = useState('Find scraps about nature');

    // Test Neo4j connection through API route
    const testNeo4j = async () => {
        setLoading(prev => ({ ...prev, neo4j: true }));
        setErrors(prev => ({ ...prev, neo4j: null }));
        setResults(prev => ({ ...prev, neo4j: null }));

        try {
            console.log('🔍 Testing Neo4j with query:', query);

            const response = await fetch('/api/test-neo4j', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details?.message || 'Failed to connect to Neo4j');
            }

            console.log('✅ Neo4j query executed successfully');
            setResults(prev => ({ ...prev, neo4j: data }));
        } catch (error) {
            console.error('💥 Neo4j test error:', error);
            setErrors(prev => ({ ...prev, neo4j: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, neo4j: false }));
        }
    };

    // Test OpenAI service through API route
    const testOpenAI = async () => {
        setLoading(prev => ({ ...prev, openai: true }));
        setErrors(prev => ({ ...prev, openai: null }));
        setResults(prev => ({ ...prev, openai: null }));

        try {
            console.log('🧠 Testing OpenAI with prompt:', prompt);

            const response = await fetch('/api/test-openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details?.message || 'Failed to connect to OpenAI');
            }

            console.log('✅ OpenAI query generation successful');
            setResults(prev => ({ ...prev, openai: data }));
        } catch (error) {
            console.error('💥 OpenAI test error:', error);
            setErrors(prev => ({ ...prev, openai: error.message }));
        } finally {
            setLoading(prev => ({ ...prev, openai: false }));
        }
    };

    // Format JSON for display
    const formatJSON = (data) => {
        return JSON.stringify(data, null, 2);
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Services Test Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Neo4j Test Panel */}
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Test Neo4j Connection</h2>

                    <div className="mb-4">
                        <label htmlFor="neo4j-query" className="block mb-2 font-medium">
                            Cypher Query:
                        </label>
                        <textarea
                            id="neo4j-query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-3 border rounded-md font-mono text-sm"
                            rows={3}
                        />
                    </div>

                    <button
                        onClick={testNeo4j}
                        disabled={loading.neo4j}
                        className={`px-4 py-2 rounded-md text-white font-medium mb-4 ${loading.neo4j ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading.neo4j ? 'Testing...' : 'Test Neo4j Connection'}
                    </button>

                    {errors.neo4j && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            <strong>Error:</strong> {errors.neo4j}
                        </div>
                    )}

                    {results.neo4j && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Results:</h3>
                            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-80">
                                <pre className="text-xs">{formatJSON(results.neo4j)}</pre>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                Found {Array.isArray(results.neo4j) ? results.neo4j.length : 0} records
                            </p>
                        </div>
                    )}
                </div>

                {/* OpenAI Test Panel */}
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Test OpenAI Service</h2>

                    <div className="mb-4">
                        <label htmlFor="openai-prompt" className="block mb-2 font-medium">
                            Natural Language Prompt:
                        </label>
                        <textarea
                            id="openai-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-3 border rounded-md"
                            rows={3}
                        />
                    </div>

                    <button
                        onClick={testOpenAI}
                        disabled={loading.openai}
                        className={`px-4 py-2 rounded-md text-white font-medium mb-4 ${loading.openai ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {loading.openai ? 'Testing...' : 'Test OpenAI Service'}
                    </button>

                    {errors.openai && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            <strong>Error:</strong> {errors.openai}
                        </div>
                    )}

                    {results.openai && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Generated Query:</h3>
                            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-80">
                                <pre className="text-xs whitespace-pre-wrap">{results.openai.query}</pre>
                            </div>

                            {results.openai.validationError && (
                                <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded-md">
                                    <strong>Validation Warning:</strong> {results.openai.validationError}
                                </div>
                            )}

                            {results.openai.explanation && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">Explanation:</h3>
                                    <div className="bg-gray-50 p-4 rounded-md text-sm">
                                        {results.openai.explanation}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-md">
                <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Make sure all environment variables are set correctly in your <code>.env.local</code> file.</li>
                    <li>Check that your Neo4j database is running and accessible from your server.</li>
                    <li>Verify your OpenAI API key has sufficient credits and permissions.</li>
                    <li>Review server logs in your terminal for more detailed error messages.</li>
                    <li>Try simple queries first to validate basic connectivity.</li>
                </ul>
            </div>
        </div>
    );
};

export default function ServiceTestPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <ServiceTester />
        </div>
    );
}