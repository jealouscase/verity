// app/api/results/route.js
import { searchResults } from '../search/route';

export async function GET(request) {
    console.log('📋 Received results request');

    try {
        // Extract search ID from URL params
        const url = new URL(request.url);
        const searchId = url.searchParams.get('id');
        console.log('🔑 Requested search ID:', searchId);

        if (!searchId) {
            console.log('❌ No search ID provided');
            return new Response(
                JSON.stringify({ error: 'Search ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if we have results for this ID
        console.log('🔍 Looking up search results');
        console.log('📊 Available IDs:', Object.keys(searchResults));

        const searchData = searchResults[searchId];

        if (!searchData) {
            console.log('❌ No results found for ID:', searchId);
            return new Response(
                JSON.stringify({
                    error: 'Search results not found. They may have expired or the server may have restarted.'
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(`✅ Found results: ${searchData.results.length} items`);

        // Return the cached results
        return new Response(
            JSON.stringify({
                results: searchData.results,
                queryInfo: searchData.queryInfo
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('💥 Error in results API:', error);
        return new Response(
            JSON.stringify({ error: `Results error: ${error.message}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}