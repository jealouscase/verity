// app/api/search/route.js
import { v4 as uuidv4 } from 'uuid';
import searchCache from '../../../services/cacheService';

// Create a simple mock implementation for testing
// Remove this once the actual services are working
const mockGenerateCypherQuery = async (prompt) => {
  console.log('Mock generating Cypher query for:', prompt);
  return {
    query: `MATCH (s:Scrap) 
            WHERE s.content CONTAINS "${prompt}" 
            RETURN s LIMIT 10`,
    explanation: "This is a mock query explanation."
  };
};

const mockValidateQuery = async (query) => {
  console.log('Mock validating query:', query);
  return true;
};

const mockExecutePromptQuery = async (query) => {
  console.log('Mock executing query:', query);
  // Return mock results
  return [
    {
      s: {
        id: "scrap1",
        content: "The waves broke and spread their waters swiftly over the shore.",
        tags: ["nature", "imagery", "water"],
        labels: ["Scrap"],
        metadata: { tone: "descriptive", setting: "beach" }
      }
    },
    {
      s: {
        id: "scrap2",
        content: "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
        tags: ["cooking", "balance", "transformation"],
        labels: ["Scrap"],
        metadata: { tone: "instructive" }
      }
    }
  ];
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
            console.error('Error parsing request body:', e);
            return new Response(
                JSON.stringify({ error: 'Invalid request body' }),
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

        // For debugging/testing, use mock implementations 
        // Replace with actual implementations when ready
        try {
            // Generate a Cypher query from the natural language prompt
            const queryInfo = await mockGenerateCypherQuery(prompt);
            console.log('Generated query info:', queryInfo);

            // Validate the query for safety
            await mockValidateQuery(queryInfo.query);
            console.log('Query validated successfully');

            // Execute the query against Neo4j
            const results = await mockExecutePromptQuery(queryInfo.query);
            console.log('Query execution results:', results);

            // Process results to normalize data structure
            const processedResults = results.map(record => {
                // Check all properties to find the scrap object
                const scrap = Object.values(record).find(
                    value => value && value.labels && value.labels.includes('Scrap')
                );

                if (!scrap) return null;

                // For the mock implementation, we don't have relationships
                return {
                    ...scrap,
                    relationships: []
                };
            }).filter(Boolean);

            console.log('Processed results:', processedResults);

            // Store results in cache with a unique ID
            const searchId = uuidv4();
            searchCache.set(searchId, {
                results: processedResults,
                queryInfo,
                timestamp: Date.now()
            });
            console.log('Results stored in cache with ID:', searchId);

            // Clean up old cache entries
            searchCache.cleanOldEntries();

            return new Response(
                JSON.stringify({ searchId }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } catch (error) {
            console.error('Error during search processing:', error);
            return new Response(
                JSON.stringify({ error: `Search processing error: ${error.message}` }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error('Unexpected error in search API:', error);
        return new Response(
            JSON.stringify({ error: `Unexpected error: ${error.message}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}