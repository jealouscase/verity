// services/openaiService.js
import OpenAI from 'openai';

// Create a function to get the OpenAI client instead of initializing it at the module level
function getOpenAIClient() {
  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is missing. Please check your environment variables.');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
}

export async function generateCypherQuery(prompt) {
  try {
    // Get the OpenAI client only when the function is called
    const openai = getOpenAIClient();
    
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
- Relationships to other scraps through RELATED_TO relationships

Return ONLY the Cypher query without explanation.`
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