// app/api/search/route.js
import { v4 as uuidv4 } from 'uuid';
import { generateCypherQuery, validateQuery } from '../../../services/openaiService';
import { executePromptQuery } from '../../../services/neo4jsService';

// Create a static object to store search results
const searchResults = {};

// Function to help with detailed error reporting
const logErrorDetails = (error, context) => {
    console.error(`Error in ${context}:`, error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // For API errors that might have a response
    if (error.response) {
        console.error('API Response:', error.response.data);
    }

    return `${context}: ${error.message}`;
};

export async function POST(request) {
    try {
        console.log('Received POST request to /api/search');

        // Parse request body
        let body;
        try {
            body = await request.json();
            console.log('Request body:', body);
        } catch (e) {
            const errorMsg = logErrorDetails(e, 'Request parsing');
            return new Response(
                JSON.stringify({ error: errorMsg }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { prompt } = body;

        if (!prompt) {
            console.log('Missing prompt in request');
            return new Response(
                JSON.stringify({ error: 'Prompt is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate a Cypher query from the natural language prompt
        let queryInfo;
        try {
            console.log('Generating Cypher query for prompt:', prompt);
            queryInfo = await generateCypherQuery(prompt);
            console.log('Generated query info:', JSON.stringify(queryInfo, null, 2));
            if (!queryInfo || !queryInfo.query) {
                throw new Error('Generated query is empty or invalid');
            }
            console.log('Generated query:', queryInfo.query);
        } catch (error) {
            const errorMsg = logErrorDetails(error, 'Query generation');
            console.error('Full error details:', {
                error: error,
                queryInfo: queryInfo,
                prompt: prompt
            });
            return new Response(
                JSON.stringify({ error: errorMsg }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validate the query for safety
        try {
            console.log('Validating query');
            await validateQuery(queryInfo.query);
            console.log('Query validation successful');
        } catch (error) {
            const errorMsg = logErrorDetails(error, 'Query validation');
            return new Response(
                JSON.stringify({ error: errorMsg }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Execute the query against Neo4j
        let results;
        try {
            console.log('Executing query against Neo4j');
            results = await executePromptQuery(queryInfo.query);
            console.log('Query executed successfully, results count:', results.length);
        } catch (error) {
            const errorMsg = logErrorDetails(error, 'Query execution');
            return new Response(
                JSON.stringify({ error: errorMsg }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Process results
        let processedResults;
        try {
            console.log('Processing results');
            processedResults = results.map(record => {
                // Check all properties to find the scrap object
                const scrap = Object.values(record).find(
                    value => value && value.labels && value.labels.includes('Scrap')
                );

                if (!scrap) return null;

                return {
                    ...scrap,
                    relationships: []
                };
            }).filter(Boolean);

            console.log('Processed results count:', processedResults.length);
        } catch (error) {
            const errorMsg = logErrorDetails(error, 'Results processing');
            return new Response(
                JSON.stringify({ error: errorMsg }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Store results
        try {
            const searchId = uuidv4();
            searchResults[searchId] = {
                results: processedResults,
                queryInfo,
                timestamp: Date.now()
            };

            console.log('Results stored with ID:', searchId);
            console.log('Available search IDs:', Object.keys(searchResults));

            return new Response(
                JSON.stringify({ searchId }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } catch (error) {
            const errorMsg = logErrorDetails(error, 'Results storage');
            return new Response(
                JSON.stringify({ error: errorMsg }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        const errorMsg = logErrorDetails(error, 'Unexpected error');
        return new Response(
            JSON.stringify({ error: errorMsg }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Export the searchResults object so it can be imported by the results route
export { searchResults };