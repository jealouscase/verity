// app/api/test-neo4j/route.js
import { executeQuery } from '../../../services/neo4jsService';

export async function POST(request) {
    console.log('📊 Neo4j Test Route: Received request');

    try {
        // Parse request body
        const body = await request.json();
        const query = body.query || 'MATCH (s:Scrap) RETURN s LIMIT 5';

        console.log(`🔍 Executing query: ${query}`);

        // Execute the query
        const results = await executeQuery(query);
        console.log(`✅ Query executed successfully. Found ${results.length} results`);

        return new Response(
            JSON.stringify(results),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('💥 Neo4j test error:', error);

        // Provide detailed error information
        const errorDetails = {
            message: error.message,
            code: error.code,
            // Add Neo4j specific error details if available
            neo4jError: error.code?.startsWith('Neo.') ? error.message : undefined,
            connectionError: error.message?.includes('connect') ? true : undefined
        };

        return new Response(
            JSON.stringify({
                error: 'Neo4j connection test failed',
                details: errorDetails
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}