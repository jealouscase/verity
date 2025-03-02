// app/api/results/route.js
import searchCache from '../../../services/cacheService';
export async function GET(request) {
    try {
        console.log('Received GET request to /api/results');
        const url = new URL(request.url);
        const { searchParams } = url;
        const id = searchParams.get('id');
        console.log('Request URL:', request.url);
        console.log('Search ID:', id);
        if (!id) {
            console.log('Missing search ID in request');
            return new Response(
                JSON.stringify({ error: 'Search ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        // Retrieve results from cache
        const cachedSearch = searchCache.get(id);
        console.log('Cache lookup result:', cachedSearch ? 'Found' : 'Not found');
        if (!cachedSearch) {
            return new Response(
                JSON.stringify({ error: 'Search results not found. They may have expired.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        // Debug: inspect what's in the cache
        console.log('Results count:', cachedSearch.results?.length || 0);
        console.log('Query info exists:', !!cachedSearch.queryInfo);
        const responseData = {
            results: cachedSearch.results || [],
            queryInfo: {
                query: cachedSearch.queryInfo?.query || '',
                explanation: cachedSearch.queryInfo?.explanation || ''
            }
        };
        return new Response(
            JSON.stringify(responseData),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Results API error:', error);
        return new Response(
            JSON.stringify({ error: `Results API error: ${error.message}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
