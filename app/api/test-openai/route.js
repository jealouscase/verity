// app/api/test-openai/route.js
import { generateCypherQuery, validateQuery } from '../../../services/openaiService';

export async function POST(request) {
    console.log('🤖 OpenAI Test Route: Received request');

    try {
        // Parse request body
        const body = await request.json();
        const prompt = body.prompt || 'Find scraps about nature';

        console.log(`🔍 Processing prompt: "${prompt}"`);

        // Generate Cypher query
        console.log('🧠 Generating Cypher query from prompt');
        const queryInfo = await generateCypherQuery(prompt);
        console.log('✅ Successfully generated query');

        // Validate the query (optional)
        try {
            console.log('🛡️ Validating generated query');
            await validateQuery(queryInfo.query);
            queryInfo.isValid = true;
            console.log('✅ Query validation passed');
        } catch (validationError) {
            console.warn('⚠️ Query validation warning:', validationError.message);
            queryInfo.isValid = false;
            queryInfo.validationError = validationError.message;
        }

        return new Response(
            JSON.stringify(queryInfo),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('💥 OpenAI test error:', error);

        // Determine error category for better diagnostics
        let errorCategory = 'unknown';
        if (error.response?.status === 401) {
            errorCategory = 'authentication';
        } else if (error.response?.status === 429) {
            errorCategory = 'rate_limit';
        } else if (error.message?.includes('network')) {
            errorCategory = 'network';
        } else if (error.message?.includes('timeout')) {
            errorCategory = 'timeout';
        }

        // Provide detailed error information
        const errorDetails = {
            message: error.message,
            category: errorCategory,
            status: error.response?.status,
            openaiError: error.response?.data?.error
        };

        return new Response(
            JSON.stringify({
                error: 'OpenAI service test failed',
                details: errorDetails
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}