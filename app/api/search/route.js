// app/api/search/route.js
import { generateCypherQuery, validateQuery } from '../../../services/openaiService';
import { executeQuery } from '../../../services/neo4jsService';

export async function POST(request) {
  console.log('🔍 Search API: Received search request');
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('📝 Request prompt:', body.prompt);
    
    if (!body.prompt) {
      console.log('❌ No prompt provided');
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Generate Cypher query from natural language prompt
    console.log('🧠 Generating Cypher query');
    const queryInfo = await generateCypherQuery(body.prompt);
    
    if (!queryInfo || !queryInfo.query) {
      console.log('❌ Failed to generate a valid query');
      return new Response(
        JSON.stringify({ error: 'Failed to generate a valid query' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ Generated query:', queryInfo.query);

    // Step 2: Validate the query for safety
    console.log('🛡️ Validating query for safety');
    try {
      await validateQuery(queryInfo.query);
      console.log('✅ Query validation passed');
    } catch (error) {
      console.error('❌ Query validation failed:', error.message);
      return new Response(
        JSON.stringify({ error: `Invalid query: ${error.message}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Execute the query against Neo4j
    console.log('🔄 Executing query against Neo4j');
    const results = await executeQuery(queryInfo.query);
    console.log(`✅ Query executed, received ${results.length} results`);

    // Step 4: Process results to extract Scrap objects
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
    
    console.log(`✅ Processed ${processedResults.length} valid results`);

    // Return results directly
    return new Response(
      JSON.stringify({ 
        results: processedResults,
        queryInfo: {
          query: queryInfo.query,
          explanation: queryInfo.explanation || ''
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Unexpected error in search API:', error);
    return new Response(
      JSON.stringify({ error: `Search error: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}