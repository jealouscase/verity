// services/openaiService.js
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCypherQuery(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that translates natural language queries about a writing inspiration database into Neo4j Cypher queries.

The database contains writing "scraps" which are short text snippets that can inspire writers. Each scrap has:
- id: A unique identifier
- content: The actual text content
- tags: An array of descriptive tags
- metadata: A JSON string containing details like tone, setting, era, and characters
- Relationships to other scraps through RELATED_TO relationships with properties:
  - type: The kind of relationship (thematic_similarity, imagery, etc)
  - strength: A number from 0 to 1 indicating the strength of the relationship
  - aiReasoning: A text explanation of the relationship

Scraps are organized into Collections with CONTAINS relationships.

When generating a Cypher query:
1. Analyze the user's natural language request
2. Convert it to a precise Cypher query that will run in Neo4j
3. Return BOTH the Cypher query AND a brief explanation of how it works

Use proper Cypher syntax and account for the data model described above.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;

        // Parse the response to extract the Cypher query and explanation
        const queryMatch = content.match(/```(?:cypher)?\s*([\s\S]*?)```/);
        const query = queryMatch ? queryMatch[1].trim() : null;

        // Extract explanation (everything after the code block)
        let explanation = null;
        if (queryMatch) {
            const afterQuery = content.substring(content.indexOf(queryMatch[0]) + queryMatch[0].length).trim();
            if (afterQuery) {
                explanation = afterQuery;
            }
        }

        // If no code block is found, assume the whole response is the query
        if (!query) {
            return {
                query: content,
                explanation: null,
                rawResponse: content
            };
        }

        return {
            query,
            explanation,
            rawResponse: content
        };
    } catch (error) {
        console.error('Error generating Cypher query:', error);
        throw new Error(`Failed to generate query: ${error.message}`);
    }
}

// Function to validate that a query is safe to run
export async function validateQuery(query) {
    // Simple validation to prevent destructive operations
    const lowerQuery = query.toLowerCase();

    // Check for potentially destructive operations
    const dangerousOperations = [
        'delete', 'remove', 'drop', 'create index',
        'create constraint', 'merge', 'set', 'detach delete'
    ];

    for (const op of dangerousOperations) {
        if (lowerQuery.includes(op)) {
            throw new Error(`Query contains potentially dangerous operation: ${op}`);
        }
    }

    // Check that the query is only reading data
    if (!lowerQuery.includes('match') || !lowerQuery.includes('return')) {
        throw new Error('Query must be a read-only operation with MATCH and RETURN clauses');
    }

    return true;
}