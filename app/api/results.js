// api/results.js
// In-memory store for search results (same as in search.js)
// In production, use Redis or another cache/database
const searchCache = new Map();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Search ID is required' });
        }

        // Retrieve results from cache
        const cachedSearch = searchCache.get(id);

        if (!cachedSearch) {
            return res.status(404).json({ error: 'Search results not found. They may have expired.' });
        }

        return res.status(200).json({
            results: cachedSearch.results,
            queryInfo: {
                query: cachedSearch.queryInfo.query,
                explanation: cachedSearch.queryInfo.explanation
            }
        });
    } catch (error) {
        console.error('Results API error:', error);
        return res.status(500).json({ error: error.message });
    }
}