// api/search.js
import { generateCypherQuery, validateQuery } from '../../services/openaiService';
import { executePromptQuery } from '../../services/neo4jService';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for search results
// In production, use Redis or another cache/database
const searchCache = new Map();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Generate a Cypher query from the natural language prompt
        const queryInfo = await generateCypherQuery(prompt);

        // Validate the query for safety
        await validateQuery(queryInfo.query);

        // Execute the query against Neo4j
        const results = await executePromptQuery(queryInfo.query);

        // Process results to normalize data structure
        const processedResults = results.map(record => {
            // Check all properties to find the scrap object
            const scrap = Object.values(record).find(
                value => value && value.labels && value.labels.includes('Scrap')
            );

            if (!scrap) return null;

            // Extract relationship info if it exists
            const relationships = [];
            Object.entries(record).forEach(([key, value]) => {
                if (key.includes('relationType') || key.includes('relationStrength')) {
                    const relIdx = key.match(/\d+$/)?.[0];
                    if (relIdx && record[`related${relIdx}`]) {
                        relationships.push({
                            type: record[`relationType${relIdx}`],
                            strength: record[`relationStrength${relIdx}`],
                            content: record[`related${relIdx}`].content,
                            id: record[`related${relIdx}`].id
                        });
                    }
                }
            });

            return {
                ...scrap,
                relationships
            };
        }).filter(Boolean);

        // Store results in cache with a unique ID
        const searchId = uuidv4();
        searchCache.set(searchId, {
            results: processedResults,
            queryInfo,
            timestamp: Date.now()
        });

        // Clean up old cache entries (older than 1 hour)
        const oneHourAgo = Date.now() - 3600000;
        for (const [key, value] of searchCache.entries()) {
            if (value.timestamp < oneHourAgo) {
                searchCache.delete(key);
            }
        }

        return res.status(200).json({ searchId });
    } catch (error) {
        console.error('Search API error:', error);
        return res.status(500).json({ error: error.message });
    }
}