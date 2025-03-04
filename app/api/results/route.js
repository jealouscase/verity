// app/api/results/route.js
import { searchResults } from '../search/route';

export async function GET(request) {
    try {
        console.log('Received GET request to /api/results');
        const url = new URL(request.url);
        const { searchParams } = url;
        const id = searchParams.get('id');
        
        console.log('Request URL:', request.url);
        console.log('Search ID:', id);
        console.log('Available search IDs:', Object.keys(searchResults));
        
        if (!id) {
            console.log('Missing search ID in request');
            return new Response(
                JSON.stringify({ error: 'Search ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // Retrieve results from our static object
        const searchData = searchResults[id];
        console.log('Search data lookup result:', searchData ? 'Found' : 'Not found');
        
        if (!searchData) {
            return new Response(
                JSON.stringify({ 
                    error: 'Search results not found. They may have expired or the server may have restarted.',
                    availableIds: Object.keys(searchResults) 
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // Debug: inspect what's in the data
        console.log('Results count:', searchData.results?.length || 0);
        console.log('Query info exists:', !!searchData.queryInfo);
        
        const responseData = {
            results: searchData.results || [],
            queryInfo: {
                query: searchData.queryInfo?.query || '',
                explanation: searchData.queryInfo?.explanation || ''
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