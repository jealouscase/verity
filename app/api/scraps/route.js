// app/api/scraps/route.js
import { executeQuery } from '../../../services/neo4jsService';

export async function GET(request) {
    console.log('📚 Scraps API: Fetching all scraps');

    try {
        // Get limit from URL parameters (optional)
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit'), 10) : 100;

        // Validate limit to prevent potential issues
        const validLimit = Math.min(Math.max(1, limit), 1000);

        console.log(`🔢 Fetching up to ${validLimit} scraps`);

        // Query to get all scraps with an optional limit
        const query = `
      MATCH (s:Scrap)
      RETURN s
      LIMIT ${validLimit}
    `;

        // Step 1: Execute the query against Neo4j
        console.log('🔄 Executing query against Neo4j');
        const results = await executeQuery(query);
        console.log(`✅ Query executed, received ${results.length} scraps`);

        // Step 2: Process results to extract Scrap objects
        console.log('🔄 Processing results');
        const processedResults = results.map(record => {
            // Find the scrap object in the record
            const scrap = Object.values(record).find(
                value => value && value.labels && value.labels.includes('Scrap')
            );

            if (!scrap) return null;

            return {
                id: scrap.id,
                content: scrap.content,
                tags: scrap.tags || [],
                metadata: scrap.metadata || {},
                // Any other properties you need
            };
        }).filter(Boolean); // Remove any null results

        console.log(`✅ Processed ${processedResults.length} valid scraps`);

        // Return results
        return new Response(
            JSON.stringify({
                results: processedResults,
                count: processedResults.length,
                limit: validLimit
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('💥 Unexpected error in scraps API:', error);
        return new Response(
            JSON.stringify({
                error: 'Scraps retrieval error',
                details: 'An unexpected error occurred while retrieving scraps. Please try again later.',
                technicalDetails: error.message
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}